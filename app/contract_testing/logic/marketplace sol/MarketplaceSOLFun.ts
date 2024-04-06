import {
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Keypair,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  DUMMY_LISTING_ACCOUNT,
  DUMMY_METADATA_ACCOUNT,
  NFT_MINT,
} from "./marketplaceSOLConstant";
import {
  buyerKeypair,
  connection,
  levelManagerKeypair,
  levelProgramID,
  programAddress,
  sellerKeypair,
} from "../config";
import { getMetadataPda, getUserOccStatePda } from "../pda";
import {
  marketplaceSOLProgram,
  marketplaceSOLProgramID,
} from "./marketplaceSOLConfig";
import { BN, LangErrorCode } from "@project-serum/anchor";
import {
  getDirectOfferState,
  getListingStatePda,
  getMarketplaceState,
  getOfferState,
  getProgramNFTOwnerPda,
  getTradersVaultPda,
  getUserPdaWallet,
  getUserTradeStateMetadataPda,
} from "./marketplaceSOLPda";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  DUMMY_BUYER_TRADE_STATE,
  DUMMY_BUYER_TRADE_STATE_METADATA,
  DUMMY_END_TIME,
  DUMMY_MARKET_TRADE_STATE,
  DUMMY_SELLER_TRADE_STATE,
} from "../constants";
import { getProgramAccessAccountPda } from "../access manager/accessManagerPda";
import { accessManagerAddress } from "../access manager/accessManagerConfig";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

import {
  BundlrError,
  Metaplex,
  bundlrStorage,
  nftModule,
} from "@metaplex-foundation/js";
import {
  historyManagerProgram,
  historyManagerProgramAddress,
} from "../history manager/historyManagerConfig";
import {
  getUserEveryDayTradeRecordState,
  marketEverydayTradeState,
} from "../history manager/historyPda";
import { getStakingVaultPda } from "../nft_staking/nftStakingPda";

const wallet = Keypair.generate();

const metaplex = Metaplex.make(connection);

const end_day_timestamp = new Date();
end_day_timestamp.setHours(0, 0, 0, 0);

const endTime = end_day_timestamp.getTime() / 1000 + 86400;

export const marketplaceSOLList = async () => {
  console.log("instruction::list");

  const insList: TransactionInstruction[] = [];

  const seller = await sellerKeypair();
  const [metadataPda] = getMetadataPda(NFT_MINT);
  // console.log("medata", metadataPda.toBase58());
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const getSellerATA = await connection.getTokenAccountsByOwner(
    seller.publicKey,
    { mint: NFT_MINT }
  );

  if (getSellerATA.value.length === 0) {
    throw Error("Invalid mint address");
  }

  let [programATAOwner] = getProgramNFTOwnerPda(metadataPda);
  let programAta: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    programATAOwner,
    true
  );

  const ataAccountInfo = await connection.getAccountInfo(programAta);

  if (!ataAccountInfo) {
    const preins = createAssociatedTokenAccountInstruction(
      seller.publicKey,
      programAta,
      programATAOwner,
      NFT_MINT
    );
    insList.push(preins);
  }

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const ins = await marketplaceSOLProgram.methods
    .list(new BN(LAMPORTS_PER_SOL), 0)
    .accounts({
      listingState: listingStatePda,
      seller: seller.publicKey,
      nftMint: NFT_MINT,
      nftMetadata: metadataPda,
      sellerNftAta: getSellerATA.value[0].pubkey,
      prgramNftAta: programAta,
      systemProgram: SystemProgram.programId,
      tokenProgramId: TOKEN_PROGRAM_ID,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: seller.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  console.log("listing_state",listingStatePda.toBase58())
  console.log("seller.publicKey",seller.publicKey.toBase58())
  console.log("metadataPda",metadataPda.toBase58())
  console.log("programAta",programAta.toBase58())

  const transaction = new VersionedTransaction(msg);
  transaction.sign([seller]);

  const simulated = await connection.simulateTransaction(transaction);
  console.log("simulated", simulated);

  const tx = await connection.sendTransaction(transaction);

  console.log("transaciton broadcasted", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });

  console.log("confirmed transaction", tx);
};

