// import { useEffect, useState } from "react";
// import { Card, CardBody, CardHeader } from "@heroui/card";
// import { Button } from "@heroui/button";
// import { Input } from "@heroui/input";
// import { Divider } from "@heroui/divider";
// import {
//   Wallet,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Gift,
//   Lock,
//   Coins,
//   Shield,
// } from "lucide-react";
// import { useAccount } from "wagmi";
// import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
// import { parseUnits, formatUnits } from "viem";
// import { config } from "@/config/wagmiConfig";

// import VUSDT_ABI from "../abis/vUSDT.json";
// import YIELD_VAULT_ABI from "../abis/yieldVault.json";

// import DefaultLayout from "@/layouts/default";
// import { toast, ToastContainer } from "react-toastify";

//   const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
//   const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;

// interface VaultData {
//   locked: string;
//   available: string;
// }

// export default function VaultPage() {
//   const { address } = useAccount();
//   const [vusdtBalance, setVusdtBalance] = useState<string>("0");
//   const [vaultData, setVaultData] = useState<string>("0");
//   const [depositAmount, setDepositAmount] = useState<string>("");
//   const [withdrawAmount, setWithdrawAmount] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [loadingWithdraw, setLoadingWithdraw] = useState(false);

//   const loadVaultBalances = async () => {
//     if (!address) return;
//     try {
//       setLoading(true);

//       const vaultResult = await readContract(config, {
//         address: YIELD_VAULT_ADDRESS,
//         abi: YIELD_VAULT_ABI,
//         functionName: "balanceOf",
//         args: [address],
//       }) as bigint;

//       setVaultData(formatUnits(vaultResult, 18));

//       const balance = await readContract(config, {
//         address: VUSDT_ADDRESS,
//         abi: VUSDT_ABI,
//         functionName: "balanceOf",
//         args: [address],
//       }) as bigint;

//       setVusdtBalance(formatUnits(balance, 18));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load vault balances.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAirdrop = async () => {
//     if (!address) return;
//     try {
//       const hasClaimed = await readContract(config, {
//         address: VUSDT_ADDRESS,
//         abi: VUSDT_ABI,
//         functionName: "hasClaimed",
//         args: [address],
//       }) as boolean;

//       if (hasClaimed) {
//         toast.error("You already claimed your airdrop.");
//         return;
//       }

//       const tx = await writeContract(config, {
//         address: VUSDT_ADDRESS,
//         abi: VUSDT_ABI,
//         functionName: "airdrop",
//         args: [],
//       });

//       toast.info("Transaction sent. Waiting for confirmation...");

//       const receipt = await waitForTransactionReceipt(config, { hash: tx });

//       if (receipt.status === "success") {
//         toast.success("Airdrop successful!");
//         await loadVaultBalances();
//       } else {
//         toast.error("Airdrop failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Airdrop failed.");
//     }
//   };

//   const handleDeposit = async () => {
//     if (!address || !depositAmount) return;
//     try {
//       setLoading(true);
//       const amt = parseUnits(depositAmount, 18);

//       const allowance = await readContract(config, {
//         address: VUSDT_ADDRESS,
//         abi: VUSDT_ABI,
//         functionName: "allowance",
//         args: [address, YIELD_VAULT_ADDRESS],
//       }) as bigint;

//       if (allowance < amt) {
//         const approveTx = await writeContract(config, {
//           address: VUSDT_ADDRESS,
//           abi: VUSDT_ABI,
//           functionName: "approve",
//           args: [YIELD_VAULT_ADDRESS, amt],
//         });

//         toast.info("Approving spend...");

//         await waitForTransactionReceipt(config, { hash: approveTx });
//       }

//       const tx = await writeContract(config, {
//         address: YIELD_VAULT_ADDRESS,
//         abi: YIELD_VAULT_ABI,
//         functionName: "deposit",
//         args: [amt , address],
//       });

//       toast.info("Depositing... please wait");

//       const receipt = await waitForTransactionReceipt(config, { hash: tx });

//       if (receipt.status === "success") {
//         toast.success("Deposit successful!");
//         setDepositAmount("");
//         await loadVaultBalances();
//       } else {
//         toast.error("Deposit failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Deposit failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWithdraw = async () => {
//     if (!address || !withdrawAmount) return;
//     try {
//       setLoadingWithdraw(true);
//       const amt = parseUnits(withdrawAmount, 18);

//       const tx = await writeContract(config, {
//         address: YIELD_VAULT_ADDRESS,
//         abi: YIELD_VAULT_ABI,
//         functionName: "withdraw",
//         args: [amt , address , address],
//       });

//       toast.info("Withdrawing... please wait");

//       const receipt = await waitForTransactionReceipt(config, { hash: tx });

