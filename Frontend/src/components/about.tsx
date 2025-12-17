"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Pen,
  PaintBucket,
  Home,
  Ruler,
  PenTool,
  Building2,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion"

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const services = [
    {
      icon: <Pen className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Interior",
      description:
        "Transform your living spaces with our expert interior design services.",
      position: "left",
    },
    {
      icon: <Home className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Exterior",
      description:
        "Make a lasting impression with stunning exterior designs.",
      position: "left",
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Design",
      description:
        "Innovative design that blends creativity with practicality.",
      position: "left",
    },
    {
      icon: <PaintBucket className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Decoration",
      description:
        "Curated decoration services to perfect every detail.",
      position: "right",
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Planning",
      description:
        "Precise planning from concept to completion.",
      position: "right",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Execution",
      description:
        "Flawless execution with attention to every detail.",
      position: "right",
    },
  ]

  const stats = [
    { icon: <Award />, value: 150, label: "Projects", suffix: "+" },
    { icon: <Users />, value: 1200, label: "Clients", suffix: "+" },
    { icon: <Calendar />, value: 12, label: "Years", suffix: "" },
    { icon: <TrendingUp />, value: 98, label: "Satisfaction", suffix: "%" },
  ]

  return (
    <section
      ref={sectionRef}
      className="
        relative overflow-hidden py-24 px-4
        bg-gradient-to-b
        from-[#F2F2EB] to-[#F8F8F2]
        text-[#202e44]
        dark:from-black dark:to-[#0a0a0a]
        dark:text-gray-200
      "
    >
      {/* Blobs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#88734C]/5 dark:bg-[#88734C]/10 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#A9BBC8]/5 dark:bg-[#A9BBC8]/10 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <span className="flex justify-center items-center gap-2 text-[#88734C] mb-2">
            <Zap className="w-4 h-4" />
            DISCOVER OUR STORY
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100">
            About Us
          </h2>
          <div className="w-24 h-1 bg-[#88734C] mx-auto mt-4" />
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-16">
            {services
              .filter((s) => s.position === "left")
              .map((s, i) => (
                <ServiceItem key={i} {...s} variants={itemVariants} delay={i * 0.2} direction="left" />
              ))}
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <div className="relative max-w-xs">
              <img
                src="https://images.unsplash.com/photo-1747582411588-f9b4acabe995"
                className="rounded-md shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-md" />
            </div>
          </div>

          <div className="space-y-16">
            {services
              .filter((s) => s.position === "right")
              .map((s, i) => (
                <ServiceItem key={i} {...s} variants={itemVariants} delay={i * 0.2} direction="right" />
              ))}
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((s, i) => (
            <StatCounter key={i} {...s} delay={i * 0.1} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-black text-white p-8 rounded-xl border border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-2xl mb-1">Ready to transform your space?</h3>
            <p className="text-white/70">Let’s build something timeless.</p>
          </div>
          <button className="bg-[#88734C] px-6 py-3 rounded-lg flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </section>
  )
}

/* ---------- Components ---------- */

function ServiceItem({ icon, secondaryIcon, title, description, variants, delay, direction }: any) {
  return (
    <motion.div variants={variants} transition={{ delay }} className="group">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative p-3 rounded-lg bg-[#88734C]/10 text-[#88734C]">
          {icon}
          {secondaryIcon}
        </div>
        <h3 className="text-xl font-medium group-hover:text-[#88734C]">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 pl-12">
        {description}
      </p>
    </motion.div>
  )
}

function StatCounter({ icon, value, label, suffix, delay }: any) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const spring = useSpring(0, { stiffness: 50, damping: 12 })

  useEffect(() => {
    if (inView) spring.set(value)
    else spring.set(0)
  }, [inView, value, spring])

  const display = useTransform(spring, (v) => Math.floor(v))

  return (
    <div className="bg-white/5 p-6 rounded-xl text-center border border-white/10">
      <div className="text-[#88734C] mb-3 flex justify-center">{icon}</div>
      <div ref={ref} className="text-3xl font-bold">
        <motion.span>{display}</motion.span>
        {suffix}
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}
