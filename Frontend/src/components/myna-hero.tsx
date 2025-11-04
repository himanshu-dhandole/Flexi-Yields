// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowRight,
//   BarChart3,
//   Brain,
//   Coins,
//   Shield,
//   Network,
//   Zap,
//   Cpu,
//   Database,
//   LineChart,
//   Lock,
//   CheckCircle,
//   TrendingUp,
//   Globe,
//   Layers,
//   ChevronRight,
//   Activity,
//   Target,
//   Sparkles,
//   Code,
//   Users,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const highlights = [
//   { icon: Brain, label: "AI-Optimized Yield Routing" },
//   { icon: Network, label: "On-Chain Transparency" },
//   { icon: Shield, label: "Smart Risk Management" },
// ];

// const features = [
//   {
//     icon: BarChart3,
//     label: "Autonomous Yield Allocation",
//     description:
//       "Our AI dynamically reallocates capital across DeFi protocols to maximize returns and minimize risk.",
//   },
//   {
//     icon: Coins,
//     label: "Aggregated Liquidity Access",
//     description:
//       "Seamlessly connect to top protocols like Aave, Compound, and Curve through one intelligent vault.",
//   },
//   {
//     icon: Zap,
//     label: "Predictive Optimization Engine",
//     description:
//       "Machine learning models analyze on-chain trends to anticipate yield shifts before they happen.",
//   },
//   {
//     icon: TrendingUp,
//     label: "Real-Time Performance Tracking",
//     description:
//       "Monitor your portfolio's performance with live analytics and transparent yield attribution.",
//   },
//   {
//     icon: Globe,
//     label: "Multi-Chain Support",
//     description:
//       "Deploy capital across Ethereum, Arbitrum, and Polygon for diversified yield opportunities.",
//   },
//   {
//     icon: Layers,
//     label: "Composable Strategy Layers",
//     description:
//       "Stack multiple AI-driven strategies to create custom risk-return profiles tailored to your goals.",
//   },
// ];

// const stats = [
//   { label: "Total Value Locked", value: "$158.2M", change: "+12.3%" },
//   { label: "Average APY", value: "12.4%", change: "+2.1%" },
//   { label: "Active Users", value: "42.3K", change: "+8.5%" },
//   { label: "Integrated Protocols", value: "25+", change: "+4" },
// ];

// const integrations = [
//   "Aave",
//   "Compound",
//   "Curve",
//   "Uniswap",
//   "Balancer",
//   "SushiSwap",
//   "Lido",
//   "Yearn",
//   "Convex",
// ];

// const steps = [
//   {
//     icon: Database,
//     title: "Deposit Funds",
//     description:
//       "Connect your wallet and deposit assets into AI-managed vaults via secure smart contracts.",
//   },
//   {
//     icon: Cpu,
//     title: "AI Allocation",
//     description:
//       "Advanced algorithms continuously route liquidity across protocols based on real-time yield data and risk metrics.",
//   },
//   {
//     icon: LineChart,
//     title: "Earn & Auto-Rebalance",
//     description:
//       "Your funds automatically optimize for maximum return with zero manual intervention required.",
//   },
// ];

// const audits = [
//   {
//     icon: CheckCircle,
//     title: "Smart Contract Audited",
//     desc: "Verified by CertiK & PeckShield",
//   },
//   { icon: Shield, title: "Insurance Coverage", desc: "Backed by Nexus Mutual" },
//   {
//     icon: Lock,
//     title: "Non-Custodial",
//     desc: "Users always retain asset ownership",
//   },
// ];

// const roadmap = [
//   { q: "Q1 2025", m: "Mainnet Launch & Governance Alpha", status: "active" },
//   { q: "Q2 2025", m: "AI Strategy Marketplace", status: "upcoming" },
//   { q: "Q3 2025", m: "Cross-Chain Yield Router", status: "upcoming" },
//   { q: "Q4 2025", m: "Institutional Integrations", status: "upcoming" },
// ];

