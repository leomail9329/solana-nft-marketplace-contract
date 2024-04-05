import bs58 from "bs58";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { PROGRAM_ID } from "./marketplace sol/marketplaceSOLConstant";

export const connection = new Connection(
  // "https://solana-devnet.g.alchemy.com/v2/SmTLHznGV1gnnP1F-hvPsTjOeVNAABTG"
  "https://api.devnet.solana.com"
);


export const ownerKeypair = async () => {
  const sk = process.env.NEXT_PUBLIC_MARKET_OWNER_KEY!;
  console.log(bs58.decode(sk));
  const keypair = Keypair.fromSecretKey(bs58.decode(sk));
  console.log({ keypair });
  return keypair;
};

export const sellerKeypair = async () => {
  const sk = process.env.NEXT_PUBLIC_SELLER_PRIVATE_KEY!;
  console.log(bs58.decode(sk));
  const keypair = Keypair.fromSecretKey(bs58.decode(sk));
  console.log({ keypair });
  return keypair;
};

export const buyerKeypair = async () => {
  const sk = process.env.NEXT_PUBLIC_BUYER_PRIVATE_KEY!;
  const keypair = Keypair.fromSecretKey(bs58.decode(sk));
  return keypair;
};
