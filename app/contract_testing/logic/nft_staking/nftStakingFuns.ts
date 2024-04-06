import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { connection, levelManagerKeypair, sellerKeypair } from "../config";
import { nftStakingProgram } from "./nftStakingConfig";
import {
  getCollectionConfigPda,
  getPercentageTrackerPda,
  getProgramStakingAuthPda,
  getStakeStatePda,
  getStakedNFTTrackerPda,
  getStakingManagerPda,
  getStakingVaultPda,
  getUserClimedState,
} from "./nftStakingPda";

import { BN } from "@project-serum/anchor";
import { getMetadataPda } from "../pda";
import { Metaplex, assertNft } from "@metaplex-foundation/js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { NFT_MINT } from "../marketplace sol/marketplaceSOLConstant";
import { STAKING_NFT } from "./staking_constants";
import { DUMMY_END_TIME } from "../constants";
import { marketEverydayTradeState } from "../history manager/historyPda";

const metaplex = Metaplex.make(connection);

const nftModule = metaplex.nfts();

export const initNFTStakingManager = async () => {
  console.log("instruction::init_nft_staking_manager");
  const manager = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];
  const [stakingManagerPda] = getStakingManagerPda();
  const [percentageTrackerPda] = getPercentageTrackerPda(stakingManagerPda);

  const ins = await nftStakingProgram.methods
    .initStakingManager()
    .accounts({
      stakingManager: manager.publicKey,
      stakingManagerState: stakingManagerPda,
      percentageTrackerState: percentageTrackerPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: manager.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([manager]);

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

export const transferNftSTakingManagerOwnership = async () => {
  console.log("instruction::transfer_ownership");

  const manager = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];
  const [stakingManagerPda] = getStakingManagerPda();

  const ins = await nftStakingProgram.methods
    .transferManagerOwnership(Keypair.generate().publicKey)
    .accounts({
      stakingManager: manager.publicKey,
      stakingManagerState: stakingManagerPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: manager.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([manager]);

  const simulated = await connection.simulateTransaction(transaction);
  console.log("simulated", simulated);

  //   const tx = await connection.sendTransaction(transaction);

  //   console.log("transaciton broadcasted", tx);

  //   await connection.confirmTransaction({
  //     signature: tx,
  //     blockhash: rb.blockhash,
  //     lastValidBlockHeight: rb.lastValidBlockHeight,
  //   });

  //   console.log("confirmed transaction", tx);
};

export const initCollectionConfig = async () => {
  console.log("instruction::init_collection_config");
  const manager = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];
  const [stakingManagerPda] = getStakingManagerPda();
  const [percentageTrackerPda] = getPercentageTrackerPda(stakingManagerPda);

  const collection = new PublicKey(
    "D1pBop8HMVZVeVr9Nqtj4AJHYsAmquUSTZE3U6jvnzV1"
  );

  const [metdataAccount] = getMetadataPda(collection);

  const [collectionConfigStatePda] = getCollectionConfigPda(metdataAccount);

  const [stakedNFTTrackerPda] = getStakedNFTTrackerPda(
    collectionConfigStatePda
  );

  const ins = await nftStakingProgram.methods
    .initCollectionConfig(10000) // divided by 100
    .accounts({
      stakingManagerState: stakingManagerPda,
      percentageTracker: percentageTrackerPda,
      collectionConfigState: collectionConfigStatePda,
      collectionMetadata: metdataAccount,
      stakingManager: manager.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const insTwo = await nftStakingProgram.methods
    .initStakedNftTracker()
    .accounts({
      stakingManagerState: stakingManagerPda,
      stakedNftTracker: stakedNFTTrackerPda,
      collectionConfigState: collectionConfigStatePda,
      collectionMetadata: metdataAccount,
      stakingManager: manager.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);
  // insList.push(insTwo);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: manager.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([manager]);

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log("simulated", simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaciton broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });

  console.log("confirmed transaction", tx);
};

export const decodeCollectionConfig = async () => {
  console.log("instruction::decode_collection_config");
  const collection = new PublicKey(
    "D1pBop8HMVZVeVr9Nqtj4AJHYsAmquUSTZE3U6jvnzV1"
  );

  const [metdataAccount] = getMetadataPda(collection);

  const [collectionConfigStatePda] = getCollectionConfigPda(metdataAccount);
  const response = await nftStakingProgram.account.collectionConfigState.fetch(
    collectionConfigStatePda
  );

  console.log("share %", response.share / 100);
  console.log("collectionMetatdata", response.collectionMetatdata.toString());
};

export const decodePercentageTracker = async () => {
  console.log("instruction::decode_percentage_tracker");
  const [stakingManagerPda] = getStakingManagerPda();
  const [percentageTrackerPda] = getPercentageTrackerPda(stakingManagerPda);
  const response = await nftStakingProgram.account.percentageTrackerState.fetch(
    percentageTrackerPda
  );

  console.log("totalSum %", response.totalSum / 100);
};
export const decodeStakedNFTTracker = async () => {
  console.log("instruction::decode_staked_nft_tracker");
  const collection = new PublicKey(
    "D1pBop8HMVZVeVr9Nqtj4AJHYsAmquUSTZE3U6jvnzV1"
  );

  const [metdataAccount] = getMetadataPda(collection);

  const [collectionConfigStatePda] = getCollectionConfigPda(metdataAccount);

  const [stakedNFTTrackerPda] = getStakedNFTTrackerPda(
    collectionConfigStatePda
  );
  const response = await nftStakingProgram.account.stakedNftTrackerState.fetch(
    stakedNFTTrackerPda
  );

  console.log("numberStaked", response.numberStaked.toString());
  console.log(
    "collectionConfigState",
    response.collectionConfigState.toString()
  );
};

export const transferFromVault = async () => {
  console.log("instruction::transfer_from_vault");
  const manager = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];
  const [stakingManagerPda] = getStakingManagerPda();
  const [stakingVaultPda] = getStakingVaultPda();

  console.log("staking vault", stakingManagerPda.toBase58());

  const ins = await nftStakingProgram.methods
    .transferFromVault(1, new BN(LAMPORTS_PER_SOL))
    .accounts({
      stakingManager: manager.publicKey,
      stakingVault: stakingVaultPda,
      stakingManagerState: stakingManagerPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: manager.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([manager]);

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log("simulated", simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaciton broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });

  console.log("confirmed transaction", tx);
};

export const stakingNFT = async () => {
  console.log("instruction::stake");
  const seller = await sellerKeypair();
  const insList: TransactionInstruction[] = [];
  const [programStakeOwnerPda] = getProgramStakingAuthPda();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 3000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  const requetHeap = ComputeBudgetProgram.requestHeapFrame({
    bytes: 256 * 1024,
  });

  insList.push(requetHeap);
  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const sellerSource = await getAssociatedTokenAddress(
    STAKING_NFT,
    seller.publicKey,
    false
  );

  const programDestination = await getAssociatedTokenAddress(
    STAKING_NFT,
    programStakeOwnerPda,
    true
  );
  const [nftMetadataPda] = getMetadataPda(STAKING_NFT);

  const [stakeStatePda] = getStakeStatePda(seller.publicKey, nftMetadataPda);

  const collection = new PublicKey(
    "D1pBop8HMVZVeVr9Nqtj4AJHYsAmquUSTZE3U6jvnzV1"
  );

  const [metdataAccount] = getMetadataPda(collection);

  const [collectionConfigStatePda] = getCollectionConfigPda(metdataAccount);
  const [stakedNFTTrackerPda] = getStakedNFTTrackerPda(
    collectionConfigStatePda
  );

  const ins = await nftStakingProgram.methods
    .stakeNft()
    .accounts({
      stakeState: stakeStatePda,
      user: seller.publicKey,
      stakedNftTracker: stakedNFTTrackerPda,
      programAuth: programStakeOwnerPda,
      source: sellerSource,
      destination: programDestination,
      nftMint: STAKING_NFT,
      nftMetadata: nftMetadataPda,
      collectionConfig: collectionConfigStatePda,
      collectionMetadata: metdataAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedProgram: ASSOCIATED_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: seller.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([seller]);

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log("simulated", simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaciton broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });

  console.log("confirmed transaction", tx);
};

export const decodeStakeState = async () => {
  console.log("instruction::decode_state_state");
  const seller = await sellerKeypair();
  const [nftMetadataPda] = getMetadataPda(STAKING_NFT);
  const [stakeStatePda] = getStakeStatePda(seller.publicKey, nftMetadataPda);

  const response = await nftStakingProgram.account.stakeState.fetch(
    stakeStatePda
  );

  console.log("startTime", response.startTime);
  console.log(
    "startTime",
    response.totalRewardClaimed.toNumber() / LAMPORTS_PER_SOL
  );
  console.log("startTime", response.nftMetadata.toBase58());
};

export const claimStakingReward = async () => {
  console.log("instruction::claim_staking_reward");
  const seller = await sellerKeypair();
  const insList: TransactionInstruction[] = [];

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 3000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  const requetHeap = ComputeBudgetProgram.requestHeapFrame({
    bytes: 256 * 1024,
  });

  insList.push(requetHeap);
  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const [stakingVaultPda] = getStakingVaultPda();

  const [nftMetadataPda] = getMetadataPda(STAKING_NFT);

  const [stakeStatePda] = getStakeStatePda(seller.publicKey, nftMetadataPda);

  const collection = new PublicKey(
    "D1pBop8HMVZVeVr9Nqtj4AJHYsAmquUSTZE3U6jvnzV1"
  );

  const [metdataAccount] = getMetadataPda(collection);

  const [collectionConfigStatePda] = getCollectionConfigPda(metdataAccount);

  const [marketEverydayTradeStatePda] =
    marketEverydayTradeState(DUMMY_END_TIME);

  const [userClaimedStatusPda] = getUserClimedState(
    seller.publicKey,
    nftMetadataPda,
    marketEverydayTradeStatePda
  );

  console.log("staking vault", stakingVaultPda.toBase58());

  const [stakedNFTTrackerPda] = getStakedNFTTrackerPda(
    collectionConfigStatePda
  );

  const ins = await nftStakingProgram.methods
    .claim(DUMMY_END_TIME)
    .accounts({
      stakeState: stakeStatePda,
      collectionConfig: collectionConfigStatePda,
      stakedNftTracker: stakedNFTTrackerPda,
      userClaimedStatus: userClaimedStatusPda,
      nftMetadata: nftMetadataPda,
      collectionMetadata: metdataAccount,
      user: seller.publicKey,
      marketTradeState: marketEverydayTradeStatePda,
      stakingVault: stakingVaultPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: seller.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([seller]);

  const simulated = await connection.simulateTransaction(transaction);
  console.log("simulated", simulated);

  //   const tx = await connection.sendTransaction(transaction);

  //   console.log("transaciton broadcasted", tx);

  //   await connection.confirmTransaction({
  //     signature: tx,
  //     blockhash: rb.blockhash,
  //     lastValidBlockHeight: rb.lastValidBlockHeight,
  //   });

  //   console.log("confirmed transaction", tx);
};

export const unstakeNFT = async () => {
  console.log("instruction::unstake");

  const seller = await sellerKeypair();
  const insList: TransactionInstruction[] = [];
  const [programStakeOwnerPda] = getProgramStakingAuthPda();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 3000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  const requetHeap = ComputeBudgetProgram.requestHeapFrame({
    bytes: 256 * 1024,
  });

  insList.push(requetHeap);
  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const sellerSource = await getAssociatedTokenAddress(
    STAKING_NFT,
    seller.publicKey,
    false
  );

  const programDestination = await getAssociatedTokenAddress(
    STAKING_NFT,
    programStakeOwnerPda,
    true
  );
  const [nftMetadataPda] = getMetadataPda(STAKING_NFT);

  const [stakeStatePda] = getStakeStatePda(seller.publicKey, nftMetadataPda);

  const collection = new PublicKey(
    "D1pBop8HMVZVeVr9Nqtj4AJHYsAmquUSTZE3U6jvnzV1"
  );

  const [metdataAccount] = getMetadataPda(collection);

  const [collectionConfigStatePda] = getCollectionConfigPda(metdataAccount);
  const [stakedNFTTrackerPda] = getStakedNFTTrackerPda(
    collectionConfigStatePda
  );

  const ins = await nftStakingProgram.methods
    .unstake()
    .accounts({
      stakeState: stakeStatePda,
      user: seller.publicKey,
      programAuth: programStakeOwnerPda,
      collectionConfig: collectionConfigStatePda,
      collectionMetadata: metdataAccount,
      stakedNftTracker: stakedNFTTrackerPda,
      source: programDestination,
      destination: sellerSource,
      nftMint: STAKING_NFT,
      nftMetadata: nftMetadataPda,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedProgram: ASSOCIATED_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: seller.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([seller]);

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log("simulated", simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaciton broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });

  console.log("confirmed transaction", tx);
};

export const modifyCollectionConfig = async () => {
  console.log("instruction::modify_collection_config");

  const seller = await levelManagerKeypair();
  const insList: TransactionInstruction[] = [];
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 3000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  const requetHeap = ComputeBudgetProgram.requestHeapFrame({
    bytes: 256 * 1024,
  });

  insList.push(requetHeap);
  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const [stakingManagerPda] = getStakingManagerPda();
  const [percentageTrackerPda] = getPercentageTrackerPda(stakingManagerPda);

  const collection = new PublicKey(
    "D1pBop8HMVZVeVr9Nqtj4AJHYsAmquUSTZE3U6jvnzV1"
  );

  const [metdataAccount] = getMetadataPda(collection);

  const [collectionConfigStatePda] = getCollectionConfigPda(metdataAccount);

  const ins = await nftStakingProgram.methods
    .modifyCollectionConfig(10001)
    .accounts({
      stakingManagerState: stakingManagerPda,
      percentageTracker: percentageTrackerPda,
      collectionConfig: collectionConfigStatePda,
      collectionMetadata: metdataAccount,
      stakingManager: seller.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: seller.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([seller]);

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

