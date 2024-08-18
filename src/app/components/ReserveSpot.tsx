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
    <div className="flex flex-col space-y-3 border border-gray-200 rounded-lg p-1 bg-gray-100">
      <div className="bg-white text-black-opacity-50 text-sm rounded-t-lg p-2">
        Get Tickets
      </div>
      <div className="flex flex-row justify-between text-sm px-1 text-black-opacity-50">
        <p className="mb-1 ">1 Person</p>
        <p>{price} ETH</p>
      </div>
      {/* Buttonz */}
      <hr />
      <div className="space-y-3 px-1">
        <button
          disabled={isOwner || loading}
          className={`bg-black-opacity-80 w-full rounded-lg border border-gray-4000 p-2 text-white ${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={loading ? undefined : reserveSpot}
        >
          {renderButtonText()}
        </button>
        <WithdrawFundsButton
          organizerAddress={ownerAddress}
          eventId={meetupId}
        />
      </div>
    </div>
  );
}
