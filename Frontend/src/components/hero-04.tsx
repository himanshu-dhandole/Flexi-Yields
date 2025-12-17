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

        <div className="md:flex mt-20 items-end justify-between">
          <div className="relative">
            <div className="w-60 h-36 shadow-lg border border-border rounded-md overflow-hidden mb-8 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1642525166481-3f4f4e1b5f6d?w=400&h=300&fit=crop"
                alt="Protocol Dashboard"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="w-60 h-36 absolute left-6 -top-6 shadow-lg border border-border rounded-md overflow-hidden mb-8 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop"
                alt="Smart Contract Architecture"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="w-60 h-36 absolute left-12 -top-12 shadow-lg border border-border rounded-md overflow-hidden mb-8 md:mb-0">
              <img
                src="src/lib/chart2.png"
                alt="Liquidity Optimization"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center md:justify-end gap-2">
              <span className="text-lg font-medium tracking-wider text-foreground/80">
                KEY FEATURES
              </span>
              <ArrowDownRight className="size-6" />
            </div>

            <div className="mt-3 md:text-right">
              <h2 className="text-5xl uppercase tracking-[-4px] text-foreground">
                Autonomous DeFi
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-2 gap-8">
          <div className="border border-border p-8 bg-muted/50">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Technical Architecture
            </h3>
            <ul className="space-y-3 text-foreground/70">
              <li>● Modular ERC-4626 vault architecture on Polygon</li>
              <li>● Automated strategies with seamless protocol integration</li>
              <li>● EIP-712 cryptographic verification system</li>
              <li>● Gas-optimized multi-pool liquidity migrations</li>
            </ul>
          </div>
          <div className="border border-border p-8 bg-muted/50">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              ML-Driven Intelligence
            </h3>
            <ul className="space-y-3 text-foreground/70">
              <li>● Real-time APY prediction algorithms</li>
              <li>● Risk-adjusted portfolio optimization</li>
              <li>● Chainlink price feeds integration</li>
              <li>● Authenticated, tamper-proof AI recommendations</li>
            </ul>
          </div>
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
      <CTA/>
    </section>
    
  );
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
function CTA() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
          <div>
            <Badge>Get started</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
              Try our platform today!
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our goal
              is to streamline SMB trade, making it easier and faster than ever.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-4" variant="outline">
              Jump on a call <PhoneCall className="w-4 h-4" />
            </Button>
            <Button className="gap-4">
              Sign up here <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}