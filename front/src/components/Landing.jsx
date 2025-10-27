import { useState } from 'react';
import { Icon } from './Icons';

const Landing = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleGetStarted = () => {
    setIsVisible(false);
    setTimeout(() => onGetStarted(), 300);
  };

  return (
    <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white flex items-center">
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6 animate-pulse">
                🏆 Colosseum Hackathon Project
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                SuCount
              </h1>
              <p className="text-2xl md:text-4xl mb-6 text-blue-100 font-semibold">
                Blockchain-Powered Water Management
              </p>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Tokenize water quotas, track usage in real-time, and earn NFT certificates for sustainable farming on Solana blockchain.
              </p>
              <button
                onClick={handleGetStarted}
                className="bg-white text-purple-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform"
              >
                Get Started →
              </button>
              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  Live on Solana Devnet
                </div>
                <a
                  href="https://explorer.solana.com/address/Dq53uysBgXgQYiMoBSBJJXDFYjq7DqBRTXumQhBr3n1u?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-200 transition-colors"
                >
                  View Token →
                </a>
              </div>
            </div>

            {/* Animated Water Drop */}
            <div className="hidden md:block">
              <div className="animate-float">
                <svg viewBox="0 0 200 200" className="w-full max-w-md mx-auto drop-shadow-2xl">
                  <defs>
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="95" fill="white" opacity="0.1" />
                  <path
                    d="M100 40 C100 40, 70 80, 70 110 C70 130, 82 145, 100 145 C118 145, 130 130, 130 110 C130 80, 100 40, 100 40 Z"
                    fill="url(#waterGradient)"
                    opacity="0.9"
                  />
                  <circle cx="100" cy="100" r="5" fill="white" opacity="0.8" />
                  <circle cx="85" cy="110" r="3" fill="white" opacity="0.6" />
                  <circle cx="115" cy="105" r="4" fill="white" opacity="0.7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">The Water Crisis</h2>
            <p className="text-xl text-gray-600">
              Agriculture consumes <strong>70% of global freshwater</strong>, yet lacks transparent monitoring and efficient quota management systems.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-red-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🚨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No Transparency</h3>
              <p className="text-gray-700">Manual tracking, paper records, no real-time visibility into water usage.</p>
            </div>
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📉</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Inefficient Allocation</h3>
              <p className="text-gray-700">Static quotas that don't adapt to actual consumption patterns.</p>
            </div>
            <div className="bg-yellow-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">❌</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No Incentives</h3>
              <p className="text-gray-700">Farmers have no rewards for water conservation and efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Solution</h2>
            <p className="text-xl text-gray-600">
              Blockchain-based water management that brings <strong>transparency, efficiency, and incentives</strong> to agricultural water usage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* WaterCredits */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-3xl mb-6">
                <Icon.Water className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">WaterCredits Token</h3>
              <p className="text-gray-700 mb-4">
                SPL token on Solana where <strong className="text-blue-600">1 WC = 1 liter</strong> of water quota.
                Tokens are automatically burned when water is consumed.
              </p>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-mono text-gray-600">Decimals: 6 | Deflationary</p>
              </div>
            </div>

            {/* NFT Certificates */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-3xl mb-6">
                <Icon.Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">NFT Certificates</h3>
              <p className="text-gray-700 mb-4">
                Unique NFT awards for farmers who achieve <strong className="text-purple-600">high efficiency scores</strong> (&gt;85% quota utilization).
              </p>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <p className="text-sm font-mono text-gray-600">Supply: 1 (Unique) | On-chain</p>
              </div>
            </div>

            {/* IoT Oracle */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-3xl mb-6">
                <Icon.Blockchain className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">IoT Oracle</h3>
              <p className="text-gray-700 mb-4">
                Real-time monitoring from IoT sensors, automatically recording usage on-chain <strong className="text-green-600">every 30 seconds</strong>.
              </p>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm font-mono text-gray-600">Interval: 30s | 10 farms</p>
              </div>
            </div>

            {/* Dashboard */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-3xl mb-6">
                <Icon.Chart className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-time Dashboard</h3>
              <p className="text-gray-700 mb-4">
                Professional interface for farmers and providers to <strong className="text-indigo-600">monitor usage, mint quotas</strong>, and view blockchain status.
              </p>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <p className="text-sm font-mono text-gray-600">React + FastAPI | Live</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  num: '1',
                  title: 'Monthly Quota Allocation',
                  desc: 'Water provider mints WaterCredits tokens (e.g., 100,000 WC = 100,000 liters) to farmer\'s Solana wallet.',
                  color: 'bg-blue-500'
                },
                {
                  num: '2',
                  title: 'Real-time Monitoring',
                  desc: 'IoT sensors track water consumption. Oracle service sends usage data to blockchain every 30 seconds.',
                  color: 'bg-green-500'
                },
                {
                  num: '3',
                  title: 'Automatic Burning',
                  desc: 'When farmer uses 100 liters, system burns 100 WC tokens. Transparent and verifiable on Solana Explorer.',
                  color: 'bg-orange-500'
                },
                {
                  num: '4',
                  title: 'Rewards & Incentives',
                  desc: 'Farmers with >85% efficiency receive unique NFT certificates as proof of sustainable water management.',
                  color: 'bg-purple-500'
                }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 ${step.color} text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-lg`}>
                    {step.num}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-700">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '100%', label: 'Transparent', color: 'text-blue-600' },
              { value: '30s', label: 'Update Interval', color: 'text-green-600' },
              { value: '10', label: 'Active Farms', color: 'text-purple-600' },
              { value: 'Real', label: 'Blockchain', color: 'text-indigo-600' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Water Management?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join the future of sustainable agriculture with blockchain transparency.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 px-12 py-6 rounded-xl text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform"
          >
            Launch Dashboard →
          </button>
          <div className="mt-12 text-sm opacity-75">
            <p>Built for Colosseum Hackathon | Live on Solana Devnet</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">SuCount</h3>
          <p className="text-gray-400 mb-6">Blockchain-Powered Water Management</p>
          <div className="flex flex-wrap justify-center gap-8 mb-6 text-sm">
            <a href="https://api.sucount.site/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              API Docs
            </a>
            <a href="https://explorer.solana.com/address/Dq53uysBgXgQYiMoBSBJJXDFYjq7DqBRTXumQhBr3n1u?cluster=devnet" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              Token Explorer
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 SuCount. Built on Solana. All transactions verifiable on-chain.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
