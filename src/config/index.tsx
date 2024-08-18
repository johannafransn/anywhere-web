import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { base, baseSepolia } from "viem/chains";
// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "Anywhere.xyz",
  description: "Meet Anywhere",
  url: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  auth: {
    email: true, // default to true
    socials: ["x", "github", "farcaster"],
    showWallets: true, // default to true
    walletFeatures: true, // default to true
  },
};

const chains = [base, baseSepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
