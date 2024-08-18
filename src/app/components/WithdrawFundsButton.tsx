import { useState } from "react";
import { useAccount } from "wagmi";
import { ApiService } from "@/utils/api-service";

type WithdrawFundsButtonProps = {
  organizerAddress: string;
  eventId: number;
};

export default function WithdrawFundsButton({
  organizerAddress,
  eventId,
}: WithdrawFundsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const handleWithdraw = async () => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiService.withdrawUserEscrowedFunds(
        organizerAddress,
        eventId,
        address
      );
      console.log("Withdrawal successful:", response);
    } catch (err) {
      console.error("Error withdrawing funds:", err);
      setError("Failed to withdraw funds. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleWithdraw}
        disabled={isLoading || !address}
        className="py-2 w-full bg-black mb-1 text-white font-light rounded-lg hover:bg-black-opacity-80 hover:scale-105 transition ease-in-out disabled:bg-black-opacity-30"
      >
        {isLoading ? "Withdrawing..." : "Withdraw Funds"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
