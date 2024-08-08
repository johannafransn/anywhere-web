/* eslint-disable @next/next/no-img-element */
"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";
import LoginButton from "./components/LoginButton";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col w-full">
      <div className="flex">
        <h4 className=" font-normal text-8xl mr-2 w-4/5">
          Crowdsource your next in-person meetup
        </h4>
        <div className="mt-7">
          <p className="text-lgfont-light mb-3">
            Get paid to host IRL meetups and let your guests earn by bringing a
            friend.
          </p>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
