import {
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  buyerKeypair,
  connection,
  programAddress,
  sellerKeypair,
} from "../config";
import {
  historyManagerProgram,
  historyManagerProgramAddress,
} from "./historyManagerConfig";
import {
  getUserEveryDayTradeRecordState,
  marketEverydayTradeState,
} from "./historyPda";
import { web3, BN } from "@project-serum/anchor";
import { program } from "@project-serum/anchor/dist/cjs/spl/associated-token";
import { accessManagerAddress } from "../access manager/accessManagerConfig";
import {
  getAccessManagerStatePda,
  getProgramAccessAccountPda,
} from "../access manager/accessManagerPda";
import { marketplaceSOLProgramID } from "../marketplace sol/marketplaceSOLConfig";

export const createHistoryBook = async () => {
  console.log("instruction::create_history_book");

  const insList: TransactionInstruction[] = [];
  const user = await buyerKeypair();
  const end_day_timestamp = new Date();
  end_day_timestamp.setHours(0, 0, 0, 0);

  const [userEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    user.publicKey,
    new BN(end_day_timestamp.getTime() / 1000)
  );

  const [marketEverydayTradeStatePda] = marketEverydayTradeState(
    new BN(`${end_day_timestamp.getTime() / 1000}`)
  );

  const [programAccessAccount, _] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  console.log(
    "userEveryDayTradeStatePda",
    userEveryDayTradeStatePda.toBase58()
  );
  console.log(
    "marketEverydayTradeStatePda",
    marketEverydayTradeStatePda.toBase58()
  );

  const ins = await historyManagerProgram.methods
    .createUserTradeState(
      new BN(`${end_day_timestamp.getTime() / 1000}`),
      0,
      new BN(LAMPORTS_PER_SOL),
      new BN(LAMPORTS_PER_SOL),
      0.0,
      new BN(LAMPORTS_PER_SOL)
    )
    .accounts({
      userEveydayTradeState: userEveryDayTradeStatePda,
      user: user.publicKey,
      payer: user.publicKey,
      systemProgram: SystemProgram.programId,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      programAccessState: programAccessAccount,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: user.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([user]);

  const simulated = await connection.simulateTransaction(transaction);
  console.log("simulated", simulated);

  // const tx = await connection.sendTransaction(transaction);

  // console.log("transaciton broadcasted", tx);

  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed transaction", tx);
};

export const decodeHistoryState = async () => {
  const user = await sellerKeypair();
};
