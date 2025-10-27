import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Icon } from './Icons';
import { Button, Card, StatCard, Badge, Tabs, EmptyState, LoadingSpinner, Alert, Progress } from './UI';

function ModernFarmerDashboard({ farmId, dashboardData, onRefresh, onBack }) {
  const [farmStats, setFarmStats] = useState(null);
  const [balance, setBalance] = useState(null);
  const [blockchainBalance, setBlockchainBalance] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [farmId, dashboardData]);

  const loadAllData = async () => {
    await Promise.all([
      loadFarmData(),
      loadNFTs(),
      loadBlockchainBalance()
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
      const result = await api.mintQuotaToFarmer(farmId, 100000);
      if (result.success) {
        alert(`Successfully minted 100,000 WC!\n\nTransaction: ${result.transaction_signature}`);
        await loadBlockchainBalance();
      }
    } catch (err) {
      console.error('Failed to mint quota:', err);
      alert(`Failed to mint quota: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!farmStats) return;
    try {
      setLoading(true);
      const nft = await api.mintNFT(farmId, farmStats.total_water_used, 0.95);
      await loadNFTs();
      alert(`NFT Certificate minted!\n\nMint Address: ${nft.nft_address}`);
    } catch (err) {
      console.error('Failed to mint NFT:', err);
      alert(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!farmStats || !balance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  const usageHistory = dashboardData?.water_usage_history
    ?.filter(record => record.farm_id === farmId)
    ?.slice(0, 20)
    ?.reverse() || [];

  const chartData = usageHistory.map(record => ({
    time: new Date(record.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    water: record.water_liters,
    temp: record.temperature_c,
  }));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icon.Chart },
    { id: 'credits', label: 'WaterCredits', icon: Icon.Credit },
    { id: 'nfts', label: 'Certificates', icon: Icon.Trophy },
    { id: 'history', label: 'History', icon: Icon.History },
  ];

  const isWithinLimit = farmStats.status === 'economy';
  const usagePercentage = farmStats.percentage_used;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                icon={Icon.ArrowLeft}
                onClick={onBack}
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Farm #{farmId}</h1>
                <p className="text-sm text-gray-500 mt-1">Real-time monitoring on Solana blockchain</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="md"
              icon={Icon.Refresh}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                label="Water Used"
                value={`${farmStats.total_water_used.toLocaleString()}L`}
                subValue={`of ${farmStats.water_limit.toLocaleString()}L`}
                icon={Icon.Water}
                color="blue"
              />
              <StatCard
                label="Usage"
                value={`${usagePercentage.toFixed(1)}%`}
                subValue={isWithinLimit ? 'Within limit' : 'Over limit'}
                icon={Icon.Chart}
                color={isWithinLimit ? 'green' : 'red'}
              />
              <StatCard
                label="Tokens Available"
                value={balance.balance.toLocaleString()}
                subValue="WaterCredits"
                icon={Icon.Credit}
                color="purple"
              />
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                  </div>
                  <Badge
                    variant={isWithinLimit ? 'success' : 'danger'}
                    size="lg"
                  >
                    {farmStats.status.toUpperCase()}
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Blockchain Info Banner */}
            {blockchainBalance && (
              <Alert variant="info" title="Blockchain Status">
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-xs font-medium">On-Chain Balance:</span>
                    <span className="ml-2 font-bold">{blockchainBalance.balance.toLocaleString()} WC</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium">Token Account:</span>
                    <span className="ml-2 font-mono text-xs">{blockchainBalance.token_account?.substring(0, 15)}...</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a
                    href={`https://explorer.solana.com/address/${blockchainBalance.mint_address}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View on Solana Explorer
                    <Icon.External className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </Alert>
            )}

            {/* Usage Progress */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Usage Progress</h3>
                <Progress
                  value={farmStats.total_water_used}
                  max={farmStats.water_limit}
                  color={isWithinLimit ? 'green' : 'red'}
                  showLabel={true}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0L</span>
                  <span>{farmStats.water_limit.toLocaleString()}L</span>
                </div>
              </div>
            </Card>

            {/* Chart */}
            <Card>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Icon.Water className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Water Usage Timeline</h2>
                </div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="water"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Water (L)"
                        dot={{ fill: '#3b82f6', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState
                    icon={Icon.Chart}
                    title="No usage data available"
                    description="Oracle will send data every 30 seconds"
                  />
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-6">
            {blockchainBalance && blockchainBalance.success ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    label="On-Chain Balance"
                    value={blockchainBalance.balance.toLocaleString()}
                    subValue="WaterCredits (Real)"
                    icon={Icon.Blockchain}
                    color="blue"
                  />
                  <StatCard
                    label="Total Burned"
                    value={balance.total_consumed.toLocaleString()}
                    subValue="tokens burned"
                    icon={Icon.Fire}
                    color="red"
                  />
                  <StatCard
                    label="Total Minted"
                    value={balance.total_minted.toLocaleString()}
                    subValue="tokens allocated"
                    icon={Icon.Plus}
                    color="green"
                  />
                </div>

                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Icon.Blockchain className="w-5 h-5 mr-2 text-blue-600" />
                      Blockchain Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Token Mint:</span>
                        <a
                          href={`https://explorer.solana.com/address/${blockchainBalance.mint_address}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {blockchainBalance.mint_address?.substring(0, 30)}...
                          <Icon.External className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Token Account:</span>
                        <a
                          href={`https://explorer.solana.com/address/${blockchainBalance.token_account}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {blockchainBalance.token_account?.substring(0, 30)}...
                          <Icon.External className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-600">Network:</span>
                        <Badge variant="info">Solana Devnet</Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Button
                  variant="primary"
                  size="lg"
                  loading={loading}
                  onClick={handleMintQuota}
                  className="w-full"
                  icon={Icon.Plus}
                >
                  Mint 100,000 WC Quota
                </Button>

                <Alert variant="warning" title="How WaterCredits Work">
                  <ul className="text-sm space-y-2 mt-2">
                    <li>• 1 WaterCredit = 1 Liter of water usage right</li>
                    <li>• Tokens are minted monthly as your water quota</li>
                    <li>• When you use water, tokens are automatically burned</li>
                    <li>• Stay within your quota to maintain ECONOMY status</li>
                    <li>• All transactions are recorded on Solana blockchain</li>
                  </ul>
                </Alert>
              </>
            ) : (
              <Card>
                <div className="p-12">
                  <EmptyState
                    icon={Icon.Alert}
                    title="WaterCredits Not Initialized"
                    description="Initialize your WaterCredits token to start managing your water quota on the Solana blockchain"
                    action={
                      <Button
                        variant="primary"
                        size="lg"
                        loading={loading}
                        onClick={handleMintQuota}
                        icon={Icon.Blockchain}
                      >
                        Initialize WaterCredits
                      </Button>
                    }
                  />
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">NFT Certificates</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Earn on-chain certificates for water efficiency achievements
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    loading={loading}
                    onClick={handleMintNFT}
                    icon={Icon.Trophy}
                  >
                    Mint Certificate
                  </Button>
                </div>

                {nfts.length === 0 ? (
                  <EmptyState
                    icon={Icon.Trophy}
                    title="No Certificates Yet"
                    description="Maintain high water efficiency to earn NFT certificates on Solana blockchain"
                    action={
                      <Button
                        variant="primary"
                        loading={loading}
                        onClick={handleMintNFT}
                        icon={Icon.Plus}
                      >
                        Mint Your First Certificate
                      </Button>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft, index) => (
                      <Card key={index} hover>
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
                          <Icon.Trophy className="w-12 h-12 text-white mx-auto mb-2" />
                          <div className="text-white font-bold text-lg">
                            Water Efficiency Certificate
                          </div>
                          <div className="text-blue-100 text-sm mt-1">
                            Farm #{farmId}
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="mb-4">
                            <div className="text-xs font-semibold text-gray-500 mb-1">NFT Mint Address</div>
                            <div className="text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200 break-all">
                              {nft.nft_address.substring(0, 20)}...
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Water Used</div>
                              <div className="text-lg font-bold text-gray-900">
                                {nft.metadata.attributes?.find(a => a.trait_type === 'Water Consumed')?.value || `${nft.metadata.water_consumed_liters}L`}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                              <div className="text-lg font-bold text-green-600">
                                {nft.metadata.attributes?.find(a => a.trait_type === 'Efficiency Score')?.value || `${(nft.metadata.efficiency_score * 100).toFixed(0)}%`}
                              </div>
                            </div>
                          </div>

                          {nft.explorer_url && (
                            <a
                              href={nft.explorer_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              View on Explorer
                              <Icon.External className="w-4 h-4 ml-1" />
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Usage History</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {usageHistory.length > 0 ? `Showing ${usageHistory.length} recent records` : 'No records yet'}
                  </p>
                </div>
                <Badge variant="info">Updates every 30s</Badge>
              </div>

              {usageHistory.length === 0 ? (
                <EmptyState
                  icon={Icon.History}
                  title="No Usage History"
                  description="Water usage records will appear here once the Oracle simulator starts sending data"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water (L)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens Burned</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Humidity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rain</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {usageHistory.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {new Date(record.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.water_liters.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                            {record.tokens_consumed.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.temperature_c?.toFixed(1) || 'N/A'}°C
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.humidity_percent?.toFixed(1) || 'N/A'}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.rainfall_mm?.toFixed(1) || '0.0'}mm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ModernFarmerDashboard;
