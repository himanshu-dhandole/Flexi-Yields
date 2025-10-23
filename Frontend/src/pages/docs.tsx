// import { title } from "@/components/primitives";
// import DefaultLayout from "@/layouts/default";
// import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
// import { readContract } from "thirdweb";

// import VUSDT_ABI from "../abis/vUSDT.json";
// import POOL_ABI from "../abis/pool.json";
// import TREASURY_ABI from "../abis/Treasury.json";
// import POOLROUTER_ABI from "../abis/poolRouter.json";
// import { writeContract } from "viem/actions";
// import { config } from "@/config/wagmiConfig";


// export default function DocsPage() {
//   const { address } = useAccount();
//   // const { writeContract, data: hash, isPending, error } = useWriteContract();
//   // const { isSuccess } = useWaitForTransactionReceipt({ hash });

//   const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
//   const POOL_1_ADDRESS = import.meta.env.VITE_POOL_1_ADDRESS as `0x${string}`;
//   const POOL_2_ADDRESS = import.meta.env.VITE_POOL_2_ADDRESS as `0x${string}`;
//   const POOL_3_ADDRESS = import.meta.env.VITE_POOL_3_ADDRESS as `0x${string}`;
//   const TREASURY_ADDRESS = import.meta.env.VITE_TREASURY_ADDRESS as `0x${string}`;
//   const POOLROUTER_ADDRESS = import.meta.env.VITE_POOL_ROUTER_ADDRESS as `0x${string}`;

//   // const handleAirdrop = () => {
//   //   writeContract({
//   //     address: VUSDT_ADDRESS,
//   //     abi: VUSDT_ABI,
//   //     functionName: "airdrop",
//   //   });
//   // };

//   const handleAirdrop = async () => {
//     if (!address) return;
//     try {
//       const hasClaimed = await readContract(config , {
//         address: VUSDT_ADDRESS,
//         abi: VUSDT_ABI,
//         functionName: "hasClaimed",
//         args: [address],
//       }) as boolean;
//     }
//   }


//   return (
//     <DefaultLayout>
//       <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//         <h1 className={title()}>Dev Page</h1>
//         <h3>{address || "Connect your wallet"}</h3>

//         <div className="flex flex-col gap-4 w-full max-w-md">
//           <button
//             onClick={handleAirdrop}
//             disabled={!address || isPending}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {isPending ? "Processing..." : "Airdrop USDT to Me"}
//           </button>

//           {error && (
//             <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//               <strong>Error:</strong> {error.message}
//             </div>
//           )}

//           {isSuccess && (
//             <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//               <strong>Success!</strong>
//               <br />
//               Transaction Hash: {hash}
//             </div>
//           )}
//         </div>
//       </section>
//     </DefaultLayout>
//   );
// }
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAccount } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { useState } from "react";

import VUSDT_ABI from "../abis/vUSDT.json";
import POOL_ABI from "../abis/pool.json";
import TREASURY_ABI from "../abis/Treasury.json";
import POOLROUTER_ABI from "../abis/poolRouter.json";
import { config } from "@/config/wagmiConfig";

export default function DocsPage() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
  const POOL_1_ADDRESS = import.meta.env.VITE_POOL_1_ADDRESS as `0x${string}`;
  const POOL_2_ADDRESS = import.meta.env.VITE_POOL_2_ADDRESS as `0x${string}`;
  const POOL_3_ADDRESS = import.meta.env.VITE_POOL_3_ADDRESS as `0x${string}`;
  const TREASURY_ADDRESS = import.meta.env.VITE_TREASURY_ADDRESS as `0x${string}`;
  const POOLROUTER_ADDRESS = import.meta.env.VITE_POOL_ROUTER_ADDRESS as `0x${string}`;

  const handleAirdrop = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      setError(null);
      setIsSuccess(false);
      
      // Check if user has already claimed
      const hasClaimed = await readContract(config, {
        address: VUSDT_ADDRESS,
        abi: VUSDT_ABI,
        functionName: "hasClaimed",
        args: [address],
      }) as boolean;

      if (hasClaimed) {
        setError("You have already claimed your airdrop!");
        return;
      }

      // Execute airdrop transaction
      const tx = await writeContract(config, {
        address: VUSDT_ADDRESS,
        abi: VUSDT_ABI,
        functionName: "airdrop",
      });

      setHash(tx);

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setIsSuccess(true);
      } else {
        setError("Airdrop transaction failed.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Airdrop failed.");
    } finally {
      setLoading(false);
    }
  };

  const loadBalances = async () => {
    if (!address) return;
    try {
      const vusdtBalance = await readContract(config, {
        address: TREASURY_ADDRESS,
        abi: TREASURY_ABI,
        functionName: "getBalance",
        args: [address],
      }) as any;

      console.log("vUSDT Balance:",vusdtBalance);
    } catch (err) {
      console.error("Failed to load balances:", err);
    }
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title()}>Dev Page</h1>
        <h3>{address || "Connect your wallet"}</h3>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <button
            onClick={handleAirdrop}
            disabled={!address || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Airdrop USDT to Me"}
          </button>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {isSuccess && hash && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <strong>Success!</strong>
              <br />
              Transaction Hash: {hash}
            </div>
          )}
        </div>

        <br />
        <button
          onClick={loadBalances}
          disabled={!address || loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Load Balances
        </button>
      </section>
    </DefaultLayout>
  );
}