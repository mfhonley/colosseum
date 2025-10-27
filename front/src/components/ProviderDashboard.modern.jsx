import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Icon } from './Icons';
import { Button, Card, StatCard, Badge, EmptyState, Progress } from './UI';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];

function ModernProviderDashboard({ dashboardData, onRefresh, onBack }) {
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <Icon.Spinner className="w-8 h-8 text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const { farms, total_water_used, total_limit, overall_status, water_usage_history } = dashboardData;

  const farmChartData = farms.map(farm => ({
    name: `Farm ${farm.farm_id}`,
    used: farm.total_water_used,
    limit: farm.water_limit,
    percentage: farm.percentage_used,
  }));

  const pieChartData = farms.map(farm => ({
    name: `Farm ${farm.farm_id}`,
    value: farm.total_water_used,
  }));

  const statusCounts = {
    economy: farms.filter(f => f.status === 'economy').length,
    overspend: farms.filter(f => f.status === 'overspend').length,
  };

  const overallPercentage = (total_water_used / total_limit) * 100;
  const isHealthy = overall_status === 'economy';

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
                <h1 className="text-2xl font-bold text-gray-900">Water Provider Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Managing {farms.length} farms in real-time</p>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Total Water Used"
            value={`${total_water_used.toLocaleString()}L`}
            subValue={`of ${total_limit.toLocaleString()}L total`}
            icon={Icon.Water}
            color="blue"
          />
          <StatCard
            label="Overall Usage"
            value={`${overallPercentage.toFixed(1)}%`}
            subValue={isHealthy ? 'Within limits' : 'Over budget'}
            icon={Icon.Chart}
            color={isHealthy ? 'green' : 'red'}
          />
          <StatCard
            label="Active Farms"
            value={farms.length}
            subValue="monitoring"
            icon={Icon.Farm}
            color="purple"
          />
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Farm Status</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon.Check className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">{statusCounts.economy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon.Alert className="w-5 h-5 text-red-600" />
                  <span className="text-lg font-bold text-gray-900">{statusCounts.overspend}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Water Budget</h3>
            <Progress
              value={total_water_used}
              max={total_limit}
              color={isHealthy ? 'green' : 'red'}
              showLabel={true}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>0L</span>
              <span>{total_limit.toLocaleString()}L</span>
            </div>
          </div>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Icon.Chart className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Water Usage by Farm</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={farmChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="used" fill="#3b82f6" name="Used (L)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="limit" fill="#e5e7eb" name="Limit (L)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Icon.Water className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Water Distribution</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Farms Table */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Icon.Farm className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">All Farms Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {farms.map(farm => {
                    const farmHealthy = farm.status === 'economy';
                    return (
                      <tr key={farm.farm_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Icon.Farm className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Farm #{farm.farm_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {farm.total_water_used.toLocaleString()}L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {farm.water_limit.toLocaleString()}L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900">{farm.percentage_used.toFixed(1)}%</span>
                            <div className="w-16">
                              <Progress
                                value={farm.percentage_used}
                                max={100}
                                color={farmHealthy ? 'green' : 'red'}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {farm.tokens_consumed.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={farmHealthy ? 'success' : 'danger'}>
                            {farm.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Icon.History className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            {water_usage_history.length === 0 ? (
              <EmptyState
                icon={Icon.History}
                title="No Activity Data"
                description="Water usage activity will appear here once farms start consuming water"
              />
            ) : (
              <div className="space-y-2">
                {water_usage_history.slice(0, 10).map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Icon.Farm className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">Farm #{record.farm_id}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Icon.Water className="w-4 h-4 mr-1" />
                        <span>{record.water_liters.toFixed(2)}L</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Icon.Sun className="w-4 h-4 mr-1" />
                        <span>{record.temperature_c?.toFixed(1)}°C</span>
                      </div>
                      <div className="flex items-center">
                        <Icon.Cloud className="w-4 h-4 mr-1" />
                        <span>{record.humidity_percent?.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center">
                        <Icon.History className="w-4 h-4 mr-1" />
                        <span className="text-xs">{new Date(record.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ModernProviderDashboard;
