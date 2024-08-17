"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/utils/api-service"; // Adjust the import path as necessary
import { Auth } from "@/utils/cookie-auth";
import { EventEscrow } from "@/services/EventEscrow";
import { useAccount } from "wagmi";
import { Hex } from "viem";
import WithdrawFundsButton from "./WithdrawFundsButton";

export default function ReserveSpot(props: any) {
  let { meetupId, userId, isGuest, price, isOwner, ownerAddress } = props; // Assuming userId is passed as a prop
  const router = useRouter();
  const { address: userAddress } = useAccount();
  const [loading, setLoading] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {}, [isReserved]);

  const reserveSpot = async () => {
    setLoading(true);
    try {
      if (userAddress) {
        const eventEscrowContract = new EventEscrow({ isClient: true });
        const depositResponse = await eventEscrowContract.depositEscrow(
          userAddress,
          ownerAddress as Hex,
          meetupId as number,
          price as string
        );

        if (!depositResponse) {
          console.error("Error depositing escrow");
          return;
        }

        const response = await ApiService.createGuest({
          meetupId,
          userId: Auth.id,
        });

        if (response) {
          setIsReserved(true);
        } else {
          console.error("Error reserving spot");
        }
      }
    } catch (error) {
      console.error("Error reserving spot:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderButtonText = () => {
    if (isGuest || isOwner || isReserved) {
      return "You are going!";
    } else if (loading) {
      return "Reserving...";
    } else {
      return "Reserve Spot";
    }
  };

  return (
    <div className="flex flex-col border border-gray-400 rounded-lg p-2 bg-gray-200">
      <div className="bg-white text-[15px] border-gray-4000 rounded-lg p-1 mb-2 ">
        Get Tickets
      </div>
      <div className="flex flex-row justify-between mb-2">
        <p className="mb-1 ">1 person</p>
        <p>{price} ETH</p>
      </div>
      <button
        disabled={isOwner || loading}
        className={`bg-gray-500 w-full rounded-lg border border-gray-4000 p-4 text-white ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={loading ? undefined : reserveSpot}
      >
        {renderButtonText()}
      </button>
      <WithdrawFundsButton organizerAddress={ownerAddress} eventId={meetupId} />
    </div>
  );
}
