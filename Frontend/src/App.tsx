import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import AdminPage from "@/pages/AdminPage";
import PoolsPage from "@/pages/pools";
import VaultPage from "@/pages/VaultPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmiConfig";
import Error404 from "./pages/error";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { GithubIcon, TwitterIcon } from "./components/icons";
import { InstagramIcon } from "lucide-react";
import ContactPage from "./pages/contact";

const queryClient = new QueryClient();
const socialLinksData = [
  { label: "Github", href: "#", icon: <GithubIcon /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon /> },
  { label: "Twitter (X)", href: "#", icon: <TwitterIcon /> },
];

const handleNewsletterSubscribe = async (email: string): Promise<boolean> => {
  console.log(`Subscribing ${email}...`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Simulate a 70% success rate
  if (Math.random() > 0.3) {
    console.log(`Successfully subscribed ${email}!`);
    return true;
  } else {
    console.error(`Failed to subscribe ${email}.`);
    return false;
  }
};


function App() {
  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <Navbar/>
          <Routes>
            <Route element={<IndexPage />} path="/" />
            <Route element={<DocsPage />} path="/docs" />
            <Route element={<AdminPage />} path="/admin" />
            <Route element={<PoolsPage />} path="/pools" />
            <Route element={<VaultPage />} path="/vault" />
            <Route element={<Error404/>} path="*" />
            <Route element={<ContactPage/>} path="/contact" />
          </Routes>
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}

export default App;
