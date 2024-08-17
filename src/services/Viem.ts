import {
  Chain,
  createPublicClient,
  createWalletClient,
  Hex,
  http,
  PublicClient,
  WalletClient,
  Account,
  custom,
} from "viem";
import { baseSepolia, base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import "viem/window";

type SupportChainType = typeof baseSepolia | typeof base;

export class ViemService {
  protected currentChain: Chain;
  protected serverClient: WalletClient | undefined;
  protected serverAccount: Account | undefined;
  public publicClient: PublicClient;

  constructor({
    chain = baseSepolia,
    isClient = false,
  }: {
    chain?: SupportChainType;
    isClient?: boolean;
  }) {
    this.currentChain = chain;

    if (isClient) {
      this.publicClient = createPublicClient({
        chain: this.currentChain,
        transport: custom(window.ethereum!),
      });
      return;
    }

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY is not set");
    } else {
      this.serverAccount = privateKeyToAccount(`0x${privateKey}`);
    }

    this.serverClient = createWalletClient({
      chain: this.currentChain,
      account: this.serverAccount,
      transport: http(),
    });

    this.publicClient = createPublicClient({
      chain: this.currentChain,
      transport: http(),
    });
  }

  public async getWalletClient(account: Hex) {
    return createWalletClient({
      chain: this.currentChain,
      account,
      transport: custom(window.ethereum!),
    });
  }

  public async getBalanceForServerClient() {
    const balance = await this.publicClient.getBalance({
      address: this.serverAccount?.address!,
    });
    return balance;
  }
}
