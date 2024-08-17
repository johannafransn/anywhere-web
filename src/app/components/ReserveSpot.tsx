"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/utils/api-service"; // Adjust the import path as necessary
import { Auth } from "@/utils/cookie-auth";

export default function ReserveSpot(props: any) {
  let { meetupId, userId, isGuest, price, isOwner } = props; // Assuming userId is passed as a prop
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {}, [isReserved]);

  const reserveSpot = async () => {
    setLoading(true);
    try {
      const response = await ApiService.createGuest({
        meetupId,
        userId: Auth.id,
      });
      let response = true;
      console.log("response", response);

      if (response) {
        console.log("Spot reserved successfully");
        // Optionally, you can redirect or update the UI here
        setIsReserved(true);
      } else {
        console.error("Error reserving spot");
      }
    } catch (error) {
      console.error("Error reserving spot:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderButtonText = () => {
    console.log(isGuest || isOwner, "is guest or owner", isGuest, isOwner);
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
    </div>
  );
}