// const faqs = [
//   {
//     q: "How does the AI optimize yields?",
//     a: "The AI continuously analyzes on-chain data and reallocates liquidity toward the most profitable yet secure opportunities.",
//   },
//   {
//     q: "Is this platform self-custodial?",
//     a: "Yes. All assets remain under user-owned smart contracts. We never take custody.",
//   },
//   {
//     q: "Which networks are supported?",
//     a: "Currently Ethereum, Arbitrum, and Polygon. More chains are being integrated.",
//   },
//   {
//     q: "Are smart contracts audited?",
//     a: "Yes. Our contracts undergo multi-round audits with top firms before deployment.",
//   },
// ];

// interface AnimatedSectionProps {
//   children: React.ReactNode;
//   delay?: number;
//   className?: string;
// }

// function AnimatedSection({
//   children,
//   delay = 0,
//   className = "",
// }: AnimatedSectionProps) {
//   const [isVisible, setIsVisible] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setTimeout(() => setIsVisible(true), delay);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, [delay]);

//   return (
//     <div
//       ref={ref}
//       className={`transition-all duration-700 ${
//         isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//       } ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// export default function MynaHero() {
//   const [heroVisible, setHeroVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const titleWords = ["THE", "ON-CHAIN", "AI", "YIELD", "AGGREGATOR"];

//   useEffect(() => {
//     setHeroVisible(true);
//   }, []);

//   return (
//     <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
//       {/* Animated Grid Background */}
//       <div className="fixed inset-0 -z-10 opacity-20">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `
//             linear-gradient(rgba(255, 107, 44, 0.1) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255, 107, 44, 0.1) 1px, transparent 1px)
//           `,
//             backgroundSize: "50px 50px",
//           }}
//         />
//       </div>

//       <main>
//         {/* Hero Section - KEPT AS IS */}
//         <section className="container mx-auto px-4 py-24 relative">
//           <div className="flex flex-col items-center text-center">
//             <h1
//               className={`relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight transition-all duration-700 ${
//                 heroVisible
//                   ? "opacity-100 blur-0 translate-y-0"
//                   : "opacity-0 blur-lg translate-y-12"
//               }`}
//             >
//               {titleWords.map((text, index) => (
//                 <span
//                   key={index}
//                   className="inline-block mx-2 md:mx-4"
//                   style={{
//                     animation: heroVisible
//                       ? `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`
//                       : "none",
//                     opacity: 0,
//                   }}
//                 >
//                   {text}
//                 </span>
//               ))}
//             </h1>

//             <p
//               className={`mx-auto mt-8 max-w-2xl text-xl text-muted-foreground font-mono transition-all duration-700 delay-1200 ${
//                 heroVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-5"
//               }`}
//             >
//               Harness artificial intelligence to optimize DeFi yields, automate
//               liquidity routing, and grow your crypto portfolio efficiently.
//             </p>

//             <div
//               className={`mt-12 flex flex-wrap justify-center gap-6 transition-all duration-700 delay-[1800ms] ${
//                 heroVisible ? "opacity-100" : "opacity-0"
//               }`}
//             >
//               {highlights.map((feature, index) => (
//                 <div
//                   key={feature.label}
//                   className="flex items-center gap-2 px-6 transition-all duration-300 hover:scale-105"
//                   style={{
//                     animation: heroVisible
//                       ? `fadeInUp 0.6s ease-out ${1.8 + index * 0.15}s forwards`
//                       : "none",
//                     opacity: 0,
//                   }}
//                 >
//                   <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
//                   <span className="text-sm font-mono">{feature.label}</span>
//                 </div>
//               ))}
//             </div>

//             <div
//               className={`transition-all duration-700 delay-[2400ms] ${
//                 heroVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-5"
//               }`}
//             >
//               <Button
//                 size="lg"
//                 className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono transition-all duration-300 hover:scale-105"
//               >
//                 LAUNCH APP <ArrowRight className="ml-1 w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </section>

