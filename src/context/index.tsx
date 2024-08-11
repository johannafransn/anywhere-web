"use client";

import React, { ReactNode } from "react";
import { config, projectId, metadata } from "@/config";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
});

export default function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
