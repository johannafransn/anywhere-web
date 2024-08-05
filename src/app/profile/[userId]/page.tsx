"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col w-full md:w-4/5 items-center justify-center">
      <div className="mt-12">
        <h2
          className="text-center font-bold text-7xl leading-normal tracking-tight uppercase mb-3"
          style={{ fontSize: 30, lineHeight: 1 }}
        >
          Your profile
        </h2>
        <h4 className="text-center font-bold text-xl leading-normal tracking-tight uppercase">
          Welcome to your profile
        </h4>
        <p className="mt-3 text-center mb-5">
          Create and share a meetup. Everyone can join and earn.
        </p>
      </div>
    </div>
  );
}
