import { Btn } from "@/components/btn";
import { connection } from "@/logic/config";
import { flexbox, styled } from "@mui/system";
import {
  decodeListingState,
  fundPdaWallet,
  withdrawPdaWallet,
  marketplaceSOLBuyNow,
  marketplaceSOLCancelListing,
  marketplaceSOLList,
  marketplaceSOLUpdateListing,
} from "@/logic/marketplace sol/MarketplaceSOLFun";
import { marketplaceSOLProgramID } from "@/logic/marketplace sol/marketplaceSOLConfig";
import { PublicKey } from "@metaplex-foundation/js";
import { Wallet } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { Wallets } from "../components/Wallet";
import {
  WalletDialogProvider as MaterialUIWalletDialogProvider,
  WalletMultiButton as MaterialUIWalletMultiButton,
  WalletConnectButton
} from '@solana/wallet-adapter-material-ui';

export default function Home() {
  const wallet = useWallet();

  useEffect(() => {
    connection.onLogs(marketplaceSOLProgramID, (a) => {
      console.log("event", a);
    });
  });

  const WalletButton = styled("div")(() => ({
    display: 'flex',
    flexDirection: 'row-reverse'
  }))

  return (
    <>
      <div style={{ margin: "10px" }}>
        <h1>NFT Marketplace Test</h1>
      </div>

      <div style={{ margin: "10px" }}>
        <br />
        <p>List</p>
        <Btn title={"Seller list NFT"} func={marketplaceSOLList} />
        <br />
        <Btn title={"Seller listing state"} func={decodeListingState} />
        <br />
        <Btn
          title={"Seller update listing"}
          func={marketplaceSOLUpdateListing}
        />
        <br />
        <Btn title={"Seller cancel list"} func={marketplaceSOLCancelListing} />
        <br />
        <br />
        <p>List/Buy now</p>
        <Btn title={"Buyer Fund to Marketplace"} func={fundPdaWallet} />
        <br />
        <Btn title={"Buyer Withdraw from Marketplace"} func={withdrawPdaWallet} />
        <br />
        <br />
        <Btn title={"Buy now"} func={marketplaceSOLBuyNow} />
        <br />
        <br />
      </div>
    </>
  );
}