//         {/* Live Stats Dashboard */}
//         <section className="py-4 relative">
//           <div className="container mx-auto px-4">
//             <div className="bg-[#FF6B2C]/5 border-l-4 border-[#FF6B2C] p-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <Activity className="h-6 w-6 text-[#FF6B2C] animate-pulse" />
//                 <h3 className="text-2xl font-mono font-bold">LIVE METRICS</h3>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {stats.map((item, i) => (
//                   <AnimatedSection key={item.label} delay={i * 100}>
//                     <div className="relative group">
//                       <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B2C] to-[#FF6B2C]/50 opacity-0 group-hover:opacity-20 blur transition duration-300" />
//                       <div className="relative bg-background p-6 border border-[#FF6B2C]/20">
//                         <div className="flex justify-between items-start mb-2">
//                           <p className="text-xs font-mono text-muted-foreground uppercase">
//                             {item.label}
//                           </p>
//                           <span className="text-xs font-mono text-[#FF6B2C]">
//                             {item.change}
//                           </span>
//                         </div>
//                         <p className="text-3xl font-bold font-mono text-[#FF6B2C]">
//                           {item.value}
//                         </p>
//                       </div>
//                     </div>
//                   </AnimatedSection>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Feature Cards Grid */}
//         <section className="py-24 container mx-auto px-4">
//           <AnimatedSection>
//             <div className="flex items-center gap-4 mb-12">
//               <div className="h-px flex-1 bg-[#FF6B2C]/20" />
//               <h2 className="text-3xl font-mono font-bold">CORE FEATURES</h2>
//               <div className="h-px flex-1 bg-[#FF6B2C]/20" />
//             </div>
//           </AnimatedSection>

//           <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
//             {features.map((feature, i) => (
//               <AnimatedSection key={feature.label} delay={i * 100}>
//                 <div className="relative group h-full">
//                   <div className="absolute -inset-1 bg-[#FF6B2C] opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
//                   <div className="relative bg-background border-2 border-[#FF6B2C]/20 p-8 h-full flex flex-col group-hover:border-[#FF6B2C] transition-all duration-300">
//                     <div className="flex items-start gap-4 mb-4">
//                       <div className="p-3 bg-[#FF6B2C]/10 border border-[#FF6B2C]/30">
//                         <feature.icon className="h-7 w-7 text-[#FF6B2C]" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="text-xl font-mono font-bold mb-2">
//                           {feature.label}
//                         </h3>
//                         <div className="h-1 w-12 bg-[#FF6B2C]" />
//                       </div>
//                     </div>
//                     <p className="text-sm text-muted-foreground leading-relaxed flex-1">
//                       {feature.description}
//                     </p>
//                     <ChevronRight className="h-5 w-5 text-[#FF6B2C] mt-4 group-hover:translate-x-2 transition-transform duration-300" />
//                   </div>
//                 </div>
//               </AnimatedSection>
//             ))}
//           </div>
//         </section>

//         {/* Process Timeline */}
//         <section className="py-24 bg-[#FF6B2C]/5">
//           <div className="container mx-auto px-4">
//             <AnimatedSection>
//               <div className="text-center mb-16">
//                 <div className="inline-block px-6 py-2 bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 mb-4">
//                   <span className="text-sm font-mono text-[#FF6B2C]">
//                     HOW IT WORKS
//                   </span>
//                 </div>
//                 <h2 className="text-4xl font-mono font-bold">
//                   THREE STEPS TO YIELD
//                 </h2>
//               </div>
//             </AnimatedSection>

//             <div className="relative max-w-5xl mx-auto">
//               <div className="absolute top-0 left-0 md:left-1/2 bottom-0 w-1 bg-[#FF6B2C]/20 hidden md:block" />

//               {steps.map((step, i) => (
//                 <AnimatedSection key={step.title} delay={i * 200}>
//                   <div
//                     className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center mb-16 last:mb-0`}
//                   >
//                     <div className="flex-1 md:pr-12">
//                       {i % 2 === 0 && (
//                         <div className="bg-background border-2 border-[#FF6B2C]/30 p-8">
//                           <div className="flex items-center gap-4 mb-4">
//                             <span className="text-6xl font-mono font-bold text-[#FF6B2C]/20">
//                               0{i + 1}
//                             </span>
//                             <step.icon className="h-10 w-10 text-[#FF6B2C]" />
//                           </div>
//                           <h3 className="text-2xl font-mono font-bold mb-4">
//                             {step.title}
//                           </h3>
//                           <p className="text-muted-foreground leading-relaxed">
//                             {step.description}
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FF6B2C] items-center justify-center z-10">
//                       <step.icon className="h-6 w-6 text-background" />
//                     </div>

