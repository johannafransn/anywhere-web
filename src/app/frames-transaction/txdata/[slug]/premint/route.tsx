/* import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";

import { findFrameById, findFrameBySlug } from "@/database-crud/frame";
import { getCollectiveById } from "@/database-crud/collective";
import { erc20PreMint, mint } from "@/utils";
import { findUserById } from "@/database-crud/user";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const url = req.url;

  const parts = url.split("/p");
  const slug = parts[0].split("/").pop();
  if (!slug) {
    throw new Error("No slug in url" + url);
  }
  //use existing frame data to get token params & mint
  const existingFrame = await findFrameBySlug(slug);
  if (!existingFrame) {
    throw new Error("Frame with slug not found" + slug);
  }
  const collective = await getCollectiveById(
    existingFrame.collectiveId as number
  );
  if (!collective) {
    throw new Error("No frame message");
  }

  const creatorOfFrame = await findUserById(existingFrame.createdBy as number);
  if (!creatorOfFrame) {
    throw new Error(
      "No creator for this frame found with user id:" + existingFrame.createdBy
    );
  }

  const json = await req.json();
  const frameMessage = await getFrameMessage(json);
  if (!frameMessage) {
    throw new Error("No frame message");
  }

  //TODO: Only call the premint if erc20mint
  const premintTx = await erc20PreMint(collective.cWallet as `0x${string}`, {
    tokenAddress: existingFrame.nftTokenAddress as `0x${string}`,
    currency: existingFrame.paymentCurrency as `0x${string}`, // "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",//`0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`//,
    recipient: frameMessage.connectedAddress as `0x${string}`,
    mintReferral: collective.honeyPot as `0x${string}`,
    creator: creatorOfFrame.walletAddress as `0x${string}`,
    quantity: BigInt(1),
    tokenID: BigInt(1),
    totalValue: existingFrame.priceInToken, //ethers.formatEther(await getETHMintPrice(`0x${"48Fc3c982a022070cbC64d250Db398b82D123E68"}`)),
    comment: "Minted via MyCollective",
    tokenDecimal: existingFrame.decimal,
  });


  return NextResponse.json({
    chainId: "eip155:8453", // base mainnet
    method: "eth_sendTransaction",
    params: {
      abi: premintTx.abi,
      to: premintTx.to,
      data: premintTx.data as `0x${string}`,
      value: premintTx.value.toString(),
    },
  });
}
 */

import { db, meetup } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const meetups = await db.select().from(meetup);
    return NextResponse.json(meetups);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
