import { parseEther, getContract, Hex, PublicClient, WalletClient } from "viem";
import { ViemService } from "./Viem";
import { EVENT_ESCROW_ADDRESS_BASE_TESTNET } from "@/utils/constants";
import { eventEscrowAbi } from "./abi/escrow";

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

  // ADMIN

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

  // ACTION

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
    const walletClient = await this.getWalletClient();
    if (!walletClient || !walletClient.account) {
      throw new Error("Wallet client account is undefined");
    }

    const tokenContract = await this.getTokenContract(walletClient);
    const formattedEventId = parseEther(String(eventId));
    const formattedAmount = parseEther(String(amount));

    try {
      const { request } = await this.publicClient.simulateContract({
        ...tokenContract,
        functionName: "depositEscrow",
        args: [organizer, formattedEventId],
        value: formattedAmount,
        account: walletClient.account,
      });

      const hash = await walletClient.writeContract(request);

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      return receipt;
    } catch (error) {
      console.error(`Error depositing escrow: ${error}`);
    }
  }

  public async createEvent(
    organizer: Hex,
    eventId: number | string,
    amountReqToAttend: number | string
  ) {
    const tokenContract = await this.getTokenContract(this.serverClient);
    const formattedEventId = parseEther(String(eventId));
    const formattedAmountReqToAttend = parseEther(String(amountReqToAttend));

    try {
      const { request } = await this.publicClient.simulateContract({
        ...tokenContract,
        functionName: "createEvent",
        args: [organizer, formattedEventId, formattedAmountReqToAttend],
        account: this.serverAccount,
      });

      const hash = await this.serverClient.writeContract({
        ...request,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      return receipt;
    } catch (error) {
      console.error(`Error creating event: ${error}`);
    }
  }

  // INFO

  public async getEscrowDetails(
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

  public async getEventDetails(organizer: Hex, eventId: number | string) {
    const formattedEventId = parseEther(String(eventId));
    const tokenContract = await this.getTokenContract();
    return tokenContract.read.getEventDetails([organizer, formattedEventId]);
  }
}
