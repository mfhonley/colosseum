import { useState } from 'react';

function RoleSelection({ onSelectRole }) {
  const [selectedFarmId, setSelectedFarmId] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            SuCount Water Management
          </h1>
          <p className="text-gray-600">
            Blockchain-based water resource management on Solana
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Farmer Role */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all cursor-pointer hover:shadow-lg">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">🌾</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Farmer</h2>
              <p className="text-gray-600 text-sm mb-4">
                Monitor your farm's water usage, token balance, and NFT certificates
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Farm ID (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => onSelectRole('farmer', selectedFarmId)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Enter as Farmer
            </button>
          </div>

          {/* Provider Role */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 transition-all cursor-pointer hover:shadow-lg">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">💧</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Water Provider</h2>
              <p className="text-gray-600 text-sm mb-4">
                Manage all farms, allocate quotas, and monitor overall water distribution
              </p>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>View all 10 farms overview</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Monitor total water consumption</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Manage water quotas</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRole('provider')}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Enter as Provider
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Solana Blockchain | Colosseum Hackathon</p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