//       if (receipt.status === "success") {
//         toast.success("Withdrawal successful!");
//         setWithdrawAmount("");
//         await loadVaultBalances();
//       } else {
//         toast.error("Withdrawal failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Withdrawal failed.");
//     } finally {
//       setLoadingWithdraw(false);
//     }
//   };

//   useEffect(() => {
//     if (address) loadVaultBalances();
//   }, [address]);


//   return (
//      <DefaultLayout>
//       <div className="min-h-screen pt-26 bg-background">
//         <div className="max-w-5xl mx-auto px-4 py-8">
//           {/* Hero Balance Section */}
//           <div className="relative mb-8 overflow-hidden rounded-3xl bg-default-100 border border-divider">
//             <div className="relative p-8">
//               <div className="flex items-center gap-2 mb-6 text-foreground-600">
//                 <Wallet size={20} />
//                 <span className="text-sm font-medium uppercase tracking-wider">Total Vault Balance</span>
//               </div>
//               <div className="text-6xl font-bold text-foreground mb-2">
//                 ${parseFloat(vaultData).toFixed(2)}
//               </div>
//               <div className="flex gap-6 text-sm">
//                 <div className="flex items-center gap-2">
//                   <Lock size={14} className="text-violet-500" />
//                   <span className="text-foreground-600">${parseFloat(vaultData).toFixed(2)} locked</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Coins size={14} className="text-success-500" />
//                   <span className="text-foreground-600">${parseFloat(vaultData).toFixed(2)} available</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            
//             {/* Wallet Balance Card */}
//             <Card className="bg-content1 border-divider">
//               <CardBody className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 rounded-xl bg-violet-500/20">
//                     <Wallet size={18} className="text-violet-500" />
//                   </div>
//                   <span className="text-sm text-foreground-500 uppercase tracking-wide">Wallet</span>
//                 </div>
//                 <div className="text-2xl font-bold text-foreground">
//                   {parseFloat(vusdtBalance).toLocaleString()}
//                 </div>
//                 <div className="text-sm text-foreground-500 mt-1">vUSDT</div>
//               </CardBody>
//             </Card>

//             {/* Airdrop Card */}
//             <Card className="bg-content1 border-divider lg:col-span-2">
//               <CardBody className="p-6 flex flex-row items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-3 rounded-xl bg-success-500/20">
//                     <Gift size={22} className="text-success-500" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-semibold text-foreground">Claim Your Airdrop</div>
//                     <div className="text-sm text-foreground-500">Get 10,000 vUSDT instantly</div>
//                   </div>
//                 </div>
//                 <Button
//                   onPress={handleAirdrop}
//                   className="bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold"
//                   size="lg"
//                 >
//                   Claim Now
//                 </Button>
//               </CardBody>
//             </Card>
//           </div>

//           {/* Action Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
//             {/* Deposit */}
//             <Card className="bg-content1 border-divider">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-success-500/20">
//                     <ArrowUpCircle size={16} className="text-success-500" />
//                   </div>
//                   <h3 className="text-base font-semibold text-foreground">Deposit</h3>
//                 </div>
//               </CardHeader>
//               <Divider className="bg-divider" />
//               <CardBody className="pt-6 space-y-4">
//                 <div>
//                   <Input
//                     type="number"
//                     placeholder="0.00"
//                     value={depositAmount}
//                     onChange={(e) => setDepositAmount(e.target.value)}
//                     classNames={{
//                       input: "text-2xl font-semibold",
//                       inputWrapper: "bg-default-100 border-divider h-16"
//                     }}
//                     endContent={
//                       <span className="text-foreground-500 text-sm font-medium">vUSDT</span>
//                     }
//                   />
//                 </div>
//                 <Button
//                   onPress={handleDeposit}
//                   className="w-full bg-success-500 hover:bg-success-600 text-white font-semibold h-12"
//                   isLoading={loading}
//                   isDisabled={!depositAmount || parseFloat(depositAmount) <= 0}
//                 >
//                   Deposit to Vault
//                 </Button>
//               </CardBody>
//             </Card>

