// "use client";

// import * as React from "react";
// import {
//   Activity,
//   ArrowRight,
//   BarChart3,
//   Brain,
//   Coins,
//   Shield,
//   Menu,
//   Network,
//   Zap,
// } from "lucide-react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { motion, useAnimation, useInView } from "framer-motion";
// import { Button } from "@/components/ui/button";

// const navigationItems = [
//   { title: "DASHBOARD", href: "#" },
//   { title: "VAULTS", href: "#" },
//   { title: "STRATEGIES", href: "#" },
//   { title: "GOVERNANCE", href: "#" },
// ];

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
// ];

// export function MynaHero() {
//   const controls = useAnimation();
//   const ref = React.useRef(null);
//   const isInView = useInView(ref, { once: true, amount: 0.1 });

//   React.useEffect(() => {
//     if (isInView) controls.start("visible");
//   }, [controls, isInView]);

//   const titleWords = ["THE", "ON-CHAIN", "AI", "YIELD", "AGGREGATOR"];

//   return (
//     <div className="container mx-auto px-4 min-h-screen bg-background mt-2">
//       <main>
//         {/* Hero Section */}
//         <section className="container py-24">
//           <div className="flex flex-col items-center text-center">
//             <motion.h1
//               initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
//               animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight"
//             >
//               {titleWords.map((text, index) => (
//                 <motion.span
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{
//                     delay: index * 0.15,
//                     duration: 0.6,
//                   }}
//                   className="inline-block mx-2 md:mx-4"
//                 >
//                   {text}
//                 </motion.span>
//               ))}
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1.2, duration: 0.6 }}
//               className="mx-auto mt-8 max-w-2xl text-xl text-foreground font-mono"
//             >
//               Harness artificial intelligence to optimize DeFi yields, automate
//               liquidity routing, and grow your crypto portfolio efficiently.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.8, duration: 0.6 }}
//               className="mt-12 flex flex-wrap justify-center gap-6"
//             >
//               {highlights.map((feature, index) => (
//                 <motion.div
//                   key={feature.label}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{
//                     delay: 1.8 + index * 0.15,
//                     duration: 0.6,
//                     type: "spring",
//                     stiffness: 100,
//                     damping: 10,
//                   }}
//                   className="flex items-center gap-2 px-6"
//                 >
//                   <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
//                   <span className="text-sm font-mono">{feature.label}</span>
//                 </motion.div>
//               ))}
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 delay: 2.4,
//                 duration: 0.6,
//                 type: "spring",
//                 stiffness: 100,
//                 damping: 10,
//               }}
//             >
//               <Button
//                 size="lg"
//                 className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
//               >
//                 LAUNCH APP <ArrowRight className="ml-1 w-4 h-4 " />
//               </Button>
//             </motion.div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section className="container mt-16" ref={ref}>
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{
//               delay: 3.0,
//               duration: 0.6,
//               type: "spring",
//               stiffness: 100,
//               damping: 10,
//             }}
//             className="text-center text-4xl font-mono font-bold mb-6"
//           >
//             Smarter Yields, Powered by AI
//           </motion.h2>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 3.2, duration: 0.6 }}
//             className="grid md:grid-cols-3 max-w-6xl mx-auto"
//           >
//             {features.map((feature, index) => (
//               <motion.div
//                 key={feature.label}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   delay: 3.2 + index * 0.2,
//                   duration: 0.6,
//                   type: "spring",
//                   stiffness: 100,
//                   damping: 10,
//                 }}
//                 className="flex flex-col items-center text-center p-8 bg-background border"
//               >
//                 <div className="mb-6 rounded-full bg-[#FF6B2C]/10 p-4">
//                   <feature.icon className="h-8 w-8 text-[#FF6B2C]" />
//                 </div>
//                 <h3 className="mb-4 text-xl font-mono font-bold">
//                   {feature.label}
//                 </h3>
//                 <p className="text-muted-foreground font-mono text-sm leading-relaxed">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </section>
        
//       </main>
//     </div>
//   );
// }
"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Coins,
  Shield,
  Menu,
  Network,
  Zap,
  Cpu,
  Database,
  LineChart,
  Lock,
  CheckCircle,
  Twitter,
  Github,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "DASHBOARD", href: "#" },
  { title: "VAULTS", href: "#" },
  { title: "STRATEGIES", href: "#" },
  { title: "GOVERNANCE", href: "#" },
];

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
];

