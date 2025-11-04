"use client";

import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { InfinityIcon, Menu, Moon, Sun } from "lucide-react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/config/thirdwebConfig";
import { ConnectButton } from "thirdweb/react";
import { Link } from "react-router-dom";
import { useTheme } from "@heroui/use-theme";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export const Navbar = () => {
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
  ];

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const navigationItems = [
    { title: "HOME", href: "/" },
    { title: "VAULT", href: "/vault" },
    { title: "POOLS", href: "/pools" },
    { title: "ADMIN", href: "/admin" },
    { title: "CONTACT", href: "/contact" },
  ];

  return (
    <HeroUINavbar maxWidth="xl" className="border-default-200">
      <NavbarBrand className="flex items-center gap-2">
        <Link to={"/"}>
          <InfinityIcon className="h-8 w-8 text-[#FF6B2C]" />
        </Link>
        <Link to={"/"}>
          <span className="font-mono text-xl font-bold">FLEXI YIELD</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex" justify="center">
        {navigationItems.map((item) => (
          <NavbarItem key={item.title}>
            <Link
              to={item.href}
              className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors"
            >
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="items-center space-x-4">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="hover:bg-[#FF6B2C]/10"
        >
          {isDark ? (
            // Sun for light mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#FF6B2C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M16.95 16.95l1.42 1.42M1 12h2M19 12h2M4.22 19.78l1.42-1.42M16.95 7.05l1.42-1.42" />
              <circle cx="12" cy="12" r="5" />
            </svg>
          ) : (
            // Moon for dark mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#FF6B2C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M20.354 15.354a9 9 0 11-11.708-11.708 7 7 0 0011.708 11.708z" />
            </svg>
          )}
        </Button>

        <ConnectButton
          client={client}
          wallets={wallets}
          theme={isDark ? "dark" : "light"}
          connectButton={{
            label: "Connect Wallet",
            style: {
              all: "unset",
              cursor: "pointer",
              backgroundColor: "#FF6B2C",
              color: "white",
              padding: "8px 14px",
              borderRadius: "0",
              fontFamily: "monospace",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            },
          }}
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent>
            <nav className="flex flex-col gap-6 mt-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors"
                >
                  {item.title}
                </Link>
              ))}

              <div className="mt-4 flex flex-col gap-4">
                {/* Use the same theme toggle in mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="hover:bg-[#FF6B2C]/10 transition-colors duration-300"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                      <motion.span
                        key="sun"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Sun className="h-5 w-5 text-[#FF6B2C]" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="moon"
                        initial={{ rotate: 90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Moon className="h-5 w-5 text-[#FF6B2C]" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>

                <ConnectButton
                  client={client}
                  wallets={wallets}
                  theme={isDark ? "dark" : "light"}
                  connectButton={{
                    label: "Connect",
                    style: {
                      all: "unset",
                      cursor: "pointer",
                      backgroundColor: "#FF6B2C",
                      color: "white",
                      padding: "8px 14px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      borderRadius: "0",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    },
                  }}
                />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </NavbarContent>
    </HeroUINavbar>
  );
};