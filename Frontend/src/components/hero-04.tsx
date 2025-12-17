import { ArrowDownRight } from "lucide-react";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export function HeroSection04() {
  return (
    <section className="min-h-screen overflow-hidden relative py-20 bg-background">
      <div className="mx-auto max-w-7xl relative z-20 px-6">
        <div className="relative">
          <p className="text-sm absolute -top-4 left-20 font-medium tracking-wider text-foreground/70">
            {/* <span className="text-orange-500 font-bold">FIRST</span>{" "}
            <span className="text-white font-bold">IN</span>{" "}
            <span className="text-green-500 font-bold">INDIA</span> */}
          </p>
          <h1 className="z-20 text-foreground relative font-bold text-center tracking-[-7px] text-7xl md:text-9xl xl:tracking-[-1rem] md:tracking-[-14px] xl:text-[10rem]">
            FLEXI-YIELD
          </h1>
          <p className="text-4xl hidden xl:block absolute -bottom-12 right-24 font-thin tracking-[6px] text-foreground/60">
            LIVE PROTOCOL
          </p>
          <p className="text-4xl absolute xl:hidden -bottom-12 left-24 font-thin tracking-[6px] text-foreground/60">
            LIVE PROTOCOL
          </p>
        </div>

        <div className="grid relative">
          <div className="space-y-8 pt-20 flex gap-6 justify-center">
            <div className="flex gap-6 bg-muted w-full max-w-xl h-fit p-10 items-end space-y-2 text-xl font-bold md:text-2xl lg:text-3xl border border-orange-500/70 ">
              <div className="font-semibold text-xl text-foreground">
                <div>AI-POWERED OPTIMIZATION</div>
                <div>AUTOMATED REBALANCING</div>
                <div>ON-CHAIN VERIFICATION</div>
              </div>
              <div className="absolute hidden md:flex left-1/2 -top-10 w-fit overflow-hidden bg-muted ">
                <img
                  src="src/lib/chart.png"
                  alt="DeFi Protocol Visualization"
                  className="h-100 w-full object-contain grayscale opacity-80"
                />
                <div className="text-left p-2 rotate-180 [writing-mode:vertical-rl] text-xs font-medium tracking-widest text-foreground/70">
                  POLYGON NETWORK POWERED
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:hidden left-1/2 -top-10 w-full md:w-fit overflow-hidden bg-muted border border-border">
            <img
              src="src/lib/chart.png"
              alt="DeFi Protocol Visualization"
              className="h-100 w-full object-contain grayscale opacity-80"
            />
            <div className="text-left p-2 rotate-180 [writing-mode:vertical-rl] text-xs font-medium tracking-widest text-foreground/70">
              POLYGON NETWORK POWERED
            </div>
          </div>
        </div>

        <div className="md:mt-40 mt-10">
          <p className="mx-auto max-w-2xl font-mono text-center text-sm font-medium tracking-wide md:text-base text-foreground/80">
            AI-POWERED YIELD OPTIMIZATION PROTOCOL
            <br />
            AUTONOMOUSLY REALLOCATING LIQUIDITY ACROSS DEFI POOLS
            <br />
            WITH ON-CHAIN VERIFIABILITY AND ML-DRIVEN STRATEGIES
          </p>
        </div>
        <div className="flex justify-center pt-6">
          <button className="px-8 py-3 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors">
            View Protocol
          </button>
        </div>
      </div>

      <div
        className="absolute block dark:hidden inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, #e5e5e5 1px, transparent 1px),
        linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div
        className="absolute hidden dark:block inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, #404040 1px, transparent 1px),
        linear-gradient(to bottom, #404040 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </section>
    
  );
}
