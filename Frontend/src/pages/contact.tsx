"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultLayout from "@/layouts/default";
import { Label } from "@radix-ui/react-label";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <DefaultLayout>
      <main className="relative flex min-h-screen w-full items-center justify-center bg-background text-foreground -mt-16 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          {/* HEADER */}
          <div className="text-center mb-12 font-mono">
            <Mail className="w-10 h-10 text-[#FF6B2C] mx-auto mb-4" />
            <h1 className="text-4xl font-bold">GET IN TOUCH</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Have questions about our Web3 project? Fill out the form below.
            </p>
          </div>

          {/* CARD */}
          <div className="grid md:grid-cols-3 gap-6 border border-[#FF6B2C]/30 rounded-xl bg-background/70 backdrop-blur-md p-8 shadow-md">
            {/* LEFT INFO */}
            <div className="flex flex-col justify-between font-mono border-r border-[#FF6B2C]/20 pr-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Mail className="text-[#FF6B2C] w-5 h-5" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">dhandolehimanshu@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-[#FF6B2C] w-5 h-5" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Phone
                    </p>
                    <p className="text-sm">+91 92849 61467</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-[#FF6B2C] w-5 h-5" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Address
                    </p>
                    <p className="text-sm">Nagpur -&gt; Maharastra , India</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-8">
                We aim to respond within <span className="text-[#FF6B2C]">24 hours</span>.
              </p>
            </div>

            {/* FORM */}
            <div className="md:col-span-2 font-mono">
              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Your Name"
                      className="bg-transparent border border-[#FF6B2C]/30 focus:border-[#FF6B2C] text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-transparent border border-[#FF6B2C]/30 focus:border-[#FF6B2C] text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input
                    type="text"
                    placeholder="+91 98765 43210"
                    className="bg-transparent border border-[#FF6B2C]/30 focus:border-[#FF6B2C] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Write your message..."
                    className="bg-transparent border border-[#FF6B2C]/30 focus:border-[#FF6B2C] text-sm h-28 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FF6B2C] text-black hover:bg-[#ff864e] transition font-mono"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <p className="text-center text-muted-foreground text-sm font-mono mt-10">
            Built by <span className="text-[#FF6B2C]">Himanshu Dhandole</span> 
            :)
          </p>
        </motion.div>
      </main>
    </DefaultLayout>
  );
}
