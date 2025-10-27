import { useState, useEffect } from 'react';
import { api } from './services/api';
import RoleSelection from './components/RoleSelection';
import ModernFarmerDashboard from './components/FarmerDashboard.modern';
import ModernProviderDashboard from './components/ProviderDashboard.modern';
import { Icon } from './components/Icons';
import { LoadingSpinner } from './components/UI';

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
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg max-w-md">
          <div className="flex items-center text-red-600 text-xl font-bold mb-4">
            <Icon.Alert className="w-6 h-6 mr-2" />
            Connection Error
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleBackToSelection}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
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
        <ModernFarmerDashboard
          farmId={selectedFarmId}
          dashboardData={dashboardData}
          onRefresh={loadDashboard}
          onBack={handleBackToSelection}
        />
      ) : (
        <ModernProviderDashboard
          dashboardData={dashboardData}
          onRefresh={loadDashboard}
          onBack={handleBackToSelection}
        />
      )}
    </div>
  );
}

export default App;
