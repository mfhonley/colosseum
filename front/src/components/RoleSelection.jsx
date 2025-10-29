import { useState } from 'react';
import { Icon } from './Icons';

function RoleSelection({ onSelectRole }) {
  const [selectedFarmId, setSelectedFarmId] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Icon.Water className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SuCount Water Management
          </h1>
          <p className="text-gray-600">
            Blockchain-based water resource management on Solana
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Farmer Role */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all hover:shadow-lg group">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Icon.Farm className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Farmer</h2>
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center justify-center"
            >
              <Icon.Farm className="w-5 h-5 mr-2" />
              Enter as Farmer
            </button>
          </div>

          {/* Provider Role */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-cyan-500 transition-all hover:shadow-lg group">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-full mb-4 group-hover:bg-cyan-100 transition-colors">
                <Icon.Water className="w-8 h-8 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Provider</h2>
              <p className="text-gray-600 text-sm mb-4">
                Manage all farms, allocate quotas, and monitor overall water distribution
              </p>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Icon.Check className="w-4 h-4 text-cyan-600 mr-2" />
                <span>View all 10 farms overview</span>
              </div>
              <div className="flex items-center">
                <Icon.Check className="w-4 h-4 text-cyan-600 mr-2" />
                <span>Monitor total water consumption</span>
              </div>
              <div className="flex items-center">
                <Icon.Check className="w-4 h-4 text-cyan-600 mr-2" />
                <span>Manage water quotas</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRole('provider')}
              className="w-full bg-cyan-600 text-white py-3 px-6 rounded-lg hover:bg-cyan-700 transition-colors font-medium inline-flex items-center justify-center"
            >
              <Icon.Water className="w-5 h-5 mr-2" />
              Enter as Provider
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Icon.Blockchain className="w-4 h-4" />
            <span>Powered by Solana Blockchain</span>
            <span className="text-gray-300">|</span>
            <Icon.Trophy className="w-4 h-4" />
            <span>Colosseum Hackathon</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
