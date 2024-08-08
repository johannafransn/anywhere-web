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
      className="py-2 px-5 bg-black-opacity-80 text-white font-light rounded hover:bg-black-opacity-70 hover:scale-105 transition ease-in-out disabled:bg-black-opacity-30"
    >
      Create Account
    </button>
  );
}
