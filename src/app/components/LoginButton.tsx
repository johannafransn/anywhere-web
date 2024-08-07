/* eslint-disable @next/next/no-img-element */
"use client";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";
import { useAccount, useAccountEffect } from "wagmi";

export default function LoginButton() {
  const { open } = useWeb3Modal();
  const router = useRouter();

  useAccountEffect({
    async onConnect(data) {
      console.log("Connected!", data);

      const existingUser = await ApiService.getUserByWalletAddress(
        data.address
      );
      console.log(existingUser, "exist user?");
      if (existingUser) {
        router.push(`/profile/${existingUser.id}`);
      } else {
        router.push(`/onboard/${data.address}`);
      }
    },
    onDisconnect() {
      console.log("Disconnected");
      Auth.removeUser();
    },
  });

  return (
    <button
      onClick={() => open()}
      className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
    >
      Create Account
    </button>
  );
}
