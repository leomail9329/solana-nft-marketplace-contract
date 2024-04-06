import { PublicKey } from "@solana/web3.js";
import { accessManagerAddress } from "./accessManagerConfig";

export const getAccessManagerStatePda = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("ACCESS_MANAGER_OWNERSHIP")],
    new PublicKey(accessManagerAddress)
  );
};

export const getProgramAccessAccountPda = (program: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("PROGRAM_ACCESS_STATE"), program.toBuffer()],
    new PublicKey(accessManagerAddress)
  );
};
