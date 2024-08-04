/* eslint-disable @next/next/no-img-element */
"use client";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";
import { useAccount, useAccountEffect } from "wagmi";
import LoginButton from "./components/LoginButton";

export default function Home() {
  const { open } = useWeb3Modal();
  const router = useRouter();

  useAccountEffect({
    async onConnect(data) {
      console.log("Connected!", data);

      const user = await ApiService.authenticateUser({ address: data.address });
      Auth.setUser(user.id);
      router.push("/dashboard");
    },
    onDisconnect() {
      /* const cookie = new Cookies()
				cookie.remove('addresso') */
      //removeAccessTokenCookie()
      //router.push('/')
      console.log("Disconnected");
    },
  });

  return (
    <div className="relative flex flex-col w-full md:w-4/5 items-center justify-center">
      <div className="mt-12">
        <h2
          className="text-center font-bold text-7xl leading-normal tracking-tight uppercase mb-3"
          style={{ fontSize: 30, lineHeight: 1 }}
        >
          Anywhere.xyz
        </h2>
        <h4 className="text-center font-bold text-xl leading-normal tracking-tight uppercase">
          Crowdsource your next meetup
        </h4>
        <p className="mt-3 text-center mb-5">
          Create and share a meetup. Everyone can join and earn.
        </p>
      </div>
      <LoginButton />
    </div>
  );
}