//             {/* Withdraw */}
//             <Card className="bg-content1 border-divider">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-danger-500/20">
//                     <ArrowDownCircle size={16} className="text-danger-500" />
//                   </div>
//                   <h3 className="text-base font-semibold text-foreground">Withdraw</h3>
//                 </div>
//               </CardHeader>
//               <Divider className="bg-divider" />
//               <CardBody className="pt-6 space-y-4">
//                 <div>
//                   <Input
//                     type="number"
//                     placeholder="0.00"
//                     value={withdrawAmount}
//                     onChange={(e) => setWithdrawAmount(e.target.value)}
//                     classNames={{
//                       input: "text-2xl font-semibold",
//                       inputWrapper: "bg-default-100 border-divider h-16"
//                     }}
//                     endContent={
//                       <span className="text-foreground-500 text-sm font-medium">vUSDT</span>
//                     }
//                   />
//                 </div>
//                 <Button
//                   onPress={handleWithdraw}
//                   className="w-full bg-danger-500/10 hover:bg-danger-500/20 text-danger-500 font-semibold h-12 border border-danger-500/30"
//                   isLoading={loadingWithdraw}
//                   isDisabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
//                 >
//                   Withdraw from Vault
//                 </Button>
//               </CardBody>
//             </Card>
//           </div>

//           {/* Security Notice */}
//           <div className="mt-6 p-4 rounded-xl bg-amber-600/10 border border-amber-600/20">
//             <div className="flex items-start gap-3">
//               <Shield size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-amber-200/80">
//                 Always verify transaction details before confirming. Your funds are secured by smart contracts.
//               </p>
//             </div>
//           </div>
//         </div>

//         <ToastContainer
//           position="bottom-right"
//           autoClose={4000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           draggable
//           theme="dark"
//         />
//       </div>
//     </DefaultLayout>
//   );
// }

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { Badge } from "@heroui/badge";
import {
  Wallet,
  ArrowRightLeft,
  Gift,
  Lock,
  Coins,
  Shield,
  TrendingUp,
  Info,
  Zap,
  CircleDollarSign,
  Eye,
  EyeOff,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useAccount } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, formatUnits } from "viem";
import { config } from "@/config/wagmiConfig";

import VUSDT_ABI from "../abis/vUSDT.json";
import YIELD_VAULT_ABI from "../abis/yieldVault.json";

