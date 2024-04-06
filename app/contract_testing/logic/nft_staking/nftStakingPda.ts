import { PublicKey } from "@solana/web3.js";
import { nftStakingProgramID } from "./nftStakingConfig";

export const getStakingManagerPda = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("STAKING_MANAGER_STATE")],
    nftStakingProgramID
  );
};

export const getPercentageTrackerPda = (stakingManager: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("PERCENTAGE_TRACKER"), stakingManager.toBuffer()],
    nftStakingProgramID
  );
};

export const getCollectionConfigPda = (collection: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("COLLECTION_CONFIG"), collection.toBuffer()],
    nftStakingProgramID
  );
};

export const getStakingVaultPda = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("STAKING_VAULT")],
    nftStakingProgramID
  );
};

export const getProgramStakingAuthPda = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("PROGRAM_STAKE_OWNER")],
    nftStakingProgramID
  );
};

export const getStakeStatePda = (user: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("STAKE_STATE"), user.toBuffer(), mint.toBuffer()],
    nftStakingProgramID
  );
};

export const getUserClimedState = (
  user: PublicKey,
  nftMetadata: PublicKey,
  marketTradeState: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("USER_CLAIMED_STATE"),
      user.toBuffer(),
      nftMetadata.toBuffer(),
      marketTradeState.toBuffer(),
    ],
    nftStakingProgramID
  );
};

export const getStakedNFTTrackerPda = (collectionConfigState: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("STAKED_NFT_TRACKER"), collectionConfigState.toBuffer()],
    nftStakingProgramID
  );
};
