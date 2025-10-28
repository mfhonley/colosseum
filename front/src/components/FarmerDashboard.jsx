import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function FarmerDashboard({ farmId, dashboardData, onRefresh, onBack }) {
  const [farmStats, setFarmStats] = useState(null);
  const [balance, setBalance] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, credits, nfts, history

  useEffect(() => {
    loadFarmData();
    loadNFTs();
  }, [farmId, dashboardData]);

  const loadFarmData = async () => {
    try {
      // Get farm statistics
      const stats = await api.getFarmStatistics(farmId);
      setFarmStats(stats);

      // Get token balance
      const bal = await api.getFarmBalance(farmId);
      setBalance(bal);
    } catch (err) {
      console.error('Failed to load farm data:', err);
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

  const handleMintNFT = async () => {
    if (!farmStats) return;

    try {
      alert('Minting NFT on Solana Devnet... This may take a few seconds.');
      const nft = await api.mintNFT(farmId, farmStats.total_water_used, 0.95);

      // Reload NFTs from database
      await loadNFTs();

      alert(`✅ NFT Certificate minted successfully!\n\nMint Address: ${nft.nft_address}\n\nCheck Solana Explorer for details.`);
    } catch (err) {
      console.error('Failed to mint NFT:', err);
      alert(`❌ Failed to mint NFT: ${err.message || 'Unknown error'}`);
    }
  };

  if (!farmStats || !balance) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  const statusColor = farmStats.status === 'economy' ? 'text-cyan-600' : 'text-red-600';
  const statusBg = farmStats.status === 'economy' ? 'bg-cyan-100' : 'bg-red-100';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Farm #{farmId} Dashboard</h1>
                <p className="text-sm text-gray-500">Farmer View</p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'credits', 'nfts', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Water Used</div>
                <div className="text-2xl font-bold text-gray-900">
                  {farmStats.total_water_used.toLocaleString()}L
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  of {farmStats.water_limit.toLocaleString()}L
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Usage</div>
                <div className="text-2xl font-bold text-gray-900">
                  {farmStats.percentage_used.toFixed(1)}%
                </div>
                <div className={`text-xs mt-1 ${statusColor}`}>
                  {farmStats.status === 'economy' ? '✓ Within limit' : '⚠ Over limit'}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Tokens Left</div>
                <div className="text-2xl font-bold text-blue-600">
                  {balance.balance.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">WaterCredits</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusBg} ${statusColor}`}>
                  {farmStats.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Water Usage History</h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="water" stroke="#3B82F6" name="Water (L)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  No usage data available yet
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💎</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">WaterCredits Wallet</h2>
                <p className="text-gray-600">Your water quota tokens on Solana blockchain</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Current Balance</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {balance.balance.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">tokens</div>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Total Consumed</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {balance.total_consumed.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">tokens burned</div>
                </div>

                <div className="text-center p-6 bg-cyan-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Total Minted</div>
                  <div className="text-3xl font-bold text-cyan-600">
                    {balance.total_minted.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">tokens allocated</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">How WaterCredits Work:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 1 WaterCredit = 1 Liter of water usage</li>
                  <li>• Tokens are minted monthly as your water quota</li>
                  <li>• When you use water, tokens are automatically burned</li>
                  <li>• Stay within your quota to maintain economy status</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">NFT Certificates</h2>
                <button
                  onClick={handleMintNFT}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  🎨 Mint New NFT
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Earn NFT certificates for water efficiency achievements
              </p>

              {nfts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-gray-600">No NFT certificates yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Maintain high water efficiency to earn NFT certificates
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft, index) => (
                    <div key={index} className="border-2 border-purple-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all bg-gradient-to-br from-purple-50 to-blue-50">
                      {/* NFT Image Preview */}
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
                        <div className="text-6xl mb-2">🏆</div>
                        <div className="text-white font-bold text-lg">
                          Water Efficiency Certificate
                        </div>
                        <div className="text-purple-100 text-sm mt-1">
                          Farm #{farmId}
                        </div>
                      </div>

                      {/* NFT Details */}
                      <div className="p-4">
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">NFT Address</div>
                          <div className="text-xs font-mono bg-white p-2 rounded border border-gray-200 break-all">
                            {nft.nft_address.substring(0, 20)}...
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-xs text-gray-500">Water Used</div>
                            <div className="text-sm font-bold text-gray-900">
                              {nft.metadata.attributes?.find(a => a.trait_type === 'Water Consumed')?.value || `${nft.metadata.water_consumed_liters}L`}
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-xs text-gray-500">Efficiency</div>
                            <div className="text-sm font-bold text-cyan-600">
                              {nft.metadata.attributes?.find(a => a.trait_type === 'Efficiency Score')?.value || `${(nft.metadata.efficiency_score * 100).toFixed(0)}%`}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-2 rounded border border-gray-200 mb-3">
                          <div className="text-xs text-gray-500">Issue Date</div>
                          <div className="text-sm text-gray-900">
                            {new Date(nft.metadata.timestamp || nft.metadata.attributes?.find(a => a.trait_type === 'Issue Date')?.value).toLocaleDateString()}
                          </div>
                        </div>

                        {nft.explorer_url && (
                          <a
                            href={nft.explorer_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-sm text-purple-600 hover:text-purple-800 font-medium"
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage History</h2>

            {usageHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No usage history available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water (L)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temp (°C)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Humidity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rain (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usageHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.water_liters.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          {record.tokens_consumed.toFixed(2)}
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

export default FarmerDashboard;
