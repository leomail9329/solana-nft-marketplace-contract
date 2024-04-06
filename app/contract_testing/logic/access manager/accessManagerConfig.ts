import { Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { connection } from "../config";
import { AccessManager } from "./accessManagerType";
import IDL from "./accessManagerIDL.json";

export const accessManagerAddress = IDL.metadata.address;
export const accessManagerIDL: any = IDL;

const anchorWallet: any = Keypair.generate();
const provider = new anchor.AnchorProvider(connection, anchorWallet, {});

export const accessManagerProgram = new anchor.Program(
  accessManagerIDL,
  accessManagerAddress,
  provider
) as anchor.Program<AccessManager>;
