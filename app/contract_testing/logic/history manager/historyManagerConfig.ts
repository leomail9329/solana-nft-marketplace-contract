import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { connection } from "../config";
import IDL from "./historyManagerIDL.json";
import { HistoryManager } from "./historyManagerType";

const anchorWallet: any = Keypair.generate();
const provider = new anchor.AnchorProvider(connection, anchorWallet, {});

const historyManagerprogramIDL: any = IDL;

export const historyManagerProgramAddress = new PublicKey(IDL.metadata.address);

export const historyManagerProgram = new anchor.Program(
  historyManagerprogramIDL,
  historyManagerProgramAddress,
  provider
) as anchor.Program<HistoryManager>;