export const decodeListingState = async () => {
  const seller = await sellerKeypair();
  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);
  const reponse = await marketplaceSOLProgram.account.listingState.fetch(
    listingStatePda
  );

  console.log("allowedRoyalty ", reponse.allowedRoyalty / 100, "%");
  console.log("amount", reponse.amount.toNumber() / 10 ** 9);
  console.log("isSold", reponse.isSold);
  console.log("nftMetadata", reponse.nftMetadata.toBase58());
  console.log("seller", reponse.seller.toBase58());
  return reponse;
};

export const marketplaceSOLUpdateListing = async () => {
  console.log("instruction::update_listing");

  const insList: TransactionInstruction[] = [];

  const seller = await sellerKeypair();
  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const ins = await marketplaceSOLProgram.methods
    .updateListing(new BN(`${LAMPORTS_PER_SOL / 2}`), 500)
    .accounts({
      listingState: listingStatePda,
      seller: seller.publicKey,
      nftMint: NFT_MINT,
      nftMetadata: metadataPda,
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

export const marketplaceSOLCancelListing = async () => {
  console.log("instruction::cancel_listing");

  const insList: TransactionInstruction[] = [];

  const seller = await sellerKeypair();
  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const getSellerATA = await connection.getTokenAccountsByOwner(
    seller.publicKey,
    { mint: NFT_MINT }
  );

  if (getSellerATA.value.length === 0) {
    throw Error("Invalid mint address");
  }

  let [programATAOwner] = getProgramNFTOwnerPda(metadataPda);
  let programAta: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    programATAOwner,
    true
  );

  const ataAccountInfo = await connection.getAccountInfo(programAta);

  if (!ataAccountInfo) {
    const preins = createAssociatedTokenAccountInstruction(
      seller.publicKey,
      programAta,
      programATAOwner,
      NFT_MINT
    );
    insList.push(preins);
  }

  const ins = await marketplaceSOLProgram.methods
    .cancelListing()
    .accounts({
      listingState: listingStatePda,
      seller: seller.publicKey,
      nftMint: NFT_MINT,
      nftMetadata: metadataPda,
      sellerNftAta: getSellerATA.value[0].pubkey,
      prgramNftAta: programAta,
      programNftPdaOwner: programATAOwner,
      tokenProgramId: TOKEN_PROGRAM_ID,
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

export const marketplaceSOLBuyNow = async () => {
  console.log("instruction::buy_now");
  const buyer = await buyerKeypair();
  const insList: TransactionInstruction[] = [];

  const level_manager = await levelManagerKeypair();
  const seller = await sellerKeypair();
  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  let [programATAOwner] = getProgramNFTOwnerPda(metadataPda);
  let programAta: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    programATAOwner,
    true
  );

  let buyerATA: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    buyer.publicKey
  );

  const ataAccountInfo = await connection.getAccountInfo(buyerATA);

  if (!ataAccountInfo) {
    const preins = createAssociatedTokenAccountInstruction(
      buyer.publicKey,
      buyerATA,
      buyer.publicKey,
      NFT_MINT
    );
    insList.push(preins);
  }

  const creatorInfo = await getNFTCreatorAccounts();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const [programAccessAccount, _] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  const [sellerEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    seller.publicKey,
    new BN(endTime)
  );

  const [buyerEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    buyer.publicKey,
    new BN(endTime)
  );

  const [marketEverydayTradeStatePda] = marketEverydayTradeState(
    new BN(`${endTime}`)
  );

  console.log(
    "sellerEveryDayTradeStatePda",
    sellerEveryDayTradeStatePda.toBase58()
  );

  console.log(
    "buyerEveryDayTradeStatePda",
    buyerEveryDayTradeStatePda.toBase58()
  );

  console.log(
    "marketEverydayTradeStatePda",
    marketEverydayTradeStatePda.toBase58()
  );

  // console.log("end_day_timestamp", end_day_timestamp.getTime() / 1000);

  const [sellerOccsStatePda] = getUserOccStatePda(seller.publicKey);
  const [buyerOccsStatePda] = getUserOccStatePda(buyer.publicKey);

  const [traders_vault] = getTradersVaultPda();

  console.log("endtime", endTime);

  const [sellerTradeStateMetadata] = getUserTradeStateMetadataPda(
    sellerEveryDayTradeStatePda
  );

  const [buyerTradeStateMetadata] = getUserTradeStateMetadataPda(
    buyerEveryDayTradeStatePda
  );

  const [stakingVault] = getStakingVaultPda();

  console.log("buyerTradeStateMetadata", buyerTradeStateMetadata.toBase58());

  console.log("sellerTradeStateMetadata", sellerTradeStateMetadata.toBase58());

  const ins = await marketplaceSOLProgram.methods
    .buyNow(new BN(`${endTime}`))
    .accounts({
      listingState: listingStatePda,
      sellerTradeStateMetadata: sellerTradeStateMetadata,
      buyerTradeStateMetadata: buyerTradeStateMetadata,
      seller: seller.publicKey,
      nftMetadata: metadataPda,
      buyer: buyer.publicKey,
      prgramNftAta: programAta,
      buyerNftAta: buyerATA,
      programNftPdaOwner: programATAOwner,
      tokenProgramId: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      teamMultisigVault: level_manager.publicKey,
      traderVault: traders_vault,
      stakingVault: stakingVault,
      programAccessState: programAccessAccount,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      historyManager: historyManagerProgramAddress,
      buyerEveryDayTradeState: buyerEveryDayTradeStatePda,
      sellerEveryDayTradeState: sellerEveryDayTradeStatePda,
      marketEveryDayTradeState: marketEverydayTradeStatePda,
      occsManager: levelProgramID,
      sellerOccsState: sellerOccsStatePda,
      buyerOccsState: buyerOccsStatePda,
    })
    .remainingAccounts(creatorInfo)
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

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

export const getNFTCreatorAccounts = async () => {
  let creatorsInfo = [];

  const mint = await metaplex.nfts().findByMint({
    mintAddress: NFT_MINT,
  });

  for (let creator of mint.creators) {
    creatorsInfo.push({
      pubkey: creator.address,
      isSigner: false,
      isWritable: true,
    });
  }
  return creatorsInfo;
};

export const fundWithdrawPdaWallet = async () => {
  console.log("instruction::fund_withdraw_pda");
  const buyer = await buyerKeypair();
  const insList: TransactionInstruction[] = [];
  const [usePdaWalletPda] = getUserPdaWallet(buyer.publicKey);
  console.log(usePdaWalletPda.toString());

  const ins = await marketplaceSOLProgram.methods
    .fundWithdrawPdaWallet(1, new BN(`${LAMPORTS_PER_SOL}`)) // minimum LAMPORTS_PER_SOL * 0.001
    .accounts({
      userPdaWallet: usePdaWalletPda,
      user: buyer.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

  console.log("user pda wallet ", usePdaWalletPda.toBase58());

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

export const makeOffer = async () => {
  console.log("instruction::make_offer");

  const seller = await sellerKeypair();
  const buyer = await buyerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const insList: TransactionInstruction[] = [];

  const current_time = Date.now();

  const endtime = current_time / 1000 + 3600;

  const respone = await marketplaceSOLProgram.account.listingState.fetch(
    listingStatePda
  );

  const [offerStatePda] = getOfferState(
    buyer.publicKey,
    respone.nftMetadata,
    listingStatePda
  );

  const [usePdaWalletPda] = getUserPdaWallet(buyer.publicKey);

  const metdata_account_info = await connection.getAccountInfo(
    respone.nftMetadata
  );

  const decoded_metdata = Metadata.fromAccountInfo(metdata_account_info!)[0];

  const ins = await marketplaceSOLProgram.methods
    .makeOffer(new BN(LAMPORTS_PER_SOL / 2), new BN(endtime))
    .accounts({
      listingState: listingStatePda,
      offerState: offerStatePda,
      buyerPdaWallet: usePdaWalletPda,
      buyer: buyer.publicKey,
      nftMint: decoded_metdata.mint,
      seller: respone.seller,
      nftMetadata: respone.nftMetadata,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

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

export const decodeOfferState = async () => {
  console.log("instruction::decode_offer_state");

  const seller = await sellerKeypair();
  const buyer = await buyerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const respone = await marketplaceSOLProgram.account.listingState.fetch(
    listingStatePda
  );

  const [offerStatePda] = getOfferState(
    buyer.publicKey,
    respone.nftMetadata,
    listingStatePda
  );

  const reponse = await marketplaceSOLProgram.account.offerState.fetch(
    offerStatePda
  );

  console.log("isExpired", reponse.isExpired);
  console.log("endtime", reponse.endtime.toNumber());
  console.log("offeredAmount", reponse.offeredAmount.toNumber() / 10 ** 9);
  console.log("listingState", reponse.listingState.toBase58());
};

export const updateOffer = async () => {
  console.log("instruction::update_offer");

  const seller = await sellerKeypair();
  const buyer = await buyerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const insList: TransactionInstruction[] = [];

  const current_time = Date.now();

  const endtime = current_time / 1000 + 600;

  const respone = await marketplaceSOLProgram.account.listingState.fetch(
    listingStatePda
  );

  const [offerStatePda] = getOfferState(
    buyer.publicKey,
    respone.nftMetadata,
    listingStatePda
  );

  const [usePdaWalletPda] = getUserPdaWallet(buyer.publicKey);

  const metdata_account_info = await connection.getAccountInfo(
    respone.nftMetadata
  );

  const decoded_metdata = Metadata.fromAccountInfo(metdata_account_info!)[0];

  const ins = await marketplaceSOLProgram.methods
    .updateOffer(new BN(LAMPORTS_PER_SOL * 0.0001), new BN(endtime))
    .accounts({
      listingState: listingStatePda,
      offerState: offerStatePda,
      buyerPdaWallet: usePdaWalletPda,
      buyer: buyer.publicKey,
      nftMint: decoded_metdata.mint,
      seller: respone.seller,
      nftMetadata: respone.nftMetadata,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

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

export const closeOffer = async () => {
  console.log("instruction::close_offer");

  const seller = await sellerKeypair();
  const buyer = await buyerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const insList: TransactionInstruction[] = [];

  // const respone = await marketplaceSOLProgram.account.listingState.fetch(
  //   listingStatePda
  // );

  const [offerStatePda] = getOfferState(
    buyer.publicKey,
    metadataPda,
    listingStatePda
  );

  const metdata_account_info = await connection.getAccountInfo(metadataPda);

  const decoded_metdata = Metadata.fromAccountInfo(metdata_account_info!)[0];

  const ins = await marketplaceSOLProgram.methods
    .closeOffer()
    .accounts({
      listingState: listingStatePda,
      offerState: offerStatePda,
      buyer: buyer.publicKey,
      nftMint: decoded_metdata.mint,
      seller: seller.publicKey,
      nftMetadata: metadataPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

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

export const acceptOffer = async () => {
  console.log("instruction::accept_offer");

  const seller = await sellerKeypair();
  const buyer = await buyerKeypair();
  const level_manager = await levelManagerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [listingStatePda] = getListingStatePda(seller.publicKey, metadataPda);

  const insList: TransactionInstruction[] = [];

  const respone = await marketplaceSOLProgram.account.listingState.fetch(
    listingStatePda
  );

  const [offerStatePda] = getOfferState(
    buyer.publicKey,
    respone.nftMetadata,
    listingStatePda
  );

  const metdata_account_info = await connection.getAccountInfo(
    respone.nftMetadata
  );

  const [buyerPdaWallet] = getUserPdaWallet(buyer.publicKey);

  const decoded_metdata = Metadata.fromAccountInfo(metdata_account_info!)[0];

  let [programATAOwner] = getProgramNFTOwnerPda(metadataPda);
  let programAta: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    programATAOwner,
    true
  );

  let buyerATA: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    buyer.publicKey
  );

  const ataAccountInfo = await connection.getAccountInfo(buyerATA);
  const creatorInfo = await getNFTCreatorAccounts();

  if (!ataAccountInfo) {
    const preins = createAssociatedTokenAccountInstruction(
      seller.publicKey,
      buyerATA,
      buyer.publicKey,
      NFT_MINT
    );
    insList.push(preins);
  }

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const [programAccessAccount, _] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  const [sellerEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    seller.publicKey,
    new BN(endTime)
  );

  const [buyerEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    buyer.publicKey,
    new BN(endTime)
  );

  const [marketEverydayTradeStatePda] = marketEverydayTradeState(
    new BN(endTime)
  );

  const [sellerOccsStatePda] = getUserOccStatePda(seller.publicKey);
  const [buyerOccsStatePda] = getUserOccStatePda(buyer.publicKey);

  const [traders_vault] = getTradersVaultPda();
  const [sellerTradeStateMetadata] = getUserTradeStateMetadataPda(
    sellerEveryDayTradeStatePda
  );

  const [buyerTradeStateMetadata] = getUserTradeStateMetadataPda(
    buyerEveryDayTradeStatePda
  );

  const [stakingVault] = getStakingVaultPda();

  const ins = await marketplaceSOLProgram.methods
    .acceptOffer(new BN(endTime))
    .accounts({
      listingState: listingStatePda,
      offerState: offerStatePda,
      buyerPdaWallet: buyerPdaWallet,
      sellerTradeStateMetadata: sellerTradeStateMetadata,
      buyerTradeStateMetadata: buyerTradeStateMetadata,
      buyer: buyer.publicKey,
      seller: seller.publicKey,
      nftMetadata: respone.nftMetadata,
      systemProgram: SystemProgram.programId,
      prgramNftAta: programAta,
      programNftPdaOwner: programATAOwner,
      tokenProgramId: TOKEN_PROGRAM_ID,
      buyerNftAta: buyerATA,
      teamMultisigVault: level_manager.publicKey,
      traderVault: traders_vault,
      stakingVault: stakingVault,
      programAccessState: programAccessAccount,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      historyManager: historyManagerProgramAddress,

      buyerEveryDayTradeState: buyerEveryDayTradeStatePda,
      sellerEveryDayTradeState: sellerEveryDayTradeStatePda,
      marketEveryDayTradeState: marketEverydayTradeStatePda,

      occsManager: levelProgramID,
      sellerOccsState: sellerOccsStatePda,
      buyerOccsState: buyerOccsStatePda,
    })
    .remainingAccounts(creatorInfo)
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

  // console.log("his", level_manager.publicKey.toBase58());

  const simulated = await connection.simulateTransaction(transaction);
  console.log(simulated);

  // const tx = await connection.sendTransaction(transaction);
  // console.log("transaciton broadcasted ", tx);
  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });
  // console.log("confirmed transaction", tx);
};
export const createDirectOffer = async () => {
  console.log("instruction::create_direct_offer");

  const buyer = await buyerKeypair();
  const seller = await sellerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [directOfferStatePda] = getDirectOfferState(
    buyer.publicKey,
    metadataPda
  );

  const insList: TransactionInstruction[] = [];

  const current_time = new Date();

  const endtime = current_time.getTime() / 1000 + 3600;

  const [usePdaWalletPda] = getUserPdaWallet(buyer.publicKey);

  console.log("user pda wallet", usePdaWalletPda.toBase58());

  const sellerAta = await getAssociatedTokenAddress(NFT_MINT, seller.publicKey);

  const ins = await marketplaceSOLProgram.methods
    .createDirectOffer(new BN(LAMPORTS_PER_SOL * 0.0001), new BN(endtime))
    .accounts({
      directOfferState: directOfferStatePda,
      nftMint: NFT_MINT,
      buyer: buyer.publicKey,
      nftMetadata: metadataPda,
      buyerPdaWallet: usePdaWalletPda,
      systemProgram: SystemProgram.programId,
      seller: seller.publicKey,
      sellerNftAta: sellerAta,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

  // const simulated = await connection.simulateTransaction(transaction);
  // console.log("simulated", simulated);

  const tx = await connection.sendTransaction(transaction);
  console.log("transaction send", tx);

  await connection.confirmTransaction({
    signature: tx,
    blockhash: rb.blockhash,
    lastValidBlockHeight: rb.lastValidBlockHeight,
  });

  console.log("confirmed transaction", tx);
};

export const updateDirectOffer = async () => {
  console.log("instruction::update_direct_offer");

  const buyer = await buyerKeypair();
  const seller = await sellerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [directOfferStatePda] = getDirectOfferState(
    buyer.publicKey,
    metadataPda
  );

  const insList: TransactionInstruction[] = [];

  const current_time = Date.now();

  const endtime = current_time / 1000 + 300;

  const [usePdaWalletPda] = getUserPdaWallet(buyer.publicKey);

  const sellerAta = await getAssociatedTokenAddress(NFT_MINT, seller.publicKey);

  const ins = await marketplaceSOLProgram.methods
    .createDirectOffer(new BN(LAMPORTS_PER_SOL * 0.0001), new BN(endtime))
    .accounts({
      directOfferState: directOfferStatePda,
      nftMint: NFT_MINT,
      buyer: buyer.publicKey,
      nftMetadata: metadataPda,
      buyerPdaWallet: usePdaWalletPda,
      systemProgram: SystemProgram.programId,
      seller: seller.publicKey,
      sellerNftAta: sellerAta,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

  const simulated = await connection.simulateTransaction(transaction);
  console.log("simulated", simulated);

  // const tx = await connection.sendTransaction(transaction);

  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed transaction", tx);
};

export const closeDirectOffer = async () => {
  console.log("instruction::close_direct_offer");

  const insList: TransactionInstruction[] = [];

  const buyer = await buyerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [directOfferStatePda] = getDirectOfferState(
    buyer.publicKey,
    metadataPda
  );

  const ins = await marketplaceSOLProgram.methods
    .closeDirectOffer()
    .accounts({
      directOfferState: directOfferStatePda,
      nftMint: NFT_MINT,
      buyer: buyer.publicKey,
      nftMetadata: metadataPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  insList.push(ins);

  const rb = await connection.getLatestBlockhash();

  const msg = new TransactionMessage({
    payerKey: buyer.publicKey,
    recentBlockhash: rb.blockhash,
    instructions: insList,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(msg);
  transaction.sign([buyer]);

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

export const decodeDirectOffer = async () => {
  console.log("instruction::decode_direct_offer");
  const buyer = await buyerKeypair();
  const seller = await sellerKeypair();

  const [metadataPda] = getMetadataPda(NFT_MINT);
  const [directOfferStatePda] = getDirectOfferState(
    buyer.publicKey,
    metadataPda
  );

  const response = await marketplaceSOLProgram.account.directOfferState.fetch(
    directOfferStatePda
  );

  console.log("endtime", response.endtime.toString());
  console.log("offeredAmount", response.offeredAmount.toString());
  console.log("buyer", response.buyer.toString());
  console.log("seller", response.seller.toString());
  console.log("isValid", response.isExpired);
};

export const acceptDirectOffer = async () => {
  console.log("instruction::accept_direct_offer");

  const seller = await sellerKeypair();
  const buyer = await buyerKeypair();
  const level_manager = await levelManagerKeypair();

  const insList: TransactionInstruction[] = [];

  let buyerATA: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    buyer.publicKey
  );

  const ataAccountInfo = await connection.getAccountInfo(buyerATA);
  const creatorInfo = await getNFTCreatorAccounts();

  if (!ataAccountInfo) {
    const preins = createAssociatedTokenAccountInstruction(
      seller.publicKey,
      buyerATA,
      buyer.publicKey,
      NFT_MINT
    );
    insList.push(preins);
  }

  let sellerATA: PublicKey = await getAssociatedTokenAddress(
    NFT_MINT,
    seller.publicKey
  );

  const [usePdaWalletPda] = getUserPdaWallet(buyer.publicKey);
  const [metadataPda] = getMetadataPda(NFT_MINT);

  const [directOfferStatePda] = getDirectOfferState(
    buyer.publicKey,
    metadataPda
  );

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  insList.push(modifyComputeUnits);
  insList.push(addPriorityFee);

  const [programAccessAccount, _] = getProgramAccessAccountPda(
    marketplaceSOLProgramID
  );

  const [sellerEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    seller.publicKey,
    new BN(endTime)
  );

  const [buyerEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    buyer.publicKey,
    new BN(endTime)
  );

  const [marketEverydayTradeStatePda] = marketEverydayTradeState(
    new BN(endTime)
  );

  const [sellerOccsStatePda] = getUserOccStatePda(seller.publicKey);
  const [buyerOccsStatePda] = getUserOccStatePda(buyer.publicKey);
  const [traders_vault] = getTradersVaultPda();

  const [sellerTradeStateMetadata] = getUserTradeStateMetadataPda(
    sellerEveryDayTradeStatePda
  );

  const [buyerTradeStateMetadata] = getUserTradeStateMetadataPda(
    buyerEveryDayTradeStatePda
  );

  const [stakingVault] = getStakingVaultPda();

  const ins = await marketplaceSOLProgram.methods
    .acceptDirectOffer(250, new BN(endTime))
    .accounts({
      directOfferState: directOfferStatePda,
      sellerTradeStateMetadata: sellerTradeStateMetadata,
      buyerTradeStateMetadata: buyerTradeStateMetadata,

      seller: seller.publicKey,
      buyer: buyer.publicKey,
      nftMetadata: metadataPda,
      buyerPdaWallet: usePdaWalletPda,
      sellerNftAta: sellerATA,
      buyerNftAta: buyerATA,
      teamMultisigVault: level_manager.publicKey,
      traderVault: traders_vault,
      stakingVault: stakingVault,
      systemProgram: SystemProgram.programId,
      tokenProgramId: TOKEN_PROGRAM_ID,

      programAccessState: programAccessAccount,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      historyManager: historyManagerProgramAddress,

      buyerEveryDayTradeState: buyerEveryDayTradeStatePda,
      sellerEveryDayTradeState: sellerEveryDayTradeStatePda,
      marketEveryDayTradeState: marketEverydayTradeStatePda,

      occsManager: levelProgramID,
      sellerOccsState: sellerOccsStatePda,
      buyerOccsState: buyerOccsStatePda,
    })
    .remainingAccounts(creatorInfo)
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

  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });

  // console.log("confirmed transaction", tx);
};

export const claimD2DReward = async () => {
  console.log("instruction::claim_d2d_reward");
  const user = await buyerKeypair();
  const insList: TransactionInstruction[] = [];

  console.log(endTime);

  const [userEveryDayTradeStatePda] = getUserEveryDayTradeRecordState(
    user.publicKey,
    new BN(endTime)
  );
  const [marketEverydayTradeStatePda] = marketEverydayTradeState(
    new BN(endTime)
  );
  const [tradersVaultPda] = getTradersVaultPda();

  let [userTradeStateMetadataPda] = getUserTradeStateMetadataPda(
    DUMMY_BUYER_TRADE_STATE
  );

  const ins = await marketplaceSOLProgram.methods
    .claimReward(new BN(endTime))
    .accounts({
      userEveydayTradeState: DUMMY_BUYER_TRADE_STATE,
      marketEverydayTradeState: DUMMY_MARKET_TRADE_STATE,
      userTradeStateMetadata: userTradeStateMetadataPda,
      user: user.publicKey,
      traderVault: tradersVaultPda,
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
  console.log("simulated", simulated);
  // const tx = await connection.sendTransaction(transaction);
  // await connection.confirmTransaction({
  //   signature: tx,
  //   blockhash: rb.blockhash,
  //   lastValidBlockHeight: rb.lastValidBlockHeight,
  // });
  // console.log("confirmed transaction", tx);
};

export const DecodeUserTradeState = async () => {
  const response =
    await historyManagerProgram.account.userEveryDayTradeState.fetch(
      DUMMY_BUYER_TRADE_STATE
    );

  console.log(
    "tradeAsBuyer",
    response.tradeAsBuyer.toNumber() / LAMPORTS_PER_SOL
  );
  console.log(
    "tradeAsSeller",
    response.tradeAsSeller.toNumber() / LAMPORTS_PER_SOL
  );
  console.log("tradePoints", response.tradePoints.toString());
  console.log(
    "rewardPoint",
    response.rewardPoint.toNumber() / LAMPORTS_PER_SOL
  );
  console.log("endDayTimestamp", response.endDayTimestamp.toString());
};

export const DecodeMarketTradeState = async () => {
  const response =
    await historyManagerProgram.account.marketEverydayTradeRecordState.fetch(
      DUMMY_MARKET_TRADE_STATE
    );

  console.log(
    "tradeAmount",
    response.tradeAmount.toNumber() / LAMPORTS_PER_SOL
  );
};
