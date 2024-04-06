export type NftStakingContract = {
  "version": "0.1.0",
  "name": "nft_staking_contract",
  "instructions": [
    {
      "name": "initStakingManager",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "percentageTrackerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initCollectionConfig",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "percentageTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfigState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "share",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initStakedNftTracker",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfigState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferManagerOwnership",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newManager",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "transferFromVault",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakingVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "transferType",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "modifyCollectionConfig",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "percentageTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "share",
          "type": "u16"
        }
      ]
    },
    {
      "name": "stakeNft",
      "accounts": [
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuth",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userClaimedStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakingVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketTradeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "endDayTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuth",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakingManagerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakingManager",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "collectionConfigState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collectionMetatdata",
            "type": "publicKey"
          },
          {
            "name": "share",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "percentageTrackerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalSum",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "stakeState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "totalRewardClaimed",
            "type": "u64"
          },
          {
            "name": "nftMetadata",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "claimStatus",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isClaimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "stakedNftTrackerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numberStaked",
            "type": "u64"
          },
          {
            "name": "collectionConfigState",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientFunds",
      "msg": "Insufficient Funds"
    },
    {
      "code": 6001,
      "name": "PubKeyMismatched",
      "msg": "PubKey Mismatched"
    },
    {
      "code": 6002,
      "name": "InvalidShareValue",
      "msg": "Invalid Share Value"
    },
    {
      "code": 6003,
      "name": "TokenAccountNotInit",
      "msg": "Token Account Not Init"
    },
    {
      "code": 6004,
      "name": "RewardsAlreadyClaimed",
      "msg": "Rewards Already Claimed"
    },
    {
      "code": 6005,
      "name": "InvalidClaimTimestamp",
      "msg": "Invalid Claim Timestamp"
    },
    {
      "code": 6006,
      "name": "ClaimTooEarly",
      "msg": "Claim Too Early"
    },
    {
      "code": 6007,
      "name": "MinimumStakingTimeConstraints",
      "msg": "MinimumStakingTimeConstraints"
    }
  ]
};

export const IDL: NftStakingContract = {
  "version": "0.1.0",
  "name": "nft_staking_contract",
  "instructions": [
    {
      "name": "initStakingManager",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "percentageTrackerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initCollectionConfig",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "percentageTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfigState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "share",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initStakedNftTracker",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfigState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferManagerOwnership",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newManager",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "transferFromVault",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakingVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "transferType",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "modifyCollectionConfig",
      "accounts": [
        {
          "name": "stakingManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "percentageTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingManager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "share",
          "type": "u16"
        }
      ]
    },
    {
      "name": "stakeNft",
      "accounts": [
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuth",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userClaimedStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakingVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketTradeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "endDayTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedNftTracker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuth",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakingManagerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakingManager",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "collectionConfigState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collectionMetatdata",
            "type": "publicKey"
          },
          {
            "name": "share",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "percentageTrackerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalSum",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "stakeState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "totalRewardClaimed",
            "type": "u64"
          },
          {
            "name": "nftMetadata",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "claimStatus",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isClaimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "stakedNftTrackerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numberStaked",
            "type": "u64"
          },
          {
            "name": "collectionConfigState",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientFunds",
      "msg": "Insufficient Funds"
    },
    {
      "code": 6001,
      "name": "PubKeyMismatched",
      "msg": "PubKey Mismatched"
    },
    {
      "code": 6002,
      "name": "InvalidShareValue",
      "msg": "Invalid Share Value"
    },
    {
      "code": 6003,
      "name": "TokenAccountNotInit",
      "msg": "Token Account Not Init"
    },
    {
      "code": 6004,
      "name": "RewardsAlreadyClaimed",
      "msg": "Rewards Already Claimed"
    },
    {
      "code": 6005,
      "name": "InvalidClaimTimestamp",
      "msg": "Invalid Claim Timestamp"
    },
    {
      "code": 6006,
      "name": "ClaimTooEarly",
      "msg": "Claim Too Early"
    },
    {
      "code": 6007,
      "name": "MinimumStakingTimeConstraints",
      "msg": "MinimumStakingTimeConstraints"
    }
  ]
};
