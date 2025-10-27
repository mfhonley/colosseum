import { useState, useEffect } from 'react';
import { api } from './services/api';
import RoleSelection from './components/RoleSelection';
import ImprovedFarmerDashboard from './components/ImprovedFarmerDashboard';
import ProviderDashboard from './components/ProviderDashboard';

function App() {
  const [role, setRole] = useState(null); // 'farmer' or 'provider'
  const [selectedFarmId, setSelectedFarmId] = useState(1);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to connect to backend. Make sure API is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds when role is selected
  useEffect(() => {
    if (role) {
      loadDashboard();
      const interval = setInterval(loadDashboard, 30000);
      return () => clearInterval(interval);
    }
  }, [role]);

  const handleRoleSelect = (selectedRole, farmId = 1) => {
    setRole(selectedRole);
    setSelectedFarmId(farmId);
  };

  const handleBackToSelection = () => {
    setRole(null);
    setDashboardData(null);
  };

  if (!role) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-xl mb-4">⚠️ Connection Error</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={handleBackToSelection}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Back to Role Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {role === 'farmer' ? (
        <ImprovedFarmerDashboard
          farmId={selectedFarmId}
          dashboardData={dashboardData}
          onRefresh={loadDashboard}
          onBack={handleBackToSelection}
        />
      ) : (
        <ProviderDashboard
          dashboardData={dashboardData}
          onRefresh={loadDashboard}
          onBack={handleBackToSelection}
        />
      )}
    </div>
  );
}

export default App;
