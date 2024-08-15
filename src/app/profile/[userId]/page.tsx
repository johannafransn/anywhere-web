"use client";
import useGetUserById from "@/hooks/useGetUserById";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user, loading, error } = useGetUserById();

  return (
    <div className="relative flex flex-col w-full md:w-4/5 items-center justify-center">
      <div className="mt-12">
        {user}
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
        <p>
          User info: {user?.walletAddress}
          <br></br>
          {user?.name}
          <br></br>
          {user?.email}
        </p>
      </div>
    </div>
  );
}