//                     <div className="flex-1 md:pl-12">
//                       {i % 2 !== 0 && (
//                         <div className="bg-background border-2 border-[#FF6B2C]/30 p-8">
//                           <div className="flex items-center gap-4 mb-4">
//                             <span className="text-6xl font-mono font-bold text-[#FF6B2C]/20">
//                               0{i + 1}
//                             </span>
//                             <step.icon className="h-10 w-10 text-[#FF6B2C]" />
//                           </div>
//                           <h3 className="text-2xl font-mono font-bold mb-4">
//                             {step.title}
//                           </h3>
//                           <p className="text-muted-foreground leading-relaxed">
//                             {step.description}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </AnimatedSection>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Protocol Integration Ticker */}
//         <section className="py-16 border-y-2 border-[#FF6B2C]/20 overflow-hidden bg-background">
//           <div className="mb-8 text-center">
//             <span className="text-xs font-mono text-[#FF6B2C] tracking-wider">
//               POWERED BY
//             </span>
//           </div>
//           <div className="flex animate-scroll">
//             {[...integrations, ...integrations].map((name, i) => (
//               <div key={i} className="flex-shrink-0 mx-8">
//                 <div className="px-8 py-4 border-2 border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/5 transition-all duration-300">
//                   <span className="text-2xl font-mono font-bold text-muted-foreground hover:text-[#FF6B2C]">
//                     {name}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Security Grid */}
//         <section className="py-24 container mx-auto px-4">
//           <AnimatedSection>
//             <div className="text-center mb-16">
//               <Shield className="h-12 w-12 text-[#FF6B2C] mx-auto mb-4" />
//               <h2 className="text-4xl font-mono font-bold">
//                 SECURITY PROTOCOL
//               </h2>
//             </div>
//           </AnimatedSection>

//           <div className="grid md:grid-cols-3 gap-1 max-w-6xl mx-auto bg-[#FF6B2C]/20">
//             {audits.map((item, i) => (
//               <AnimatedSection key={item.title} delay={i * 100}>
//                 <div className="bg-background p-10 h-full flex flex-col items-center text-center group hover:bg-[#FF6B2C]/5 transition-all duration-300">
//                   <div className="mb-6 relative">
//                     <div className="absolute inset-0 bg-[#FF6B2C]/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
//                     <item.icon className="h-16 w-16 text-[#FF6B2C] relative" />
//                   </div>
//                   <h3 className="font-mono font-bold text-xl mb-3">
//                     {item.title}
//                   </h3>
//                   <div className="h-px w-16 bg-[#FF6B2C] mb-4" />
//                   <p className="text-sm text-muted-foreground">{item.desc}</p>
//                 </div>
//               </AnimatedSection>
//             ))}
//           </div>
//         </section>

//         {/* Roadmap Progress Bar */}
//         <section className="py-24 bg-[#FF6B2C]/5">
//           <div className="container mx-auto px-4">
//             <AnimatedSection>
//               <div className="text-center mb-16">
//                 <Target className="h-12 w-12 text-[#FF6B2C] mx-auto mb-4" />
//                 <h2 className="text-4xl font-mono font-bold">
//                   DEVELOPMENT ROADMAP
//                 </h2>
//               </div>
//             </AnimatedSection>

//             <div className="max-w-6xl mx-auto">
//               <div className="relative">
//                 <div className="absolute top-8 left-0 right-0 h-1 bg-[#FF6B2C]/20" />
//                 <div className="absolute top-8 left-0 w-1/4 h-1 bg-[#FF6B2C]" />

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
//                   {roadmap.map((r, i) => (
//                     <AnimatedSection key={r.q} delay={i * 150}>
//                       <div
//                         className={`text-center ${r.status === "active" ? "opacity-100" : "opacity-60"}`}
//                       >
//                         <div
//                           className={`w-16 h-16 mx-auto mb-6 border-4 flex items-center justify-center font-mono font-bold text-lg ${
//                             r.status === "active"
//                               ? "border-[#FF6B2C] bg-[#FF6B2C] text-background"
//                               : "border-[#FF6B2C]/30 bg-background text-[#FF6B2C]"
//                           }`}
//                         >
//                           {i + 1}
//                         </div>
//                         <h3 className="text-xl font-bold text-[#FF6B2C] mb-2 font-mono">
//                           {r.q}
//                         </h3>
//                         <p className="text-sm text-muted-foreground">{r.m}</p>
//                         {r.status === "active" && (
//                           <div className="mt-3">
//                             <span className="text-xs font-mono px-3 py-1 bg-[#FF6B2C] text-background">
//                               IN PROGRESS
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </AnimatedSection>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* FAQ Accordion Style */}
//         <section className="py-24 container mx-auto px-4">
//           <AnimatedSection>
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-mono font-bold">FREQUENTLY ASKED</h2>
//             </div>
//           </AnimatedSection>

