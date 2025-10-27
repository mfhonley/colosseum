import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'];

function ProviderDashboard({ dashboardData, onRefresh, onBack }) {
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const { farms, total_water_used, total_limit, overall_status, water_usage_history } = dashboardData;

  // Prepare chart data
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
                <h1 className="text-2xl font-bold text-gray-900">Water Provider Dashboard</h1>
                <p className="text-sm text-gray-500">Managing 10 farms</p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Water Used</div>
            <div className="text-2xl font-bold text-gray-900">
              {total_water_used.toLocaleString()}L
            </div>
            <div className="text-xs text-gray-500 mt-1">
              of {total_limit.toLocaleString()}L total
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Overall Usage</div>
            <div className="text-2xl font-bold text-gray-900">
              {((total_water_used / total_limit) * 100).toFixed(1)}%
            </div>
            <div className={`text-xs mt-1 ${overall_status === 'economy' ? 'text-green-600' : 'text-red-600'}`}>
              {overall_status === 'economy' ? '✓ Within limits' : '⚠ Over budget'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Active Farms</div>
            <div className="text-2xl font-bold text-green-600">{farms.length}</div>
            <div className="text-xs text-gray-500 mt-1">monitoring</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="text-green-600">
                ✓ {statusCounts.economy}
              </div>
              <div className="text-red-600">
                ⚠ {statusCounts.overspend}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Water Usage by Farm</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={farmChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" fill="#3B82F6" name="Used (L)" />
                <Bar dataKey="limit" fill="#E5E7EB" name="Limit (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Water Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farms Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">All Farms Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farm ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {farms.map(farm => (
                  <tr key={farm.farm_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          Farm #{farm.farm_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {farm.total_water_used.toLocaleString()}L
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {farm.water_limit.toLocaleString()}L
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {farm.percentage_used.toFixed(1)}%
                        </div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              farm.percentage_used > 100 ? 'bg-red-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(farm.percentage_used, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 font-medium">
                        {farm.tokens_consumed.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        farm.status === 'economy'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {farm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Water Usage Activity</h2>
          {water_usage_history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activity data available
            </div>
          ) : (
            <div className="space-y-3">
              {water_usage_history.slice(0, 10).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600 font-semibold">
                      Farm #{record.farm_id}
                    </div>
                    <div className="text-gray-600 text-sm">
                      used {record.water_liters.toFixed(2)}L
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div>🌡️ {record.temperature_c?.toFixed(1)}°C</div>
                    <div>💧 {record.humidity_percent?.toFixed(0)}%</div>
                    <div className="text-xs">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
