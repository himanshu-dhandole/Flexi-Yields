import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Gift,
  Lock,
  Coins,
  Shield,
} from "lucide-react";
import { useAccount } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, formatUnits } from "viem";
import { config } from "@/config/wagmiConfig";

import VUSDT_ABI from "../abis/vUSDT.json";
import YIELD_VAULT_ABI from "../abis/yieldVault.json";

import DefaultLayout from "@/layouts/default";
import { toast, ToastContainer } from "react-toastify";

  const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
  const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;

interface VaultData {
  locked: string;
  available: string;
}

export default function VaultPage() {
  const { address } = useAccount();
  const [vusdtBalance, setVusdtBalance] = useState<string>("0");
  const [vaultData, setVaultData] = useState<string>("0");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);

  const loadVaultBalances = async () => {
    if (!address) return;
    try {
      setLoading(true);

      const vaultResult = await readContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "balanceOf",
        args: [address],
      }) as bigint;

      setVaultData(formatUnits(vaultResult, 18));

      const balance = await readContract(config, {
        address: VUSDT_ADDRESS,
        abi: VUSDT_ABI,
        functionName: "balanceOf",
        args: [address],
      }) as bigint;

      setVusdtBalance(formatUnits(balance, 18));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vault balances.");
    } finally {
      setLoading(false);
    }
  };

  const handleAirdrop = async () => {
    if (!address) return;
    try {
      const hasClaimed = await readContract(config, {
        address: VUSDT_ADDRESS,
        abi: VUSDT_ABI,
        functionName: "hasClaimed",
        args: [address],
      }) as boolean;

      if (hasClaimed) {
        toast.error("You already claimed your airdrop.");
        return;
      }

      const tx = await writeContract(config, {
        address: VUSDT_ADDRESS,
        abi: VUSDT_ABI,
        functionName: "airdrop",
        args: [],
      });

      toast.info("Transaction sent. Waiting for confirmation...");

      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        toast.success("Airdrop successful!");
        await loadVaultBalances();
      } else {
        toast.error("Airdrop failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Airdrop failed.");
    }
  };

  const handleDeposit = async () => {
    if (!address || !depositAmount) return;
    try {
      setLoading(true);
      const amt = parseUnits(depositAmount, 18);

      const allowance = await readContract(config, {
        address: VUSDT_ADDRESS,
        abi: VUSDT_ABI,
        functionName: "allowance",
        args: [address, YIELD_VAULT_ADDRESS],
      }) as bigint;

      if (allowance < amt) {
        const approveTx = await writeContract(config, {
          address: VUSDT_ADDRESS,
          abi: VUSDT_ABI,
          functionName: "approve",
          args: [YIELD_VAULT_ADDRESS, amt],
        });

        toast.info("Approving spend...");

        await waitForTransactionReceipt(config, { hash: approveTx });
      }

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "deposit",
        args: [amt , address],
      });

      toast.info("Depositing... please wait");

      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        toast.success("Deposit successful!");
        setDepositAmount("");
        await loadVaultBalances();
      } else {
        toast.error("Deposit failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Deposit failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!address || !withdrawAmount) return;
    try {
      setLoadingWithdraw(true);
      const amt = parseUnits(withdrawAmount, 18);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "withdraw",
        args: [amt , address , address],
      });

      toast.info("Withdrawing... please wait");

      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        toast.success("Withdrawal successful!");
        setWithdrawAmount("");
        await loadVaultBalances();
      } else {
        toast.error("Withdrawal failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Withdrawal failed.");
    } finally {
      setLoadingWithdraw(false);
    }
  };

  useEffect(() => {
    if (address) loadVaultBalances();
  }, [address]);


  return (
     <DefaultLayout>
      <div className="min-h-screen pt-26 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Hero Balance Section */}
          <div className="relative mb-8 overflow-hidden rounded-3xl bg-default-100 border border-divider">
            <div className="relative p-8">
              <div className="flex items-center gap-2 mb-6 text-foreground-600">
                <Wallet size={20} />
                <span className="text-sm font-medium uppercase tracking-wider">Total Vault Balance</span>
              </div>
              <div className="text-6xl font-bold text-foreground mb-2">
                ${parseFloat(vaultData).toFixed(2)}
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-violet-500" />
                  <span className="text-foreground-600">${parseFloat(vaultData).toFixed(2)} locked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins size={14} className="text-success-500" />
                  <span className="text-foreground-600">${parseFloat(vaultData).toFixed(2)} available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            
            {/* Wallet Balance Card */}
            <Card className="bg-content1 border-divider">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-violet-500/20">
                    <Wallet size={18} className="text-violet-500" />
                  </div>
                  <span className="text-sm text-foreground-500 uppercase tracking-wide">Wallet</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {parseFloat(vusdtBalance).toLocaleString()}
                </div>
                <div className="text-sm text-foreground-500 mt-1">vUSDT</div>
              </CardBody>
            </Card>

            {/* Airdrop Card */}
            <Card className="bg-content1 border-divider lg:col-span-2">
              <CardBody className="p-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-success-500/20">
                    <Gift size={22} className="text-success-500" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">Claim Your Airdrop</div>
                    <div className="text-sm text-foreground-500">Get 10,000 vUSDT instantly</div>
                  </div>
                </div>
                <Button
                  onPress={handleAirdrop}
                  className="bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold"
                  size="lg"
                >
                  Claim Now
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Deposit */}
            <Card className="bg-content1 border-divider">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-success-500/20">
                    <ArrowUpCircle size={16} className="text-success-500" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Deposit</h3>
                </div>
              </CardHeader>
              <Divider className="bg-divider" />
              <CardBody className="pt-6 space-y-4">
                <div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    classNames={{
                      input: "text-2xl font-semibold",
                      inputWrapper: "bg-default-100 border-divider h-16"
                    }}
                    endContent={
                      <span className="text-foreground-500 text-sm font-medium">vUSDT</span>
                    }
                  />
                </div>
                <Button
                  onPress={handleDeposit}
                  className="w-full bg-success-500 hover:bg-success-600 text-white font-semibold h-12"
                  isLoading={loading}
                  isDisabled={!depositAmount || parseFloat(depositAmount) <= 0}
                >
                  Deposit to Vault
                </Button>
              </CardBody>
            </Card>

            {/* Withdraw */}
            <Card className="bg-content1 border-divider">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-danger-500/20">
                    <ArrowDownCircle size={16} className="text-danger-500" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Withdraw</h3>
                </div>
              </CardHeader>
              <Divider className="bg-divider" />
              <CardBody className="pt-6 space-y-4">
                <div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    classNames={{
                      input: "text-2xl font-semibold",
                      inputWrapper: "bg-default-100 border-divider h-16"
                    }}
                    endContent={
                      <span className="text-foreground-500 text-sm font-medium">vUSDT</span>
                    }
                  />
                </div>
                <Button
                  onPress={handleWithdraw}
                  className="w-full bg-danger-500/10 hover:bg-danger-500/20 text-danger-500 font-semibold h-12 border border-danger-500/30"
                  isLoading={loadingWithdraw}
                  isDisabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                >
                  Withdraw from Vault
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 rounded-xl bg-amber-600/10 border border-amber-600/20">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-200/80">
                Always verify transaction details before confirming. Your funds are secured by smart contracts.
              </p>
            </div>
          </div>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="dark"
        />
      </div>
    </DefaultLayout>
  );
}