//           <div className="max-w-4xl mx-auto space-y-4">
//             {faqs.map((f, i) => (
//               <AnimatedSection key={f.q} delay={i * 100}>
//                 <div className="border-l-4 border-[#FF6B2C] bg-[#FF6B2C]/5 p-6 hover:bg-[#FF6B2C]/10 transition-colors duration-300 group">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B2C] flex items-center justify-center font-mono font-bold text-background text-sm">
//                       {i + 1}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-mono font-bold text-lg mb-3 group-hover:text-[#FF6B2C] transition-colors duration-300">
//                         {f.q}
//                       </h3>
//                       <p className="text-sm text-muted-foreground leading-relaxed">
//                         {f.a}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </AnimatedSection>
//             ))}
//           </div>
//         </section>

//         {/* Final CTA Banner */}
//         <section className="py-32 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B2C]/10 via-[#FF6B2C]/5 to-[#FF6B2C]/10" />
//           <div className="container mx-auto px-4 relative">
//             <AnimatedSection>
//               <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles className="h-16 w-16 text-[#FF6B2C] mx-auto mb-8" />
//                 <h2 className="text-5xl md:text-6xl font-mono font-bold mb-6">
//                   START EARNING
//                   <span className="block text-[#FF6B2C]">TODAY</span>
//                 </h2>
//                 <p className="text-xl text-muted-foreground mb-12 font-mono max-w-2xl mx-auto">
//                   Join 42,000+ users maximizing yields with AI-powered DeFi
//                   strategies
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-6 justify-center">
//                   <Button
//                     size="lg"
//                     className="rounded-none bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono text-lg px-12 py-6 h-auto transition-all duration-300 hover:scale-105"
//                   >
//                     LAUNCH APP <ArrowRight className="ml-2 w-5 h-5" />
//                   </Button>
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="rounded-none border-2 border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C]/10 font-mono text-lg px-12 py-6 h-auto"
//                   >
//                     READ DOCS <Code className="ml-2 w-5 h-5" />
//                   </Button>
//                 </div>
//               </div>
//             </AnimatedSection>
//           </div>
//         </section>
//       </main>

//       <style>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes scroll {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
        
//         .animate-scroll {
//           animation: scroll 30s linear infinite;
//         }
        
//         .animate-scroll:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Coins,
  Shield,
  Network,
  Zap,
  Cpu,
  Database,
  LineChart,
  Lock,
  CheckCircle,
  TrendingUp,
  Globe,
  Layers,
  ChevronRight,
  Activity,
  Target,
  Sparkles,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Brain, label: "AI-Optimized Yield Routing" },
  { icon: Network, label: "On-Chain Transparency" },
  { icon: Shield, label: "Smart Risk Management" },
];

const features = [
  {
    icon: BarChart3,
    label: "Autonomous Yield Allocation",
    description:
      "Our AI dynamically reallocates capital across DeFi protocols to maximize returns and minimize risk.",
  },
  {
    icon: Coins,
    label: "Aggregated Liquidity Access",
    description:
      "Seamlessly connect to top protocols like Aave, Compound, and Curve through one intelligent vault.",
  },
  {
    icon: Zap,
    label: "Predictive Optimization Engine",
    description:
      "Machine learning models analyze on-chain trends to anticipate yield shifts before they happen.",
  },
  {
    icon: TrendingUp,
    label: "Real-Time Performance Tracking",
    description:
      "Monitor your portfolio's performance with live analytics and transparent yield attribution.",
  },
  {
    icon: Globe,
    label: "Multi-Chain Support",
    description:
      "Deploy capital across Ethereum, Arbitrum, and Polygon for diversified yield opportunities.",
  },
  {
    icon: Layers,
    label: "Composable Strategy Layers",
    description:
      "Stack multiple AI-driven strategies to create custom risk-return profiles tailored to your goals.",
  },
];

