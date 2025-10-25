// import { Brain, TrendingUp, Shield, Zap, ArrowRight, Activity, Target } from 'lucide-react';
// import DefaultLayout from '@/layouts/default';

// export default function HeroPage() {
//   const metrics = [
//     { label: 'Total Value Locked', value: '$847M', change: '+12.4%' },
//     { label: 'Active Strategies', value: '2,847', change: '+8.2%' },
//     { label: 'Average APY', value: '23.7%', change: '+5.1%' }
//   ];

//   return (
//     <DefaultLayout>
//       <div className="min-h-screen bg-white dark:bg-black transition-colors">
//         <div className="container mx-auto px-6 py-24 max-w-7xl">
//           {/* Main Hero Content */}
//           <div className="-mt-14 max-w-5xl mb-24">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 mb-10 bg-neutral-50 dark:bg-neutral-950">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//               <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 tracking-wider">ON-CHAIN AI POWERED</span>
//             </div>

//             {/* Main Heading */}
//             <h1 className="text-7xl md:text-8xl font-light mb-10 leading-[0.95] tracking-tighter text-neutral-900 dark:text-white">
//               Intelligent Yield
//               <br />
//               <span className="text-neutral-400 dark:text-neutral-600">Aggregation</span>
//             </h1>

//             {/* Subtitle */}
//             <p className="text-2xl text-neutral-600 dark:text-neutral-400 mb-14 max-w-3xl font-light leading-relaxed">
//               Autonomous on-chain AI analyzes thousands of protocols to optimize your returns in real-time. No manual intervention required.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-8">
//               <button className="group px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-lg">
//                 Launch App
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button className="px-8 py-4 border-2 border-neutral-200 dark:border-neutral-800 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-all text-neutral-900 dark:text-white">
//                 View Documentation
//               </button>
//             </div>

//             {/* Trust Indicators */}
//             <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-600">
//               <div className="flex items-center gap-2">
//                 <Shield className="w-4 h-4" />
//                 <span className="font-mono">Audited by CertiK</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Activity className="w-4 h-4" />
//                 <span className="font-mono">99.9% Uptime</span>
//               </div>
//             </div>
//           </div>

//           {/* Metrics Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
//             {metrics.map((metric, index) => (
//               <div
//                 key={index}
//                 className="group p-8 border-2 border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all bg-white dark:bg-black"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="text-sm font-mono text-neutral-500 dark:text-neutral-500 tracking-wide uppercase">
//                     {metric.label}
//                   </div>
//                   <div className="flex items-center gap-1 text-xs font-mono text-green-600 dark:text-green-500">
//                     <TrendingUp className="w-3 h-3" />
//                     {metric.change}
//                   </div>
//                 </div>
//                 <div className="text-5xl font-light tracking-tight text-neutral-900 dark:text-white">
//                   {metric.value}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Feature Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               {
//                 icon: <Brain className="w-7 h-7" />,
//                 title: 'AI Optimization',
//                 description: 'Neural networks continuously analyze market conditions across 2,000+ protocols to maximize your returns.',
//                 stat: '23.7% Avg APY'
//               },
//               {
//                 icon: <Shield className="w-7 h-7" />,
//                 title: 'Risk Management',
//                 description: 'Advanced algorithms provide real-time risk assessment with automated position adjustments.',
//                 stat: '99.2% Success Rate'
//               },
//               {
//                 icon: <Zap className="w-7 h-7" />,
//                 title: 'Auto-Compound',
//                 description: 'Smart contracts automatically reinvest earnings every 6 hours for exponential growth.',
//                 stat: '4x Daily Compounds'
//               }
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className="group p-8 border-2 border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-900 dark:hover:border-white transition-all bg-gradient-to-br from-white to-neutral-50 dark:from-black dark:to-neutral-950"
//               >
//                 <div className="w-14 h-14 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center mb-6 text-white dark:text-black group-hover:scale-110 transition-transform">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-medium mb-3 text-neutral-900 dark:text-white">
//                   {feature.title}
//                 </h3>
//                 <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
//                   {feature.description}
//                 </p>
//                 <div className="text-sm font-mono text-neutral-500 dark:text-neutral-600">
//                   {feature.stat}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Bottom CTA Section */}
//           <div className="mt-24 p-12 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-black">
//             <div className="max-w-3xl">
//               <h2 className="text-4xl font-light mb-4 text-neutral-900 dark:text-white tracking-tight">
//                 Ready to maximize your yields?
//               </h2>
//               <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 font-light">
//                 Join thousands of users earning passive income with AI-optimized strategies.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button className="group px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2">
//                   Get Started
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <button className="px-8 py-4 text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors">
//                   Schedule a Demo
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DefaultLayout>
//   );
// }
import DefaultLayout from '@/layouts/default';
import { Brain, TrendingUp, Shield, Zap, ArrowRight, Activity, Target, Sparkles, Lock, BarChart3 } from 'lucide-react';

export default function HeroPage() {
  const metrics = [
    { label: 'Total Value Locked', value: '$847M', change: '+12.4%' },
    { label: 'Active Strategies', value: '2,847', change: '+8.2%' },
    { label: 'Average APY', value: '23.7%', change: '+5.1%' }
  ];

  return (
    <DefaultLayout>
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-1000 text-white">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '20s' }} />
      </div>

      <div className="container mx-auto px-6 py-24 max-w-7xl relative">
        {/* Main Hero Content */}
        <div className="max-w-5xl mb-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 mb-10 bg-violet-950/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span className="text-xs font-mono text-violet-300 tracking-wider">AI-POWERED DEFI</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-7xl md:text-8xl font-light mb-10 leading-[0.95] tracking-tighter">
            Intelligent Yield
            <br />
            <span className="text-slate-500">Aggregation</span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-slate-300 mb-14 max-w-3xl font-light leading-relaxed">
            Autonomous on-chain AI analyzes thousands of protocols to optimize your returns in real-time. No manual intervention required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="group px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              Launch App
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-slate-700 rounded-xl font-medium hover:bg-slate-800/50 hover:border-slate-600 transition-all backdrop-blur-sm">
              View Documentation
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-mono">Audited by CertiK</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="font-mono">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-400" />
              <span className="font-mono">Non-Custodial</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-8 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all bg-slate-900/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-mono text-slate-500 tracking-wide uppercase">
                  {metric.label}
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
              <div className="text-5xl font-light tracking-tight text-white">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            {
              icon: <Brain className="w-7 h-7" />,
              title: 'AI Optimization',
              description: 'Neural networks continuously analyze market conditions across 2,000+ protocols to maximize your returns.',
              stat: '23.7% Avg APY',
              color: 'text-violet-400'
            },
            {
              icon: <Shield className="w-7 h-7" />,
              title: 'Risk Management',
              description: 'Advanced algorithms provide real-time risk assessment with automated position adjustments.',
              stat: '99.2% Success Rate',
              color: 'text-cyan-400'
            },
            {
              icon: <Zap className="w-7 h-7" />,
              title: 'Auto-Compound',
              description: 'Smart contracts automatically reinvest earnings every 6 hours for exponential growth.',
              stat: '4x Daily Compounds',
              color: 'text-emerald-400'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all bg-slate-900/50 backdrop-blur-sm"
            >
              <div className={`${feature.color} mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="text-sm font-mono text-slate-500">
                {feature.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="p-12 border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-light mb-4 text-white tracking-tight">
              Ready to maximize your yields?
            </h2>
            <p className="text-xl text-slate-300 mb-8 font-light">
              Join thousands of users earning passive income with AI-optimized strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 text-slate-300 font-medium hover:text-white transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DefaultLayout>
  );
}