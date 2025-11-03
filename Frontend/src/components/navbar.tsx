"use client";

import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { InfinityIcon, Menu } from "lucide-react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/config/thirdwebConfig";
import { ConnectButton } from "thirdweb/react";
import { Link } from "react-router-dom";
import { ThemeSwitch } from "@/components/theme-switch";
import { useEffect, useState } from "react";

// custom theme hook
function useTheme() {
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return { theme, isDark: theme === "dark" };
}

export const Navbar = () => {
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];

  const { theme } = useTheme(); // custom hook here

  const navigationItems = [
    { title: "HOME", href: "/" },
    { title: "VAULT", href: "/vault" },
    { title: "POOLS", href: "/pools" },
    { title: "ADMIN", href: "/docs" },
    { title: "CONTACT", href: "/contact" },
  ];

  return (
    <HeroUINavbar maxWidth="xl" className=" border-default-200">
      <NavbarBrand className="flex items-center gap-2">
        <Link to={"/"}>
        <InfinityIcon className="h-8 w-8 text-[#FF6B2C]" /></Link>
        <Link to={"/"}><span className="font-mono text-xl font-bold">FLEXI YIELD</span></Link>
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
        <ThemeSwitch />

        <ConnectButton
          client={client}
          wallets={wallets}
          theme={theme === "dark" ? "dark" : "light"}
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
                <ThemeSwitch />
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  theme={theme === "dark" ? "dark" : "light"}
                  connectButton={{
                    label: "Connect Wallet",
                    style: {
                      all: "unset",
                      cursor: "pointer",
                      backgroundColor: "#FF6B2C",
                      color: "white",
                      padding: "10px",
                      borderRadius: "0",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      textAlign: "center",
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
