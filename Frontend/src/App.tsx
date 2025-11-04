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

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<IndexPage />} path="/" />
            <Route element={<DocsPage />} path="/docs" />
            <Route element={<AdminPage />} path="/admin" />
            <Route element={<PoolsPage />} path="/pools" />
            <Route element={<VaultPage />} path="/vault" />
            <Route element={<Error404/>} path="*" />
          </Routes>
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}

export default App;
