/* eslint-disable @next/next/no-img-element */
"use client";
import { useUserSession } from "@/hooks/useUserSession";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useAccountEffect, useDisconnect } from "wagmi";

export default function LoginButton() {
  const { open } = useWeb3Modal();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { updateUserSession, userSession } = useUserSession();

  useAccountEffect({
    async onConnect(data) {
      console.log("Connected!", data);

      try {
        const existingUser = await ApiService.getUserByWalletAddress(
          data.address
        );
        console.log(existingUser, "exist user?");
        if (existingUser) {
          Auth.setUser(existingUser.id);
          updateUserSession(true);
          router.push(`/profile/${existingUser.id}`);
        } else {
          router.push(`/onboard/${data.address}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        disconnect();
      }
    },
    onDisconnect() {
      console.log("Disconnected");
      Auth.removeUser();
    },
  });

  useEffect(() => {}, [userSession]);

  return (
    <button
      onClick={() => open()}
      className="py-2 px-5 bg-black-opacity-80 text-white font-light rounded-xl hover:bg-black-opacity-70 hover:scale-105 transition ease-in-out disabled:bg-black-opacity-30"
    >
      Create Account
    </button>
  );
}
