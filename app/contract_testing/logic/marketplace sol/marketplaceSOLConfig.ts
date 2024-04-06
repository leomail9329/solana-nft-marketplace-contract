import bs58 from "bs58";
import { PublicKey, Keypair } from "@solana/web3.js";
import idl from "./marketplaceSOLIDL.json";
import * as anchor from "@project-serum/anchor";
import { connection } from "../config";
import { MarketplaceSol } from "./marketplaceSOLType";

export const marketplaceSOLProgramID = new PublicKey(idl.metadata.address);

// const anchorWallet: any = Keypair.generate();
const sk =
  "mjscSouFove7dByjWG8yadueXxAyVt1cqsT76gt359BJneZQg8AqitFxTimBkXzSuNv3m3uAj24MF83yRrnYegs";
const anchorWallet: any = Keypair.fromSecretKey(bs58.decode(sk));
const provider = new anchor.AnchorProvider(connection, anchorWallet, {});
const marketplaceSOLIDL: any = idl;

export const marketplaceSOLProgram = new anchor.Program(
  marketplaceSOLIDL,
  marketplaceSOLProgramID,
  provider
) as anchor.Program<MarketplaceSol>;
