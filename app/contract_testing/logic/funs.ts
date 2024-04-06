import {
  connection,
  occsProgram,
  levelManagerKeypair,
  sellerKeypair,
} from "./config";
import { getOccsManagerStatePda, getUserOccStatePda } from "./pda";
import { BN } from "@project-serum/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { getProgramAccessAccountPda } from "./access manager/accessManagerPda";
import { marketplaceSOLProgramID } from "./marketplace sol/marketplaceSOLConfig";
import { PublicKey } from "@metaplex-foundation/js";

export const initOccManagerAccount = async () => {
  console.log("instruction::init_occs_manager");
  const user = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];

  const [occsManagerState, bump] = getOccsManagerStatePda();

  const ins = await occsProgram.methods
    .initOccsManagerState(new PublicKey(occsManagerState.toBase58()))
    .accounts({
      occsManagerState: new PublicKey(occsManagerState.toBase58()),
      occsManagerOwner: user.publicKey,
      systemProgram: SystemProgram.programId,
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
  console.log(simulated);

  // const tx = await connection.sendTransaction(transaction);
  // console.log("transaction broadcasted", tx);
  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed tx", tx);
};

export const decodeOccsManagerAccount = async () => {
  console.log("decode level manager state");
  const [occsManagerPda, bump] = getOccsManagerStatePda();
  const repsonse = await occsProgram.account.occsManagerOwnerShipState.fetch(
    occsManagerPda
  );
  console.log("creditManagerOwner", repsonse.occsManagerOwner.toBase58());
};

export const transferOccsOwnership = async () => {
  console.log("instruction::transfer_occs_ownership");
  const user = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];
  const [occsManagerPda, bump] = getOccsManagerStatePda();

  const ins = await occsProgram.methods
    .transferOccsManagerOwnership(Keypair.generate().publicKey)
    .accounts({
      occsManagerState: occsManagerPda,
      occsManagerOwner: user.publicKey,
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
  console.log(simulated);

  // const tx = await connection.sendTransaction(transaction);
  // console.log("transaction broadcasted", tx);
  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed tx", tx);
};

export const closeOccsManagerState = async () => {
  console.log("instruction::transfer_occs_ownership");
  const user = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];
  const [occsManagerPda, bump] = getOccsManagerStatePda();

  const ins = await occsProgram.methods
    .closeOccsManagerState()
    .accounts({
      occsManagerState: occsManagerPda,
      occsManagerOwner: user.publicKey,
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
  console.log(simulated);

  // const tx = await connection.sendTransaction(transaction);
  // console.log("transaction broadcasted", tx);
  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed tx", tx);
};

export const increaseOccsScore = async () => {
  console.log("instruction::increase_occs_score");

  const user = await sellerKeypair();

  let insList: TransactionInstruction[] = [];

  const [userOccsStatePda, bump] = getUserOccStatePda(user.publicKey);
  const [programAccessAccount, _] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  const ins = await occsProgram.methods
    .increaseOccsScore(0, new BN(LAMPORTS_PER_SOL), new BN(LAMPORTS_PER_SOL))
    .accounts({
      userOccsState: userOccsStatePda,
      user: user.publicKey,
      payer: user.publicKey,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      programAccessState: programAccessAccount,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();
  const msg = new TransactionMessage({
    payerKey: user.publicKey,
    instructions: insList,
    recentBlockhash: rb.blockhash,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([user]);

  const simulated = await connection.simulateTransaction(transaction);
  console.log(simulated);

  // const tx = await connection.sendTransaction(transaction);

  // console.log("transaction broadcasted", tx);
  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed tx", tx);
};

export const decreaseOccsScore = async () => {
  console.log("instruction::decrease_occs_score");

  const user = await sellerKeypair();

  let insList: TransactionInstruction[] = [];

  const [userOccsStatePda, bump] = getUserOccStatePda(user.publicKey);
  const [programAccessAccount, _] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  const ins = await occsProgram.methods
    .decreaseOccsScore(new BN(LAMPORTS_PER_SOL))
    .accounts({
      userOccsState: userOccsStatePda,
      user: user.publicKey,
      payer: user.publicKey,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      programAccessState: programAccessAccount,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();
  const msg = new TransactionMessage({
    payerKey: user.publicKey,
    instructions: insList,
    recentBlockhash: rb.blockhash,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([user]);

  const simulated = await connection.simulateTransaction(transaction);
  console.log(simulated);

  // const tx = await connection.sendTransaction(transaction);

  // console.log("transaction broadcasted", tx);
  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed tx", tx);
};
