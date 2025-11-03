import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
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

export default function VaultPage() {
  const { address } = useAccount();
  const [vusdtBalance, setVusdtBalance] = useState<string>("0");
  const [vaultData, setVaultData] = useState<string>("0");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionType, setActionType] = useState<"deposit" | "withdraw">("deposit");
    const [apy , setApy] = useState<string | null>(null);
    const [flexCoin , setFlexCoin] = useState<string | null>(null);
    const [AmountInStrategy , setAmountInStrategy] = useState<string | null>(null);

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-1">Yield Vault</h1>
              <p className="text-sm text-foreground-400 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-500" />
                Deposit and earn passive yield
              </p>
            </div>
            <Button
              size="sm"
              variant="light"
              onPress={() => setHideBalances(!hideBalances)}
              isIconOnly
            >
              {hideBalances ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            
            {/* Vault Balance */}
            <Card className="md:col-span-2 border border-divider bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10">
                    <Lock size={16} className="text-indigo-500" />
                  </div>
                  <span className="text-sm font-medium text-foreground-500">Vault Balance</span>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="mb-6">
                  <p className="text-4xl font-semibold text-foreground mb-1">
                    {hideBalances ? "••••••" : `${vaultBalance.toFixed(2)}`}
                  </p>
                  <p className="text-sm text-foreground-400">vUSDT</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-divider">
                  <div>
                    <p className="text-xs text-foreground-400 mb-1">APY</p>
                    <p className="text-lg font-medium text-emerald-500">{apy || 0.00}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-400 mb-1">
                      <span className="text-yellow-400 font-medium">$FLEX</span>
                    </p>
                    <p className="text-lg font-medium text-foreground">{flexCoin || 0.00}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-400 mb-1">TVL</p>
                    <p className="text-lg font-medium text-foreground">$2.4M</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onPress={() => openModal("deposit")}
                    className="flex-1 bg-indigo-500 text-white font-medium hover:bg-indigo-600"
                    startContent={<ArrowDown size={18} />}
                  >
                    Deposit
                  </Button>
                  <Button
                    onPress={() => openModal("withdraw")}
                    variant="bordered"
                    className="flex-1 border-divider font-medium hover:bg-default-100"
                    startContent={<ArrowUp size={18} />}
                  >
                    Withdraw
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Sidebar */}
            <div className="space-y-5">
              
              {/* Wallet Balance */}
              <Card className="border border-divider bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                      <Wallet size={14} className="text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-foreground-500">Wallet</span>
                  </div>
                </CardHeader>
                <CardBody className="pt-2">
                  <p className="text-2xl font-semibold text-foreground mb-0.5">
                    {hideBalances ? "••••••" : walletBalance.toFixed(2)}
                  </p>
                  <p className="text-xs text-foreground-400">vUSDT available</p>
                </CardBody>
              </Card>

              {/* Airdrop */}
              <Card className="border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                <CardBody>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-amber-500/10">
                      <Gift size={16} className="text-amber-500" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Claim Airdrop</span>
                  </div>
                  <p className="text-xs text-foreground-400 mb-4">
                    Get <span className="text-amber-500 font-medium">10,000 vUSDT</span> tokens to start earning
                  </p>
                  <Button
                    onPress={handleAirdrop}
                    className="w-full bg-amber-500 text-white font-medium hover:bg-amber-600"
                    size="sm"
                  >
                    Claim Tokens
                  </Button>
                </CardBody>
              </Card>

            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-divider hover:border-indigo-500/30 transition-colors">
              <CardBody className="py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 mt-0.5">
                    <TrendingUp size={16} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Auto-Compounding</p>
                    <p className="text-xs text-foreground-400">Yields reinvested automatically</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-divider hover:border-blue-500/30 transition-colors">
              <CardBody className="py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 mt-0.5">
                    <Lock size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">No Lock Period</p>
                    <p className="text-xs text-foreground-400">Withdraw anytime without fees</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-divider hover:border-emerald-500/30 transition-colors">
              <CardBody className="py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 mt-0.5">
                    <Info size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Audited Contracts</p>
                    <p className="text-xs text-foreground-400">Verified and battle-tested</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Transaction Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size="md"
          classNames={{
            base: "border border-divider",
            header: "border-b border-divider",
            footer: "border-t border-divider"
          }}
        >
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${actionType === "deposit" ? "bg-indigo-500/10" : "bg-orange-500/10"}`}>
                  {actionType === "deposit" ? 
                    <ArrowDown size={16} className="text-indigo-500" /> : 
                    <ArrowUp size={16} className="text-orange-500" />
                  }
                </div>
                <span className="font-medium">
                  {actionType === "deposit" ? "Deposit to Vault" : "Withdraw from Vault"}
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-foreground-500">Amount</label>
                    <button 
                      onClick={() => setAmount(actionType === "deposit" ? vusdtBalance : vaultData)}
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                    >
                      Max: {(actionType === "deposit" ? walletBalance : vaultBalance).toFixed(2)}
                    </button>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    size="lg"
                    classNames={{
                      inputWrapper: "border-divider"
                    }}
                    endContent={<span className="text-sm text-foreground-400">vUSDT</span>}
                  />
                </div>

                {amount && parseFloat(amount) > 0 && (
                  <div className={`p-3 rounded-lg border ${actionType === "deposit" ? "bg-indigo-500/5 border-indigo-500/20" : "bg-orange-500/5 border-orange-500/20"}`}>
                    <p className="text-xs text-foreground-500">
                      New vault balance: <span className="font-medium">{actionType === "deposit" 
                        ? (vaultBalance + parseFloat(amount)).toFixed(2)
                        : (vaultBalance - parseFloat(amount)).toFixed(2)
                      } vUSDT</span>
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} size="sm">
                Cancel
              </Button>
              <Button
                onPress={handleTransaction}
                isLoading={loading}
                isDisabled={!amount || parseFloat(amount) <= 0}
                className={`font-medium ${actionType === "deposit" ? "bg-indigo-500 hover:bg-indigo-600" : "bg-orange-500 hover:bg-orange-600"} text-white`}
                size="sm"
              >
                {loading ? "Processing..." : `Confirm ${actionType === "deposit" ? "Deposit" : "Withdrawal"}`}
              </Button>
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
