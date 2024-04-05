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

  const onList = () => {
    marketplaceSOLList(wallet);
  };

  const onListingState = () => {
    decodeListingState(wallet);
  };

  const WalletButton = styled("div")(() => ({
    display: 'flex',
    flexDirection: 'row-reverse'
  }))

  return (
    <>
      <div>
        <MaterialUIWalletDialogProvider
          variant="text"
          style={{
            border: "2px solid #c83235",
            fontWeight: 900,
            background: "transparent",
            borderRadius: "10px",
            color: "#c83235",
          }}
        />
      </div>
      <div style={{ margin: "10px" }}>
        <h1>NFT Marketplace Test</h1>
        <br />
        <p>Seller Address: awFvi2DJuewSKQeEoSP8poxoM5inytsXd5bDWrmLa4H </p>
        <p>Buyer Addres: 4x6TeJ7aXDGVtN8Wmh1tCMa1sB3Q6fXRwUptBkYBHbd7</p>
        <p>NFT Address: 5oPBXTtU3oG7RyH9wfQv1po6WoEWF3ihEUnrk6wVqM94</p>
        <br />
      </div>

      <div style={{ margin: "10px" }}>
        {/* <h1>Marketplace</h1> */}
        <br />
        <p>List</p>
        <Btn title={"Seller list NFT"} func={onList} />
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
        <Btn title={"Fund to Marketplace"} func={fundPdaWallet} />
        <br />
        <Btn title={"Withdraw from Marketplace"} func={withdrawPdaWallet} />
        <br />
        <br />
        <p>List/Buy now</p>
        <Btn title={"Seller list NFT"} func={marketplaceSOLList} />
        <br />
        <Btn title={"Buy now"} func={marketplaceSOLBuyNow} />
        <br />
        {/* <Btn
          title={"decode market trade state"}
          func={DecodeMarketTradeState}
        />
        <br /> */}
        {/* <Btn title={"claim D2D reward"} func={claimD2DReward} /> */}
        <br />
      </div>

      {/* <div style={{ margin: "10px" }}>
        <h1>NFT Staking contract</h1>
        <Btn title={"init staking manager"} func={initNFTStakingManager} />
        <br />
        <Btn
          title={"transfer ownership"}
          func={transferNftSTakingManagerOwnership}
        />
        <br />
        <Btn title={"init collection config"} func={initCollectionConfig} />
        <br />
        <Btn title={"decode collection config"} func={decodeCollectionConfig} />
        <br />
        <Btn
          title={"decode percentage tracker"}
          func={decodePercentageTracker}
        />
        <br />{" "}
        <Btn
          title={"decode staked nft tracker"}
          func={decodeStakedNFTTracker}
        />
        <br />
        <Btn title={"transfer from vault"} func={transferFromVault} />
        <br />
        <Btn title={"modify collection config"} func={modifyCollectionConfig} />
        <br />
        <Btn title={"stake NFT"} func={stakingNFT} />
        <br />
        <Btn title={"decode stake state"} func={decodeStakeState} />
        <br />
        <Btn title={"claim reward"} func={claimStakingReward} />
        <br />
        <Btn title={"unstake NFT"} func={unstakeNFT} />
        <br />
      </div> */}
    </>
  );
}
