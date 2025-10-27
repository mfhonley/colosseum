import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ImprovedFarmerDashboard({ farmId, dashboardData, onRefresh, onBack }) {
  const [farmStats, setFarmStats] = useState(null);
  const [balance, setBalance] = useState(null);
  const [blockchainBalance, setBlockchainBalance] = useState(null); // NEW: Real blockchain balance
  const [nfts, setNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [tokenMintAddress, setTokenMintAddress] = useState(null);

  useEffect(() => {
    loadAllData();
  }, [farmId, dashboardData]);

  const loadAllData = async () => {
    await Promise.all([
      loadFarmData(),
      loadNFTs(),
      loadBlockchainBalance() // NEW
    ]);
  };

  const loadFarmData = async () => {
    try {
      const stats = await api.getFarmStatistics(farmId);
      setFarmStats(stats);

      const bal = await api.getFarmBalance(farmId);
      setBalance(bal);
    } catch (err) {
      console.error('Failed to load farm data:', err);
    }
  };

  const loadBlockchainBalance = async () => {
    try {
      const wcBalance = await api.getWaterCreditsBalance(farmId);
      if (wcBalance.success) {
        setBlockchainBalance(wcBalance);
        setTokenMintAddress(wcBalance.mint_address);
      }
    } catch (err) {
      console.error('Failed to load blockchain balance:', err);
    }
  };

  const loadNFTs = async () => {
    try {
      const farmNFTs = await api.getFarmNFTs(farmId);
      setNfts(farmNFTs);
    } catch (err) {
      console.error('Failed to load NFTs:', err);
    }
  };

  const handleMintQuota = async () => {
    try {
      setLoading(true);
      alert('Minting 100,000 WaterCredits on Solana...');

      const result = await api.mintQuotaToFarmer(farmId, 100000);

      if (result.success) {
        alert(`✅ Minted 100,000 WC!\n\nTransaction: ${result.transaction_signature}\n\nCheck Solana Explorer for details.`);
        await loadBlockchainBalance();
      }
    } catch (err) {
      console.error('Failed to mint quota:', err);
      alert(`❌ Failed to mint quota: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!farmStats) return;

    try {
      setLoading(true);
      alert('Minting NFT Certificate on Solana...');

      const nft = await api.mintNFT(farmId, farmStats.total_water_used, 0.95);
      await loadNFTs();

      alert(`✅ NFT minted!\n\nMint Address: ${nft.nft_address}`);
    } catch (err) {
      console.error('Failed to mint NFT:', err);
      alert(`❌ Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!farmStats || !balance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const usageHistory = dashboardData?.water_usage_history
    ?.filter(record => record.farm_id === farmId)
    ?.slice(0, 20)
    ?.reverse() || [];

  const chartData = usageHistory.map(record => ({
    time: new Date(record.timestamp).toLocaleTimeString(),
    water: record.water_liters,
    temp: record.temperature_c,
  }));

  const statusColor = farmStats.status === 'economy' ? 'text-green-600' : 'text-red-600';
  const statusBg = farmStats.status === 'economy' ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-white hover:text-blue-100 transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold">Farm #{farmId} Dashboard</h1>
                <p className="text-blue-100 mt-1">Real-time monitoring on Solana blockchain</p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 font-semibold shadow-md transition-all"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'credits', label: '💎 WaterCredits', icon: '💎' },
              { id: 'nfts', label: '🏆 NFT Certificates', icon: '🏆' },
              { id: 'history', label: '📜 History', icon: '📜' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <div className="text-sm text-gray-600 mb-1">Water Used</div>
                <div className="text-3xl font-bold text-gray-900">
                  {farmStats.total_water_used.toLocaleString()}L
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  of {farmStats.water_limit.toLocaleString()}L
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <div className="text-sm text-gray-600 mb-1">Usage</div>
                <div className="text-3xl font-bold text-gray-900">
                  {farmStats.percentage_used.toFixed(1)}%
                </div>
                <div className={`text-xs mt-1 font-semibold ${statusColor}`}>
                  {farmStats.status === 'economy' ? '✓ Within limit' : '⚠ Over limit'}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <div className="text-sm text-gray-600 mb-1">Tokens Left</div>
                <div className="text-3xl font-bold text-purple-600">
                  {balance.balance.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">WaterCredits</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${statusBg} ${statusColor}`}>
                  {farmStats.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Blockchain Status Banner */}
            {blockchainBalance && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-2">🔗 Blockchain Status</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="opacity-80">On-Chain Balance:</span>
                        <span className="ml-2 font-bold">{blockchainBalance.balance.toLocaleString()} WC</span>
                      </div>
                      <div>
                        <span className="opacity-80">Token Account:</span>
                        <span className="ml-2 font-mono text-xs">{blockchainBalance.token_account?.substring(0, 20)}...</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://explorer.solana.com/address/${tokenMintAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-md"
                  >
                    View on Solana Explorer →
                  </a>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">💧 Water Usage Timeline</h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="water"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      name="Water (L)"
                      dot={{ fill: '#3B82F6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                  No usage data available yet. Oracle will send data every 30 seconds.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-center mb-8">
                <div className="text-7xl mb-4">💎</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">WaterCredits Wallet</h2>
                <p className="text-gray-600 text-lg">SPL Token on Solana Blockchain</p>
              </div>

              {blockchainBalance && blockchainBalance.success ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                      <div className="text-sm text-blue-800 font-semibold mb-2">🔗 On-Chain Balance</div>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {blockchainBalance.balance.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-700 font-medium">WaterCredits (Real)</div>
                      <div className="mt-3 text-xs text-blue-600">
                        ✓ Verified on Solana
                      </div>
                    </div>

                    <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                      <div className="text-sm text-gray-700 font-semibold mb-2">🔥 Total Burned</div>
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {balance.total_consumed.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">tokens burned</div>
                      <div className="mt-3 text-xs text-gray-600">
                        When water is used
                      </div>
                    </div>

                    <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                      <div className="text-sm text-green-800 font-semibold mb-2">🪙 Total Minted</div>
                      <div className="text-4xl font-bold text-green-600 mb-1">
                        {balance.total_minted.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-700 font-medium">tokens allocated</div>
                      <div className="mt-3 text-xs text-green-600">
                        Monthly quota
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-blue-900 mb-3 text-lg">📡 Blockchain Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Token Mint:</span>
                        <a
                          href={`https://explorer.solana.com/address/${blockchainBalance.mint_address}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          {blockchainBalance.mint_address?.substring(0, 30)}...
                        </a>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Token Account:</span>
                        <a
                          href={`https://explorer.solana.com/address/${blockchainBalance.token_account}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          {blockchainBalance.token_account?.substring(0, 30)}...
                        </a>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Network:</span>
                        <span className="font-semibold text-blue-900">Solana Devnet</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleMintQuota}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold text-lg shadow-lg disabled:opacity-50 transition-all"
                  >
                    {loading ? '⏳ Minting...' : '🪙 Mint 100,000 WC Quota'}
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-gray-600 mb-6">WaterCredits token not initialized yet</p>
                  <button
                    onClick={handleMintQuota}
                    disabled={loading}
                    className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 font-bold text-lg shadow-lg disabled:opacity-50"
                  >
                    {loading ? '⏳ Initializing...' : '🚀 Initialize WaterCredits'}
                  </button>
                </div>
              )}

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mt-6">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  How WaterCredits Work
                </h3>
                <ul className="text-sm text-yellow-800 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>1 WaterCredit = 1 Liter</strong> of water usage right</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Tokens are <strong>minted monthly</strong> as your water quota</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>When you use water, tokens are <strong>automatically burned</strong> (destroyed)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Stay within your quota to maintain <strong>ECONOMY</strong> status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>All transactions are <strong>recorded on Solana blockchain</strong> (transparent & immutable)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NFT Certificates
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Earn on-chain certificates for water efficiency achievements
                  </p>
                </div>
                <button
                  onClick={handleMintNFT}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Minting...' : '🎨 Mint New NFT'}
                </button>
              </div>

              {nfts.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border-2 border-dashed border-purple-200">
                  <div className="text-7xl mb-4">🏆</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No NFT certificates yet</h3>
                  <p className="text-gray-600 mb-4">
                    Maintain high water efficiency to earn NFT certificates on Solana blockchain
                  </p>
                  <p className="text-sm text-purple-600">
                    Click "Mint New NFT" to create your first certificate
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft, index) => (
                    <div
                      key={index}
                      className="border-2 border-purple-200 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-400 transition-all bg-gradient-to-br from-purple-50 to-pink-50"
                    >
                      {/* NFT Image Preview */}
                      <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-8 text-center">
                        <div className="text-6xl mb-2">🏆</div>
                        <div className="text-white font-bold text-lg">
                          Water Efficiency Certificate
                        </div>
                        <div className="text-purple-100 text-sm mt-1">
                          Farm #{farmId}
                        </div>
                      </div>

                      {/* NFT Details */}
                      <div className="p-5">
                        <div className="mb-4">
                          <div className="text-xs font-semibold text-gray-500 mb-1">NFT Mint Address</div>
                          <div className="text-xs font-mono bg-white p-2 rounded-lg border border-purple-200 break-all shadow-sm">
                            {nft.nft_address.substring(0, 20)}...
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">Water Used</div>
                            <div className="text-lg font-bold text-gray-900">
                              {nft.metadata.attributes?.find(a => a.trait_type === 'Water Consumed')?.value || `${nft.metadata.water_consumed_liters}L`}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                            <div className="text-lg font-bold text-green-600">
                              {nft.metadata.attributes?.find(a => a.trait_type === 'Efficiency Score')?.value || `${(nft.metadata.efficiency_score * 100).toFixed(0)}%`}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4 shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Issue Date</div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(nft.metadata.timestamp || nft.metadata.attributes?.find(a => a.trait_type === 'Issue Date')?.value).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>

                        {nft.explorer_url && (
                          <a
                            href={nft.explorer_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-sm bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all font-medium shadow-md"
                          >
                            View on Solana Explorer →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Usage History</h2>
                <p className="text-gray-600 mt-1">
                  {usageHistory.length > 0 ? `Showing ${usageHistory.length} recent records` : 'No records yet'}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Data updates every 30 seconds
              </div>
            </div>

            {usageHistory.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="text-7xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No usage history available</h3>
                <p className="text-gray-600">
                  Water usage records will appear here once the Oracle simulator starts sending data
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Water (L)
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tokens Burned
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Temp (°C)
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Humidity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Rain (mm)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {usageHistory.map((record, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {new Date(record.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-semibold">{record.water_liters.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-blue-600 font-semibold">
                            {record.tokens_consumed.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.temperature_c?.toFixed(1) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.humidity_percent?.toFixed(1) || 'N/A'}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.rainfall_mm?.toFixed(1) || '0.0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImprovedFarmerDashboard;
