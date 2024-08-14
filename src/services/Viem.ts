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
  protected serverClient: WalletClient;
  protected serverAccount: Account;
  public publicClient: PublicClient;
  public walletClient: WalletClient;

  constructor(chain: SupportChainType = baseSepolia) {
    this.currentChain = chain;

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY is not set");
    } else {
      this.serverAccount = privateKeyToAccount(`0x${privateKey}`);
    }

    this.publicClient = createPublicClient({
      chain: this.currentChain,
      transport: http(),
    });

    this.serverClient = createWalletClient({
      chain: this.currentChain,
      account: this.serverAccount,
      transport: http(),
    });

    this.walletClient = createWalletClient({
      chain: this.currentChain,
      account: this.serverAccount,
      transport: custom(window.ethereum!),
    });
  }

  public async getBalanceForServerClient() {
    const balance = await this.publicClient.getBalance({
      address: this.serverAccount.address,
    });
    return balance;
  }
}
