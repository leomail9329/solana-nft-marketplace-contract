import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import { connection, sellerKeypair } from "../config";
import { accessManagerProgram } from "./accessManagerConfig";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

import { IdlTypes, BN } from "@project-serum/anchor";
import { AccessManager } from "./accessManagerType";
import {
  getAccessManagerStatePda,
  getProgramAccessAccountPda,
} from "./accessManagerPda";

import { levelManagerKeypair } from "../config";
import { marketplaceSOLProgramID } from "../marketplace sol/marketplaceSOLConfig";

export const InitAccessManager = async () => {
  console.log("instruction::init_access_manager");
  const user = await levelManagerKeypair();

  let insList: TransactionInstruction[] = [];

  const [accessManagerState] = getAccessManagerStatePda();

  const ins = await accessManagerProgram.methods
    .initAccessManagerOwnership()
    .accounts({
      accessManagerState: accessManagerState,
      accessManagerOwner: user.publicKey,
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

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log(simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaction broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });
  console.log("transaction confirmed", tx);
};

export const transferOwnership = async () => {
  console.log("instruction::transfer_ownership");
  const user = await levelManagerKeypair();

  let insList: TransactionInstruction[] = [];

  const [accessManagerState] = getAccessManagerStatePda();

  const ins = await accessManagerProgram.methods
    .transferAccessManagerOwnership(Keypair.generate().publicKey)
    .accounts({
      accessManagerState: accessManagerState,
      accessManagerOwner: user.publicKey,
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
  // console.log("transaction confirmed", tx);
};

export const grantAccess = async () => {
  console.log("instruction::grant_access");
  const user = await levelManagerKeypair();

  let insList: TransactionInstruction[] = [];

  const [accessManagerState] = getAccessManagerStatePda();

  let [programAccessAccount] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  const ins = await accessManagerProgram.methods
    .grantAccessToProgram()
    .accounts({
      programAccessAccount: programAccessAccount,
      accessManagerState: accessManagerState,
      accessManagerOwner: user.publicKey,
      systemProgram: SystemProgram.programId,
      program: marketplaceSOLProgramID,
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

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log(simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaction broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });
  console.log("transaction confirmed", tx);
};

export const decodeAccessManagerState = async () => {
  console.log("instuction::decode_access_manager");
  const [accessManagerState] = getAccessManagerStatePda();
  const response =
    await accessManagerProgram.account.accessMemberOwnerState.fetch(
      accessManagerState
    );

  console.log("accessManagerOwner", response.accessManagerOwner.toBase58());
};

export const decodeProgramAccessAccount = async () => {
  console.log("instuction:decode_program_access_manager");

  const [programAccessState] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );
  const response = await accessManagerProgram.account.programAccessState.fetch(
    programAccessState
  );
  console.log("hasAccess", response.hasAccess);
  console.log("program", response.program.toBase58());
};

export const revokeAccess = async () => {
  console.log("instruction::revoke_access");
  const user = await levelManagerKeypair();

  let insList: TransactionInstruction[] = [];

  const [accessManagerState] = getAccessManagerStatePda();

  let [programAccessAccount] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  const ins = await accessManagerProgram.methods
    .revokeAccessToProgram(marketplaceSOLProgramID)
    .accounts({
      accessManagerState: accessManagerState,
      programAccessAccount: programAccessAccount,
      accessManagerOwner: user.publicKey,
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

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log(simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaction broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });
  console.log("transaction confirmed", tx);
};

export const closeAccessManager = async () => {
  console.log("instruction::close_access_manager");
  const user = await levelManagerKeypair();

  let insList: TransactionInstruction[] = [];

  const [accessManagerState] = getAccessManagerStatePda();

  const ins = await accessManagerProgram.methods
    .closeAccessManagerOwnership()
    .accounts({
      accessManagerState: accessManagerState,
      accessManagerOwner: user.publicKey,
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
  // console.log("transaction confirmed", tx);
};

export const closeProgramAccessAccount = async () => {
  console.log("instruction::close_program_access_account");
  const user = await levelManagerKeypair();

  let insList: TransactionInstruction[] = [];

  const [accessManagerState] = getAccessManagerStatePda();

  const ins = await accessManagerProgram.methods
    .closeAccessManagerOwnership()
    .accounts({
      accessManagerState: accessManagerState,
      accessManagerOwner: user.publicKey,
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
  // console.log("transaction confirmed", tx);
};