const stats = [
  { label: "Total Value Locked", value: "$158.2M" },
  { label: "Average APY", value: "12.4%" },
  { label: "Active Users", value: "42.3K" },
  { label: "Integrated Protocols", value: "25+" },
];

const integrations = [
  "Aave",
  "Compound",
  "Curve",
  "Uniswap",
  "Balancer",
  "SushiSwap",
  "Lido",
];

const steps = [
  {
    icon: Database,
    title: "Deposit Funds",
    description: "Users deposit assets into the AI vault via secure smart contracts.",
  },
  {
    icon: Cpu,
    title: "AI Allocation",
    description: "The algorithm routes liquidity across protocols based on real-time yield data.",
  },
  {
    icon: LineChart,
    title: "Earn & Auto-Rebalance",
    description: "Your funds continuously optimize for maximum return without manual actions.",
  },
];

const audits = [
  { icon: CheckCircle, title: "Smart Contract Audited", desc: "Verified by CertiK & PeckShield" },
  { icon: Shield, title: "Insurance Coverage", desc: "Backed by Nexus Mutual" },
  { icon: Lock, title: "Non-Custodial", desc: "Users always retain asset ownership" },
];

const roadmap = [
  { q: "Q1 2025", m: "Mainnet Launch & Governance Alpha" },
  { q: "Q2 2025", m: "AI Strategy Marketplace" },
  { q: "Q3 2025", m: "Cross-Chain Yield Router" },
  { q: "Q4 2025", m: "Institutional Integrations" },
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

export function MynaHero() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) controls.start("visible");
  }, [controls, isInView]);

  const titleWords = ["THE", "ON-CHAIN", "AI", "YIELD", "AGGREGATOR"];

  return (
    <div className="container mx-auto px-4 min-h-screen bg-background mt-2 text-foreground">
      <main>
        {/* Hero Section */}
        <section className="container py-24">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                  }}
                  className="inline-block mx-2 md:mx-4"
                >
                  {text}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground font-mono"
            >
              Harness artificial intelligence to optimize DeFi yields, automate
              liquidity routing, and grow your crypto portfolio efficiently.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
              {highlights.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.8 + index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  className="flex items-center gap-2 px-6"
                >
                  <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.4,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            >
              <Button
                size="lg"
                className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
              >
                LAUNCH APP <ArrowRight className="ml-1 w-4 h-4 " />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[#FF6B2C]/5 border-y border-[#FF6B2C]/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center font-mono">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <p className="text-3xl font-bold text-[#FF6B2C]">
                  {item.value}
                </p>
                <p className="text-sm mt-2 text-muted-foreground">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-24 text-center">
          <h2 className="text-4xl font-mono font-bold mb-12">
            Integrated Protocols
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {integrations.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border border-[#FF6B2C]/30 px-6 py-3 rounded-md text-sm font-mono text-muted-foreground hover:text-[#FF6B2C]"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-[#FF6B2C]/5 border-y border-[#FF6B2C]/20 text-center">
          <h2 className="text-4xl font-mono font-bold mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-6 border border-[#FF6B2C]/20"
              >
                <step.icon className="h-8 w-8 text-[#FF6B2C] mx-auto mb-4" />
                <h3 className="text-lg font-mono font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 text-center">
          <h2 className="text-4xl font-mono font-bold mb-12">
            Security First
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {audits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-6 border border-[#FF6B2C]/20"
              >
                <item.icon className="h-8 w-8 text-[#FF6B2C] mx-auto mb-4" />
                <h3 className="font-mono font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-24 bg-[#FF6B2C]/5 border-y border-[#FF6B2C]/20 text-center">
          <h2 className="text-4xl font-mono font-bold mb-12">Roadmap</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {roadmap.map((r, i) => (
              <motion.div
                key={r.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-6 border border-[#FF6B2C]/20"
              >
                <h3 className="text-lg font-bold text-[#FF6B2C] mb-2 font-mono">
                  {r.q}
                </h3>
                <p className="text-sm text-muted-foreground">{r.m}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-mono font-bold mb-12">FAQs</h2>
          <div className="space-y-6 text-left">
            {faqs.map((f, i) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border border-[#FF6B2C]/20 p-6"
              >
                <h3 className="font-mono font-bold text-[#FF6B2C] mb-2">
                  {f.q}
                </h3>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
      </main>
    </div>
  );
}
