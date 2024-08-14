import { parseEther, getContract, Hex, PublicClient, WalletClient } from "viem";
import { ViemService } from "./Viem";
import { EVENT_ESCROW_ADDRESS_BASE_TESTNET } from "@/utils/constants";

export class EventEscrow extends ViemService {
  private eventEscrowAddress: Hex;

  constructor(eventEscrowAddress: Hex = EVENT_ESCROW_ADDRESS_BASE_TESTNET) {
    super();
    this.eventEscrowAddress = eventEscrowAddress;
  }

  private eventEscrowContract() {
    return {
      address: this.eventEscrowAddress,
      abi: eventEscrowAbi,
    };
  }

  private async getTokenContract(
    client: WalletClient | PublicClient = this.publicClient
  ) {
    return getContract({
      ...this.eventEscrowContract(),
      client,
    });
  }

  public async changeAdmin(newAdmin: Hex) {
    const tokenContract = await this.getTokenContract(this.serverClient);

    try {
      const { request } = await this.publicClient.simulateContract({
        ...tokenContract,
        functionName: "changeAdmin",
        args: [newAdmin],
      });

      const hash = await this.serverClient.writeContract({
        ...request,
        account: this.serverAccount,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      return receipt;
    } catch (error) {
      console.error(`Error changing admin: ${error}`);
    }
  }

  public async getAdmin() {
    const tokenContract = await this.getTokenContract();
    return tokenContract.read.admin();
  }

  public async getEventEscrowDetails(
    organizer: Hex,
    eventId: number | string,
    attendee: Hex
  ) {
    const formattedEventId = parseEther(String(eventId));
    const tokenContract = await this.getTokenContract();
    return tokenContract.read.getEscrowDetails([
      organizer,
      formattedEventId,
      attendee,
    ]);
  }

  public async releaseEscrow(
    organizer: Hex,
    eventId: number | string,
    attendee: Hex
  ) {
    const tokenContract = await this.getTokenContract(this.serverClient);
    const formattedEventId = parseEther(String(eventId));

    try {
      const { request } = await this.publicClient.simulateContract({
        ...tokenContract,
        functionName: "releaseEscrow",
        args: [organizer, formattedEventId, attendee],
      });

      const hash = await this.serverClient.writeContract({
        ...request,
        account: this.serverAccount,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      return receipt;
    } catch (error) {
      console.error(`Error releasing escrow: ${error}`);
    }
  }

  public async depositEscrow(
    organizer: Hex,
    eventId: number | string,
    amount: number | string
  ) {
    const tokenContract = await this.getTokenContract(this.serverClient);
    const formattedEventId = parseEther(String(eventId));
    const formattedAmount = parseEther(String(amount));

    try {
      const { request } = await this.publicClient.simulateContract({
        ...tokenContract,
        functionName: "depositEscrow",
        args: [organizer, formattedEventId],
        value: formattedAmount,
      });

      if (!this.walletClient.account) {
        throw new Error("Wallet client account is undefined");
      }

      const hash = await this.walletClient.writeContract({
        ...request,
        account: this.walletClient.account,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      return receipt;
    } catch (error) {
      console.error(`Error depositing escrow: ${error}`);
    }
  }
}
