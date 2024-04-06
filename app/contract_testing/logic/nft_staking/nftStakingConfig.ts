import { PublicKey, Keypair } from "@solana/web3.js";
import idl from "./nftStakingIDL.json";
import * as anchor from "@project-serum/anchor";
import { connection } from "../config";
import { NftStakingContract } from "./nftStakingType";

export const nftStakingProgramID = new PublicKey(idl.metadata.address);

const anchorWallet: any = Keypair.generate();
const provider = new anchor.AnchorProvider(connection, anchorWallet, {});
const nftStakingIDL: any = idl;

export const nftStakingProgram = new anchor.Program(
  nftStakingIDL,
  nftStakingProgramID,
  provider
) as anchor.Program<NftStakingContract>;
