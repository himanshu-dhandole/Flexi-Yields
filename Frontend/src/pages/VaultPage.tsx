import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import {
  Wallet,
  ArrowDown,
  ArrowUp,
  Gift,
  Lock,
  Info,
  Eye,
  EyeOff,
  TrendingUp,
  Database,
  Cpu,
  LineChart,
} from "lucide-react";
import { useAccount } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, formatUnits } from "viem";
import { config } from "@/config/wagmiConfig";
import { motion } from "framer-motion";

import VUSDT_ABI from "../abis/vUSDT.json";
import YIELD_VAULT_ABI from "../abis/yieldVault.json";

import DefaultLayout from "@/layouts/default";
import { toast, ToastContainer } from "react-toastify";

const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;

export default function VaultPage() {
  const { address } = useAccount();
  const [vusdtBalance, setVusdtBalance] = useState<string>("0");
  const [vaultData, setVaultData] = useState<string>("0");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionType, setActionType] = useState<"deposit" | "withdraw">("deposit");
  const [apy, setApy] = useState<string | null>(null);
  const [flexCoin, setFlexCoin] = useState<string | null>(null);
  const [AmountInStrategy, setAmountInStrategy] = useState<string | null>(null);

  const loadVaultBalances = async () => {
    if (!address) return;
    try {
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

      const apyResult = await readContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "estimatedVaultAPY",
      }) as bigint;

      const flexCoinResult = await readContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "balanceOf",
        args: [address],
      }) as bigint;

      setApy(formatUnits(apyResult, 2));
      setVusdtBalance(formatUnits(balance, 18));
      setFlexCoin(Number(formatUnits(flexCoinResult, 18)).toFixed(2));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vault balances.");
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
        toast.success("10,000 vUSDT claimed successfully");
        await loadVaultBalances();
      } else {
        toast.error("Airdrop failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Airdrop failed.");
    }
  };

  const handleTransaction = async () => {
    if (!address || !amount) return;
    try {
      setLoading(true);
      const amt = parseUnits(amount, 18);

      if (actionType === "deposit") {
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
          args: [amt, address],
        });

        toast.info("Depositing... please wait");
        const receipt = await waitForTransactionReceipt(config, { hash: tx });

        if (receipt.status === "success") {
          toast.success("Deposit successful");
          setAmount("");
          onClose();
          await loadVaultBalances();
        }
      } else {
        const tx = await writeContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "withdraw",
          args: [amt, address, address],
        });

        toast.info("Withdrawing... please wait");
        const receipt = await waitForTransactionReceipt(config, { hash: tx });

        if (receipt.status === "success") {
          toast.success("Withdrawal successful");
          setAmount("");
          onClose();
          await loadVaultBalances();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(`${actionType === "deposit" ? "Deposit" : "Withdrawal"} failed.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadVaultBalances();
  }, [address]);

  const vaultBalance = parseFloat(vaultData);
  const walletBalance = parseFloat(vusdtBalance);

  const openModal = (type: "deposit" | "withdraw") => {
    setActionType(type);
    setAmount("");
    onOpen();
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen pt-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 ">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12 border-b border-[#FF6B2C]/20 pb-6"
          >
            <div>
              <h1 className="text-4xl font-mono font-bold text-foreground mb-2">AI YIELD VAULT</h1>
              <p className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                <Database size={14} className="text-[#FF6B2C]" />
                AUTOMATED LIQUIDITY OPTIMIZATION
              </p>
            </div>
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-2 border border-[#FF6B2C]/20 hover:bg-[#FF6B2C]/5 transition-colors"
            >
              {hideBalances ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-[#FF6B2C]/20 p-6 bg-[#FF6B2C]/5"
            >
              <p className="text-xs font-mono text-muted-foreground mb-2">CURRENT APY</p>
              <p className="text-3xl font-mono font-bold text-[#FF6B2C]">{apy || "0.00"}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-[#FF6B2C]/20 p-6"
            >
              <p className="text-xs font-mono text-muted-foreground mb-2">TOTAL VALUE LOCKED</p>
              <p className="text-3xl font-mono font-bold text-foreground">$2.4M</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-[#FF6B2C]/20 p-6"
            >
              <p className="text-xs font-mono text-muted-foreground mb-2">YOUR VAULT BALANCE</p>
              <p className="text-3xl font-mono font-bold text-foreground">
                {hideBalances ? "••••••" : vaultBalance.toFixed(2)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-[#FF6B2C]/20 p-6"
            >
              <p className="text-xs font-mono text-muted-foreground mb-2">$FLEX EARNED</p>
              <p className="text-3xl font-mono font-bold text-[#FF6B2C]">{flexCoin || "0.00"}</p>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Main Vault Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-2 border border-[#FF6B2C]/20 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <Lock size={20} className="text-[#FF6B2C]" />
                <span className="text-lg font-mono font-bold text-foreground">VAULT OPERATIONS</span>
              </div>

              <div className="mb-8">
                <p className="text-xs font-mono text-muted-foreground mb-2">DEPOSITED AMOUNT</p>
                <p className="text-5xl font-mono font-bold text-foreground mb-2">
                  {hideBalances ? "••••••" : vaultBalance.toFixed(2)}
                </p>
                <p className="text-sm font-mono text-muted-foreground">vUSDT</p>
              </div>

              <div className="border-t border-[#FF6B2C]/20 pt-6 mb-8">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">PROTOCOL</p>
                    <p className="text-sm font-mono text-foreground">ERC-4626</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">STRATEGY</p>
                    <p className="text-sm font-mono text-foreground">AI-OPTIMIZED</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">STATUS</p>
                    <p className="text-sm font-mono text-[#FF6B2C]">ACTIVE</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => openModal("deposit")}
                  className="flex-1 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono py-4 border-none transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowDown size={18} />
                  DEPOSIT
                </button>
                <button
                  onClick={() => openModal("withdraw")}
                  className="flex-1 border border-[#FF6B2C]/20 hover:bg-[#FF6B2C]/5 text-foreground font-mono py-4 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowUp size={18} />
                  WITHDRAW
                </button>
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Wallet Balance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="border border-[#FF6B2C]/20 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Wallet size={16} className="text-[#FF6B2C]" />
                  <span className="text-xs font-mono text-muted-foreground">WALLET BALANCE</span>
                </div>
                <p className="text-3xl font-mono font-bold text-foreground mb-1">
                  {hideBalances ? "••••••" : walletBalance.toFixed(2)}
                </p>
                <p className="text-xs font-mono text-muted-foreground">vUSDT AVAILABLE</p>
              </motion.div>

              {/* Airdrop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="border border-[#FF6B2C]/20 p-6 bg-[#FF6B2C]/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Gift size={16} className="text-[#FF6B2C]" />
                  <span className="text-xs font-mono font-bold text-foreground">CLAIM AIRDROP</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-4">
                  RECEIVE <span className="text-[#FF6B2C] font-bold">10,000 vUSDT</span> TO START
                </p>
                <button
                  onClick={handleAirdrop}
                  className="w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono py-3 border-none transition-colors"
                >
                  CLAIM TOKENS
                </button>
              </motion.div>

            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-[#FF6B2C]/20 p-6 hover:bg-[#FF6B2C]/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Cpu size={20} className="text-[#FF6B2C] mt-1" />
                <div>
                  <p className="text-sm font-mono font-bold text-foreground mb-1">AUTO-COMPOUNDING</p>
                  <p className="text-xs font-mono text-muted-foreground">YIELDS REINVESTED AUTOMATICALLY</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-[#FF6B2C]/20 p-6 hover:bg-[#FF6B2C]/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <LineChart size={20} className="text-[#FF6B2C] mt-1" />
                <div>
                  <p className="text-sm font-mono font-bold text-foreground mb-1">NO LOCK PERIOD</p>
                  <p className="text-xs font-mono text-muted-foreground">WITHDRAW ANYTIME WITHOUT FEES</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-[#FF6B2C]/20 p-6 hover:bg-[#FF6B2C]/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Lock size={20} className="text-[#FF6B2C] mt-1" />
                <div>
                  <p className="text-sm font-mono font-bold text-foreground mb-1">AUDITED CONTRACTS</p>
                  <p className="text-xs font-mono text-muted-foreground">VERIFIED AND BATTLE-TESTED</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transaction Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size="md"
          classNames={{
            base: "border border-[#FF6B2C]/20 rounded-none",
            header: "border-b border-[#FF6B2C]/20",
            footer: "border-t border-[#FF6B2C]/20"
          }}
        >
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center gap-3">
                {actionType === "deposit" ? 
                  <ArrowDown size={18} className="text-[#FF6B2C]" /> : 
                  <ArrowUp size={18} className="text-[#FF6B2C]" />
                }
                <span className="font-mono font-bold text-foreground">
                  {actionType === "deposit" ? "DEPOSIT TO VAULT" : "WITHDRAW FROM VAULT"}
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-mono text-muted-foreground">AMOUNT</label>
                    <button 
                      onClick={() => setAmount(actionType === "deposit" ? vusdtBalance : vaultData)}
                      className="text-xs font-mono text-[#FF6B2C] hover:text-[#FF6B2C]/80"
                    >
                      MAX: {(actionType === "deposit" ? walletBalance : vaultBalance).toFixed(2)}
                    </button>
                  </div>
                  <div className="border border-[#FF6B2C]/20 p-4 flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-2xl font-mono"
                    />
                    <span className="text-sm font-mono text-muted-foreground">vUSDT</span>
                  </div>
                </div>

                {amount && parseFloat(amount) > 0 && (
                  <div className="border border-[#FF6B2C]/20 p-4 bg-[#FF6B2C]/5">
                    <p className="text-xs font-mono text-muted-foreground">
                      NEW VAULT BALANCE: <span className="text-foreground font-bold">{actionType === "deposit" 
                        ? (vaultBalance + parseFloat(amount)).toFixed(2)
                        : (vaultBalance - parseFloat(amount)).toFixed(2)
                      } vUSDT</span>
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <button 
                onClick={onClose}
                className="px-6 py-2 border border-[#FF6B2C]/20 hover:bg-[#FF6B2C]/5 font-mono text-sm transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleTransaction}
                disabled={!amount || parseFloat(amount) <= 0 || loading}
                className="px-6 py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : `CONFIRM ${actionType === "deposit" ? "DEPOSIT" : "WITHDRAWAL"}`}
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          theme="dark"
        />
      </div>
    </DefaultLayout>
  );
}