const stats = [
  { label: "Total Value Locked", value: "$158.2M", change: "+12.3%" },
  { label: "Average APY", value: "12.4%", change: "+2.1%" },
  { label: "Active Users", value: "42.3K", change: "+8.5%" },
  { label: "Integrated Protocols", value: "25+", change: "+4" },
];

const integrations = [
  "Aave",
  "Compound",
  "Curve",
  "Uniswap",
  "Balancer",
  "SushiSwap",
  "Lido",
  "Yearn",
  "Convex",
];

const steps = [
  {
    icon: Database,
    title: "Deposit Funds",
    description:
      "Connect your wallet and deposit assets into AI-managed vaults via secure smart contracts.",
  },
  {
    icon: Cpu,
    title: "AI Allocation",
    description:
      "Advanced algorithms continuously route liquidity across protocols based on real-time yield data and risk metrics.",
  },
  {
    icon: LineChart,
    title: "Earn & Auto-Rebalance",
    description:
      "Your funds automatically optimize for maximum return with zero manual intervention required.",
  },
];

const audits = [
  {
    icon: CheckCircle,
    title: "Smart Contract Audited",
    desc: "Verified by CertiK & PeckShield",
  },
  { icon: Shield, title: "Insurance Coverage", desc: "Backed by Nexus Mutual" },
  {
    icon: Lock,
    title: "Non-Custodial",
    desc: "Users always retain asset ownership",
  },
];

const roadmap = [
  { q: "Q1 2025", m: "Mainnet Launch & Governance Alpha", status: "active" },
  { q: "Q2 2025", m: "AI Strategy Marketplace", status: "upcoming" },
  { q: "Q3 2025", m: "Cross-Chain Yield Router", status: "upcoming" },
  { q: "Q4 2025", m: "Institutional Integrations", status: "upcoming" },
];

const faqs = [
  {
    q: "How does the AI optimize yields?",
    a: "The AI continuously analyzes on-chain data and reallocates liquidity toward the most profitable yet secure opportunities.",
  },
  {
    q: "Is this platform self-custodial?",
    a: "Yes. All assets remain under user-owned smart contracts. We never take custody.",
  },
  {
    q: "Which networks are supported?",
    a: "Currently Ethereum, Arbitrum, and Polygon. More chains are being integrated.",
  },
  {
    q: "Are smart contracts audited?",
    a: "Yes. Our contracts undergo multi-round audits with top firms before deployment.",
  },
];

    interface AnimatedSectionProps {
      children: React.ReactNode;
      delay?: number;
      className?: string;
    }

