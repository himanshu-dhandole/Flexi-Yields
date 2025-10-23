// components/WalletConnectButton.tsx
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/config/wagmiConfig";

// Define wallets you want to support
const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export function WalletConnectButton() {
  return (
    <div className="flex flex-col gap-4 items-center">
     <ConnectButton
  client={client}
  wallets={wallets}
  theme="dark"
  connectButton={{
    label: "Connect",
    style: {
      backgroundColor: "#141414",
      borderRadius: "12px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      color: "#fff",
      padding: "12px 28px",
    },
  }}
  connectModal={{
    title: "Select a Wallet",
    showThirdwebBranding: false,
    termsOfServiceUrl: "/terms",
    privacyPolicyUrl: "/privacy",
  }}
/>

    </div>
  );
}