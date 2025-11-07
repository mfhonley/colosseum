import { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { Award, AlertCircle, TrendingDown, XCircle, Droplets, Sprout, TrendingUp, Zap } from 'lucide-react';
import { renderCanvas } from '@/components/ui/canvas';

const Landing = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleGetStarted = () => {
    setIsVisible(false);
    setTimeout(() => onGetStarted(), 300);
  };

  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className={`transition-opacity duration-300 relative overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated liquid background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-cyan-50 to-blue-50">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 border border-cyan-400/40 bg-cyan-500/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-cyan-900 font-medium shadow-lg">
                <Award className="w-4 h-4" />
                Colosseum Hackathon Project
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900">
                  SuCount
                </h1>
                <p className="text-2xl md:text-3xl text-cyan-600 font-semibold">
                  Blockchain-Powered Water Management
                </p>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed max-w-xl">
                Tokenize water quotas, track usage in real-time, and earn NFT certificates for sustainable farming on Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Get Started
                </button>
                <a
                  href="https://explorer.solana.com/address/Dq53uysBgXgQYiMoBSBJJXDFYjq7DqBRTXumQhBr3n1u?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-cyan-400/40 bg-cyan-500/20 backdrop-blur-md text-slate-900 px-8 py-4 rounded-xl font-semibold text-base hover:bg-cyan-500/30 transition-all shadow-lg"
                >
                  View Token
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span>Live on Solana Devnet</span>
              </div>
            </div>

            {/* Water & Agriculture Visual */}
            <div className="hidden md:flex items-center justify-center relative">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* Floating icons grid */}
                <div className="relative grid grid-cols-3 gap-8">
                  {/* Row 1 */}
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '0s'}}>
                    <Droplets className="w-12 h-12 text-cyan-600" />
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '0.5s'}}>
                    <Sprout className="w-12 h-12 text-sky-600" />
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '1s'}}>
                    <Icon.Water className="w-10 h-10 text-cyan-600" />
                  </div>

                  {/* Row 2 - Center feature */}
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '1.5s'}}>
                    <Icon.Blockchain className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
                    <Icon.Chart className="w-16 h-16 text-white" />
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '2s'}}>
                    <TrendingUp className="w-12 h-12 text-cyan-600" />
                  </div>

                  {/* Row 3 */}
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '2.5s'}}>
                    <Icon.Trophy className="w-10 h-10 text-sky-600" />
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '3s'}}>
                    <Zap className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-cyan-400/30 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-cyan-400/40 transition-all animate-float" style={{animationDelay: '3.5s'}}>
                    <Droplets className="w-12 h-12 text-cyan-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">The Water Crisis</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Agriculture consumes <span className="font-semibold text-cyan-700">70% of global freshwater</span>, yet lacks transparent monitoring and efficient quota management systems.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-8 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-100/80 backdrop-blur-sm flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">No Transparency</h3>
              <p className="text-slate-700 leading-relaxed">Manual tracking, paper records, no real-time visibility into water usage.</p>
            </div>
            <div className="bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-8 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-100/80 backdrop-blur-sm flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Inefficient Allocation</h3>
              <p className="text-slate-700 leading-relaxed">Static quotas that don't adapt to actual consumption patterns.</p>
            </div>
            <div className="bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-8 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100/80 backdrop-blur-sm flex items-center justify-center mb-4">
                <XCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">No Incentives</h3>
              <p className="text-slate-700 leading-relaxed">Farmers have no rewards for water conservation and efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Our Solution</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Blockchain-based water management that brings <span className="font-semibold text-cyan-700">transparency, efficiency, and incentives</span> to agricultural water usage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* WaterCredits */}
            <div className="bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-8 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all group">
              <div className="w-14 h-14 bg-cyan-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Icon.Water className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">WaterCredits Token</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                SPL token on Solana where <span className="font-semibold text-cyan-700">1 WC = 1 liter</span> of water quota.
                Tokens are automatically burned when water is consumed.
              </p>
              <div className="bg-cyan-500/20 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/60">
                <p className="text-xs font-mono text-slate-700">Decimals: 6 | Deflationary</p>
              </div>
            </div>

            {/* NFT Certificates */}
            <div className="bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-8 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all group">
              <div className="w-14 h-14 bg-sky-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-sky-600 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Icon.Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">NFT Certificates</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Unique NFT awards for farmers who achieve <span className="font-semibold text-sky-700">high efficiency scores</span> (&gt;85% quota utilization).
              </p>
              <div className="bg-cyan-500/20 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/60">
                <p className="text-xs font-mono text-slate-700">Supply: 1 (Unique) | On-chain</p>
              </div>
            </div>

            {/* IoT Oracle */}
            <div className="bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-8 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all group">
              <div className="w-14 h-14 bg-cyan-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Icon.Blockchain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">IoT Oracle</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Real-time monitoring from IoT sensors, automatically recording usage on-chain <span className="font-semibold text-blue-700">every 30 seconds</span>.
              </p>
              <div className="bg-cyan-500/20 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/60">
                <p className="text-xs font-mono text-slate-700">Interval: 30s | 10 farms</p>
              </div>
            </div>

            {/* Dashboard */}
            <div className="bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-8 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all group">
              <div className="w-14 h-14 bg-blue-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Icon.Chart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Real-time Dashboard</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Professional interface for farmers and providers to <span className="font-semibold text-blue-700">monitor usage, mint quotas</span>, and view blockchain status.
              </p>
              <div className="bg-cyan-500/20 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/60">
                <p className="text-xs font-mono text-slate-700">React + FastAPI | Live</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900 tracking-tight">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  num: '1',
                  title: 'Monthly Quota Allocation',
                  desc: 'Water provider mints WaterCredits tokens (e.g., 100,000 WC = 100,000 liters) to farmer\'s Solana wallet.',
                  numColor: 'bg-gradient-to-br from-cyan-500 to-blue-500'
                },
                {
                  num: '2',
                  title: 'Real-time Monitoring',
                  desc: 'IoT sensors track water consumption. Oracle service sends usage data to blockchain every 30 seconds.',
                  numColor: 'bg-gradient-to-br from-blue-500 to-sky-500'
                },
                {
                  num: '3',
                  title: 'Automatic Burning',
                  desc: 'When farmer uses 100 liters, system burns 100 WC tokens. Transparent and verifiable on Solana Explorer.',
                  numColor: 'bg-gradient-to-br from-sky-500 to-cyan-500'
                },
                {
                  num: '4',
                  title: 'Rewards & Incentives',
                  desc: 'Farmers with >85% efficiency receive unique NFT certificates as proof of sustainable water management.',
                  numColor: 'bg-gradient-to-br from-cyan-500 to-blue-500'
                }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 p-6 rounded-2xl hover:shadow-2xl hover:bg-cyan-400/30 transition-all">
                  <div className={`w-12 h-12 ${step.numColor} text-white rounded-xl flex items-center justify-center text-xl font-semibold flex-shrink-0 shadow-lg`}>
                    {step.num}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-semibold mb-2 text-slate-900">{step.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: '100%', label: 'Transparent', color: 'text-cyan-600' },
              { value: '30s', label: 'Update Interval', color: 'text-blue-600' },
              { value: '10', label: 'Active Farms', color: 'text-sky-600' },
              { value: 'Real', label: 'Blockchain', color: 'text-cyan-600' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl hover:shadow-2xl hover:bg-white/50 transition-all">
                <div className={`text-5xl md:text-6xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <p className="text-slate-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-md border border-white/60 p-12 rounded-3xl shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Ready to Transform Water Management?</h2>
            <p className="text-lg text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the future of sustainable agriculture with blockchain transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center bg-cyan-600 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Launch Dashboard
              </button>
              <a
                href="https://api.sucount.site/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-white/40 bg-white/30 backdrop-blur-md text-slate-900 px-10 py-5 rounded-xl text-lg font-semibold hover:bg-white/50 transition-all shadow-lg"
              >
                API Docs
              </a>
            </div>
            <div className="mt-12 text-sm text-slate-700">
              <p>Built for Colosseum Hackathon | Live on Solana Devnet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-white/20 backdrop-blur-md border-t border-white/40">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 text-slate-900">SuCount</h3>
                <p className="text-slate-700">Blockchain-Powered Water Management</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <a href="https://api.sucount.site/docs" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-cyan-600 transition-colors font-medium">
                  API Docs
                </a>
                <a href="https://explorer.solana.com/address/Dq53uysBgXgQYiMoBSBJJXDFYjq7DqBRTXumQhBr3n1u?cluster=devnet" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-cyan-600 transition-colors font-medium">
                  Token Explorer
                </a>
                <a href="https://www.catops.app/status/690db7604873707fbc482e3f" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-cyan-600 transition-colors font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Status
                </a>
              </div>
            </div>
            <div className="border-t border-white/40 mt-8 pt-8 text-center">
              <p className="text-slate-600 text-sm">
                © 2025 SuCount. Built on Solana. All transactions verifiable on-chain.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Blue Water Cursor Effect Canvas */}
      <canvas
        className="pointer-events-none fixed inset-0 z-50"
        id="canvas"
      ></canvas>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;