function AnimatedSection({ children, delay = 0, className = "" }: AnimatedSectionProps ) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function MynaHero() {
  const [heroVisible, setHeroVisible] = useState(false);
  const titleWords = ["THE", "ON-CHAIN", "AI", "YIELD", "AGGREGATOR"];

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255, 107, 44, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 44, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 relative">
          <div className="flex flex-col items-center text-center">
            <h1
              className={`relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight transition-all duration-700 ${
                heroVisible
                  ? "opacity-100 blur-0 translate-y-0"
                  : "opacity-0 blur-lg translate-y-12"
              }`}
            >
              {titleWords.map((text, index) => (
                <span
                  key={index}
                  className="inline-block mx-2 md:mx-4"
                  style={{
                    animation: heroVisible
                      ? `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`
                      : "none",
                    opacity: 0,
                  }}
                >
                  {text}
                </span>
              ))}
            </h1>

            <p
              className={`mx-auto mt-8 max-w-2xl text-xl text-muted-foreground font-mono transition-all duration-700 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "1.2s" }}
            >
              Harness artificial intelligence to optimize DeFi yields, automate
              liquidity routing, and grow your crypto portfolio efficiently.
            </p>

            <div
              className={`mt-12 flex flex-wrap justify-center gap-6 transition-all duration-700 ${
                heroVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "1.8s" }}
            >
              {highlights.map((feature, index) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 px-6 transition-all duration-300 hover:scale-105"
                  style={{
                    animation: heroVisible
                      ? `fadeInUp 0.6s ease-out ${1.8 + index * 0.15}s forwards`
                      : "none",
                    opacity: 0,
                  }}
                >
                  <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </div>
              ))}
            </div>

            <div
              className={`transition-all duration-700 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "2.4s" }}
            >
              <Button
                size="lg"
                className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono transition-all duration-300 hover:scale-105"
              >
                LAUNCH APP <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Live Stats Dashboard */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="bg-[#FF6B2C]/5 border-l-4 border-[#FF6B2C] p-8">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-[#FF6B2C] animate-pulse" />
                <h3 className="text-2xl font-mono font-bold">LIVE METRICS</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, i) => (
                  <AnimatedSection key={item.label} delay={i * 100}>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B2C] to-[#FF6B2C]/50 opacity-0 group-hover:opacity-20 blur transition duration-300" />
                      <div className="relative bg-background p-6 border border-[#FF6B2C]/20">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-mono text-muted-foreground uppercase">
                            {item.label}
                          </p>
                          <span className="text-xs font-mono text-[#FF6B2C]">
                            {item.change}
                          </span>
                        </div>
                        <p className="text-3xl font-bold font-mono text-[#FF6B2C]">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-24 container mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-[#FF6B2C]/20" />
              <h2 className="text-3xl font-mono font-bold">CORE FEATURES</h2>
              <div className="h-px flex-1 bg-[#FF6B2C]/20" />
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.label} delay={i * 100}>
                <div className="relative group h-full">
                  <div className="absolute -inset-1 bg-[#FF6B2C] opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
                  <div className="relative bg-background border-2 border-[#FF6B2C]/20 p-8 h-full flex flex-col group-hover:border-[#FF6B2C] transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-[#FF6B2C]/10 border border-[#FF6B2C]/30">
                        <feature.icon className="h-7 w-7 text-[#FF6B2C]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-mono font-bold mb-2">
                          {feature.label}
                        </h3>
                        <div className="h-1 w-12 bg-[#FF6B2C]" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {feature.description}
                    </p>
                    <ChevronRight className="h-5 w-5 text-[#FF6B2C] mt-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-24 bg-[#FF6B2C]/5">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <div className="inline-block px-6 py-2 bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 mb-4">
                  <span className="text-sm font-mono text-[#FF6B2C]">
                    HOW IT WORKS
                  </span>
                </div>
                <h2 className="text-4xl font-mono font-bold">
                  THREE STEPS TO YIELD
                </h2>
              </div>
            </AnimatedSection>

            <div className="relative max-w-5xl mx-auto">
              <div className="absolute top-0 left-0 md:left-1/2 bottom-0 w-1 bg-[#FF6B2C]/20 hidden md:block" />

              {steps.map((step, i) => (
                <AnimatedSection key={step.title} delay={i * 200}>
                  <div
                    className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center mb-16 last:mb-0`}
                  >
                    <div className="flex-1 md:pr-12">
                      {i % 2 === 0 && (
                        <div className="bg-background border-2 border-[#FF6B2C]/30 p-8">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-6xl font-mono font-bold text-[#FF6B2C]/20">
                              0{i + 1}
                            </span>
                            <step.icon className="h-10 w-10 text-[#FF6B2C]" />
                          </div>
                          <h3 className="text-2xl font-mono font-bold mb-4">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FF6B2C] items-center justify-center z-10">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1 md:pl-12">
                      {i % 2 !== 0 && (
                        <div className="bg-background border-2 border-[#FF6B2C]/30 p-8">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-6xl font-mono font-bold text-[#FF6B2C]/20">
                              0{i + 1}
                            </span>
                            <step.icon className="h-10 w-10 text-[#FF6B2C]" />
                          </div>
                          <h3 className="text-2xl font-mono font-bold mb-4">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Protocol Integration Ticker */}
        <section className="py-16 border-y-2 border-[#FF6B2C]/20 overflow-hidden bg-background">
          <div className="mb-8 text-center">
            <span className="text-xs font-mono text-[#FF6B2C] tracking-wider">
              POWERED BY
            </span>
          </div>
          <div className="flex animate-scroll">
            {[...integrations, ...integrations].map((name, i) => (
              <div key={i} className="flex-shrink-0 mx-8">
                <div className="px-8 py-4 border-2 border-[#FF6B2C]/30 hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/5 transition-all duration-300">
                  <span className="text-2xl font-mono font-bold text-muted-foreground hover:text-[#FF6B2C]">
                    {name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Grid */}
        <section className="py-24 container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Shield className="h-12 w-12 text-[#FF6B2C] mx-auto mb-4" />
              <h2 className="text-4xl font-mono font-bold">
                SECURITY PROTOCOL
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-1 max-w-6xl mx-auto bg-[#FF6B2C]/20">
            {audits.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 100}>
                <div className="bg-background p-10 h-full flex flex-col items-center text-center group hover:bg-[#FF6B2C]/5 transition-all duration-300">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-[#FF6B2C]/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <item.icon className="h-16 w-16 text-[#FF6B2C] relative" />
                  </div>
                  <h3 className="font-mono font-bold text-xl mb-3">
                    {item.title}
                  </h3>
                  <div className="h-px w-16 bg-[#FF6B2C] mb-4" />
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Roadmap Progress Bar */}
        <section className="py-24 bg-[#FF6B2C]/5">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <Target className="h-12 w-12 text-[#FF6B2C] mx-auto mb-4" />
                <h2 className="text-4xl font-mono font-bold">
                  DEVELOPMENT ROADMAP
                </h2>
              </div>
            </AnimatedSection>

            <div className="max-w-6xl mx-auto">
              <div className="relative">
                <div className="absolute top-8 left-0 right-0 h-1 bg-[#FF6B2C]/20 hidden md:block" />
                <div className="absolute top-8 left-0 w-1/4 h-1 bg-[#FF6B2C] hidden md:block" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  {roadmap.map((r, i) => (
                    <AnimatedSection key={r.q} delay={i * 150}>
                      <div
                        className={`text-center ${r.status === "active" ? "opacity-100" : "opacity-60"}`}
                      >
                        <div
                          className={`w-16 h-16 mx-auto mb-6 border-4 flex items-center justify-center font-mono font-bold text-lg ${
                            r.status === "active"
                              ? "border-[#FF6B2C] bg-[#FF6B2C] text-white"
                              : "border-[#FF6B2C]/30 bg-background text-[#FF6B2C]"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <h3 className="text-xl font-bold text-[#FF6B2C] mb-2 font-mono">
                          {r.q}
                        </h3>
                        <p className="text-sm text-muted-foreground">{r.m}</p>
                        {r.status === "active" && (
                          <div className="mt-3">
                            <span className="text-xs font-mono px-3 py-1 bg-[#FF6B2C] text-white">
                              IN PROGRESS
                            </span>
                          </div>
                        )}
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Style */}
        <section className="py-24 container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-mono font-bold">FREQUENTLY ASKED</h2>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((f, i) => (
              <AnimatedSection key={f.q} delay={i * 100}>
                <div className="border-l-4 border-[#FF6B2C] bg-[#FF6B2C]/5 p-6 hover:bg-[#FF6B2C]/10 transition-colors duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B2C] flex items-center justify-center font-mono font-bold text-white text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-mono font-bold text-lg mb-3 group-hover:text-[#FF6B2C] transition-colors duration-300">
                        {f.q}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B2C]/10 via-[#FF6B2C]/5 to-[#FF6B2C]/10" />
          <div className="container mx-auto px-4 relative">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <Sparkles className="h-16 w-16 text-[#FF6B2C] mx-auto mb-8" />
                <h2 className="text-5xl md:text-6xl font-mono font-bold mb-6">
                  START EARNING
                  <span className="block text-[#FF6B2C]">TODAY</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-12 font-mono max-w-2xl mx-auto">
                  Join 42,000+ users maximizing yields with AI-powered DeFi
                  strategies
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    size="lg"
                    className="rounded-none bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono text-lg px-12 py-6 h-auto transition-all duration-300 hover:scale-105"
                  >
                    LAUNCH APP <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-none border-2 border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C]/10 font-mono text-lg px-12 py-6 h-auto"
                  >
                    READ DOCS <Code className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}