import DefaultLayout from "@/layouts/default";
import { toast, ToastContainer } from "react-toastify";
import { ConnectButton } from "thirdweb/react";
import { client } from "../config/thirdwebConfig";

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

      setVusdtBalance(formatUnits(balance, 18));
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
        toast.success("🎉 10,000 vUSDT claimed!");
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
          toast.success("✅ Deposit successful!");
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
          toast.success("✅ Withdrawal successful!");
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
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-950 via-violet-950/20 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          
          {/* Top Stats Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
                Yield Vault
              </h1>
              <p className="text-foreground-500 flex items-center gap-2">
                <TrendingUp size={16} className="text-success-500" />
                Earn passive yield on your assets
              </p>
            </div>
            <Button
              size="sm"
              variant="flat"
              onPress={() => setHideBalances(!hideBalances)}
              className="bg-default-100"
              isIconOnly
            >
              {hideBalances ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Large Vault Card - Left Side */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent backdrop-blur-xl border border-violet-500/30 shadow-2xl shadow-violet-500/20 h-full">
                <CardBody className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                        <Lock size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground-500 uppercase tracking-wider">Vault Balance</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge content="" color="success" size="sm" className="border-0">
                            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                          </Badge>
                          <span className="text-xs text-foreground-400">Active</span>
                        </div>
                      </div>
                    </div>
                    <Tooltip content="Your locked funds in the vault">
                      <Button size="sm" variant="light" isIconOnly>
                        <Info size={18} className="text-foreground-500" />
                      </Button>
                    </Tooltip>
                  </div>

                  <div className="mb-8">
                    <div className="text-6xl font-black bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent mb-3">
                      {hideBalances ? "••••••" : `$${vaultBalance.toFixed(2)}`}
                    </div>
                    <p className="text-foreground-500 text-sm">≈ {hideBalances ? "•••••" : vaultBalance.toFixed(4)} vUSDT</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-background/50 backdrop-blur border border-divider">
                      <p className="text-xs text-foreground-500 mb-1 uppercase">APY</p>
                      <p className="text-xl font-bold text-success-500">5.2%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 backdrop-blur border border-divider">
                      <p className="text-xs text-foreground-500 mb-1 uppercase">Earned</p>
                      <p className="text-xl font-bold text-foreground">$0.00</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 backdrop-blur border border-divider">
                      <p className="text-xs text-foreground-500 mb-1 uppercase">TVL</p>
                      <p className="text-xl font-bold text-foreground">$2.4M</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onPress={() => openModal("deposit")}
                      className="bg-gradient-to-r from-success-500 to-emerald-600 text-white font-bold h-12 shadow-lg shadow-success-500/30"
                      startContent={<CircleDollarSign size={20} />}
                    >
                      Deposit
                    </Button>
                    <Button
                      onPress={() => openModal("withdraw")}
                      className="bg-default-100 border border-divider text-foreground font-bold h-12"
                      startContent={<ArrowRightLeft size={20} />}
                    >
                      Withdraw
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Side - Wallet & Airdrop */}
            <div className="space-y-6">
              
              {/* Wallet Balance Card */}
              <Card className="bg-content1/80 backdrop-blur border-divider">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-500/20">
                      <Wallet size={20} className="text-blue-400" />
                    </div>
                    <p className="text-sm text-foreground-500 uppercase tracking-wider">Wallet</p>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {hideBalances ? "••••••" : walletBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-foreground-500">vUSDT Available</p>
                  <Divider className="my-4" />
                  <p className="text-xs text-foreground-400">
                    ≈ ${hideBalances ? "•••" : walletBalance.toFixed(2)} USD
                  </p>
                </CardBody>
              </Card>

              {/* Airdrop Card with thirdweb style */}
              <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/30 backdrop-blur shadow-xl shadow-amber-500/10">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                      <Gift size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        Claim Airdrop
                        <Sparkles size={16} className="text-amber-500" />
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-foreground-500 mb-4">
                    Get <span className="font-bold text-amber-400">10,000 vUSDT</span> tokens instantly to start earning yield
                  </p>
                  <Button
                    onPress={handleAirdrop}
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white font-bold shadow-lg shadow-amber-500/50 h-12"
                    endContent={<Zap size={18} />}
                  >
                    Claim Now
                  </Button>
                </CardBody>
              </Card>

              {/* Security Badge */}
              <Card className="bg-default-100/50 border-divider">
                <CardBody className="p-5">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-success-500" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Audited & Secured</p>
                      <p className="text-xs text-foreground-500">Smart contracts verified</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-content1/50 backdrop-blur border-divider">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Coins size={20} className="text-violet-400" />
                  <h4 className="font-semibold text-foreground">Auto-Compounding</h4>
                </div>
                <p className="text-sm text-foreground-500">Yields are automatically reinvested to maximize returns</p>
              </CardBody>
            </Card>

            <Card className="bg-content1/50 backdrop-blur border-divider">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Lock size={20} className="text-blue-400" />
                  <h4 className="font-semibold text-foreground">No Lock Period</h4>
                </div>
                <p className="text-sm text-foreground-500">Withdraw your funds anytime without penalties</p>
              </CardBody>
            </Card>

            <Card className="bg-content1/50 backdrop-blur border-divider">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-success-400" />
                  <h4 className="font-semibold text-foreground">Battle-Tested</h4>
                </div>
                <p className="text-sm text-foreground-500">Audited smart contracts with $2M+ TVL</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Transaction Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size="lg"
          classNames={{
            base: "bg-content1 border border-divider",
            header: "border-b border-divider",
            body: "py-6",
            footer: "border-t border-divider"
          }}
        >
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${actionType === "deposit" ? "bg-success-500/20" : "bg-danger-500/20"}`}>
                  {actionType === "deposit" ? 
                    <CircleDollarSign size={20} className="text-success-500" /> : 
                    <ArrowRightLeft size={20} className="text-danger-500" />
                  }
                </div>
                <h3 className="text-xl font-bold">
                  {actionType === "deposit" ? "Deposit to Vault" : "Withdraw from Vault"}
                </h3>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground-600">Amount</label>
                    <button 
                      onClick={() => setAmount(actionType === "deposit" ? vusdtBalance : vaultData)}
                      className="text-xs font-semibold text-violet-500 hover:text-violet-600"
                    >
                      MAX: {(actionType === "deposit" ? walletBalance : vaultBalance).toFixed(2)}
                    </button>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    size="lg"
                    classNames={{
                      input: "text-2xl font-bold",
                      inputWrapper: "h-16 bg-default-100"
                    }}
                    startContent={<CreditCard size={20} className="text-foreground-400" />}
                    endContent={<span className="font-semibold text-foreground-500">vUSDT</span>}
                  />
                </div>

                {amount && parseFloat(amount) > 0 && (
                  <div className={`p-4 rounded-xl ${actionType === "deposit" ? "bg-success-500/10 border border-success-500/20" : "bg-danger-500/10 border border-danger-500/20"}`}>
                    <p className={`text-sm ${actionType === "deposit" ? "text-success-300" : "text-danger-300"}`}>
                      {actionType === "deposit" 
                        ? `Your vault balance will be $${(vaultBalance + parseFloat(amount)).toFixed(2)}`
                        : `Your vault balance will be $${(vaultBalance - parseFloat(amount)).toFixed(2)}`
                      }
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                onPress={handleTransaction}
                isLoading={loading}
                isDisabled={!amount || parseFloat(amount) <= 0}
                className={actionType === "deposit" 
                  ? "bg-gradient-to-r from-success-500 to-emerald-600 text-white font-bold"
                  : "bg-danger-500 text-white font-bold"
                }
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