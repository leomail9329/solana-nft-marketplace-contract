import { Btn } from "@/components/btn";
import {
  InitAccessManager,
  closeAccessManager,
  closeProgramAccessAccount,
  decodeAccessManagerState,
  decodeProgramAccessAccount,
  grantAccess,
  revokeAccess,
  transferOwnership,
} from "@/logic/access manager/accessManagerFunc";
import { connection } from "@/logic/config";
import {
  initOccManagerAccount,
  decodeOccsManagerAccount,
  transferOccsOwnership,
  closeOccsManagerState,
  increaseOccsScore,
  decreaseOccsScore,
  // close,
} from "@/logic/funs";
import {
  createHistoryBook,
  decodeHistoryState,
} from "@/logic/history manager/historyManagerFuncs";
import {
  DecodeMarketTradeState,
  DecodeUserTradeState,
  acceptDirectOffer,
  acceptOffer,
  claimD2DReward,
  closeDirectOffer,
  closeOffer,
  createDirectOffer,
  decodeDirectOffer,
  decodeListingState,
  decodeOfferState,
  fundWithdrawPdaWallet,
  makeOffer,
  marketplaceSOLBuyNow,
  marketplaceSOLCancelListing,
  marketplaceSOLList,
  marketplaceSOLUpdateListing,
  updateDirectOffer,
  updateOffer,
} from "@/logic/marketplace sol/MarketplaceSOLFun";
import { marketplaceSOLProgramID } from "@/logic/marketplace sol/marketplaceSOLConfig";
import {
  claimStakingReward,
  decodeCollectionConfig,
  decodePercentageTracker,
  decodeStakeState,
  decodeStakedNFTTracker,
  initCollectionConfig,
  initNFTStakingManager,
  modifyCollectionConfig,
  stakingNFT,
  transferFromVault,
  transferNftSTakingManagerOwnership,
  unstakeNFT,
} from "@/logic/nft_staking/nftStakingFuns";
import { PublicKey } from "@metaplex-foundation/js";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    connection.onLogs(marketplaceSOLProgramID, (a) => {
      console.log("event", a);
    });
  });

  return (
    <>
      <div style={{ margin: "10px" }}>
        <h1>OCCS manager</h1>
        <Btn title={"init occs manager state"} func={initOccManagerAccount} />
        <br />
        <Btn
          title={"decode occs manager state"}
          func={decodeOccsManagerAccount}
        />
        <br />
        <Btn title={"transfer ownership"} func={transferOccsOwnership} />
        <br />
        <Btn title={"close ocss manager state"} func={closeOccsManagerState} />
        <br />
        <Btn title={"increase occs score"} func={increaseOccsScore} />
        <br />
        <Btn title={"decrease credit score"} func={decreaseOccsScore} />
        <br />
      </div>

      <div style={{ margin: "10px" }}>
        <h1>History manager</h1>
        <Btn title={"create History book"} func={createHistoryBook} />
        <br />
        <Btn title={"decode history book"} func={decodeHistoryState} />
        <br />
      </div>

      <div style={{ margin: "10px" }}>
        <h1>Access Manager</h1>
        <Btn title={"init access manager"} func={InitAccessManager} />
        <br />
        <Btn title={"transfer ownership"} func={transferOwnership} />
        <br />
        <Btn title={"decode access manager"} func={decodeAccessManagerState} />
        <br />
        <Btn title={"grant access"} func={grantAccess} />
        <br />
        <Btn
          title={"decode program access account"}
          func={decodeProgramAccessAccount}
        />
        <br />

        <Btn title={"revoke access "} func={revokeAccess} />
        <br />

        <Btn title={"close access manager state"} func={closeAccessManager} />
        <br />

        <Btn
          title={"close prgram access state"}
          func={closeProgramAccessAccount}
        />
        <br />
      </div>

      <div style={{ margin: "10px" }}>
        <h1>Marketplace SOL</h1>

        <Btn title={"list"} func={marketplaceSOLList} />
        <br />
        <Btn title={"decode listing"} func={decodeListingState} />
        <br />
        <Btn title={"update listing"} func={marketplaceSOLUpdateListing} />
        <br />
        <Btn title={"cancel_listing"} func={marketplaceSOLCancelListing} />
        <br />
        <Btn title={"buy now"} func={marketplaceSOLBuyNow} />
        <br />
        <Btn title={"fund/withdraw pda wallet"} func={fundWithdrawPdaWallet} />
        <br />
        <Btn title={"make offer"} func={makeOffer} />
        <br />
        <Btn title={"decode offer"} func={decodeOfferState} />
        <br />
        <Btn title={"update offer"} func={updateOffer} />
        <br />
        <Btn title={"close offer"} func={closeOffer} />
        <br />
        <Btn title={"accept offer"} func={acceptOffer} />
        <br />
        <Btn title={"create direct offer"} func={createDirectOffer} />
        <br />
        <Btn title={"update direct offer"} func={updateDirectOffer} />
        <br />
        <Btn title={"decode direct offer"} func={decodeDirectOffer} />
        <br />
        <Btn title={"close direct offer"} func={closeDirectOffer} />
        <br />
        <Btn title={"accept direct offer"} func={acceptDirectOffer} />
        <br />
        <Btn title={"decode user trade state"} func={DecodeUserTradeState} />
        <br />
        <Btn
          title={"decode market trade state"}
          func={DecodeMarketTradeState}
        />
        <br />
        <Btn title={"claim D2D reward"} func={claimD2DReward} />
        <br />
      </div>

      <div style={{ margin: "10px" }}>
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
      </div>
    </>
  );
}
