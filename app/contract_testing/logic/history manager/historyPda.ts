import { PublicKey } from "@solana/web3.js";
import { historyManagerProgramAddress } from "./historyManagerConfig";
import { BN } from "@project-serum/anchor";

export const getUserEveryDayTradeRecordState = (
  user: PublicKey,
  end_day_timestamp: BN
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("USER_EVERYDAY_TRADE_RECORD"),
      user.toBuffer(),
      end_day_timestamp.toArrayLike(Buffer,"le", 8),
    ],
    historyManagerProgramAddress
  );
};

export const marketEverydayTradeState = (end_day_timestamp: BN) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("MARKET_EVERYDAY_TRADE_STATE"),
      end_day_timestamp.toArrayLike(Buffer,"le", 8),
    ],
    historyManagerProgramAddress
  );
};
