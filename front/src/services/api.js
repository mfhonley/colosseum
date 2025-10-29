import axios from 'axios';

// STRICT: Only use .env variable, no fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_URL is not defined in .env file! ' +
    'Please set VITE_API_URL in front/.env before building.'
  );
}

console.log('[API] Using API URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Dashboard data (all farms)
  getDashboard: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },

  // Single farm statistics
  getFarmStatistics: async (farmId) => {
    const response = await apiClient.get(`/farms/${farmId}/statistics`);
    return response.data;
  },

  // Farm token balance
  getFarmBalance: async (farmId) => {
    const response = await apiClient.get(`/farms/${farmId}/balance`);
    return response.data;
  },

  // Mint NFT certificate
  mintNFT: async (farmId, waterConsumed, efficiencyScore = 0.95) => {
    const response = await apiClient.post('/nft/mint', null, {
      params: { farm_id: farmId, water_consumed: waterConsumed, efficiency_score: efficiencyScore }
    });
    return response.data;
  },

  // Get farm NFTs
  getFarmNFTs: async (farmId) => {
    const response = await apiClient.get(`/farms/${farmId}/nfts`);
    return response.data;
  },

  // WaterCredits Token Management
  createWaterCreditsToken: async () => {
    const response = await apiClient.post('/watercredits/create-token');
    return response.data;
  },

  mintQuotaToFarmer: async (farmId, amount = 100000) => {
    const response = await apiClient.post('/watercredits/mint-quota', null, {
      params: { farm_id: farmId, amount }
    });
    return response.data;
  },

  burnWaterCredits: async (farmId, waterLiters) => {
    const response = await apiClient.post('/watercredits/burn', null, {
      params: { farm_id: farmId, water_liters: waterLiters }
    });
    return response.data;
  },

  getWaterCreditsBalance: async (farmId) => {
    const response = await apiClient.get(`/watercredits/balance/${farmId}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};
