export type HistoryManager = {
  "version": "0.1.0",
  "name": "history_manager",
  "instructions": [
    {
      "name": "createUserTradeState",
      "accounts": [
        {
          "name": "userEveydayTradeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAccessState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "endDayTimestamp",
          "type": "u64"
        },
        {
          "name": "tokenAlias",
          "type": "u8"
        },
        {
          "name": "tradeAsSeller",
          "type": "u64"
        },
        {
          "name": "tradeAsBuyer",
          "type": "u64"
        },
        {
          "name": "tradePoints",
          "type": "f64"
        },
        {
          "name": "rewardPoint",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createMarketTradeState",
      "accounts": [
        {
          "name": "marketEverydayTradeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAccessState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "endDayTimestamp",
          "type": "u64"
        },
        {
          "name": "tokenAlias",
          "type": "u8"
        },
        {
          "name": "tradedAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userEveryDayTradeState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAlias",
            "type": "u8"
          },
          {
            "name": "rewardPoint",
            "type": "u64"
          },
          {
            "name": "tradePoints",
            "type": "f64"
          },
          {
            "name": "tradeAsSeller",
            "type": "u64"
          },
          {
            "name": "tradeAsBuyer",
            "type": "u64"
          },
          {
            "name": "endDayTimestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "marketEverydayTradeRecordState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAlias",
            "type": "u8"
          },
          {
            "name": "tradeAmount",
            "type": "u64"
          },
          {
            "name": "endDayTimestamp",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PubKeyMismatched",
      "msg": "PubKey Mismatched"
    },
    {
      "code": 6001,
      "name": "NotACPICall",
      "msg": "Not A CPI Call"
    },
    {
      "code": 6002,
      "name": "InvalidAccess",
      "msg": "Invalid Access"
    }
  ]
};

export const IDL: HistoryManager = {
  "version": "0.1.0",
  "name": "history_manager",
  "instructions": [
    {
      "name": "createUserTradeState",
      "accounts": [
        {
          "name": "userEveydayTradeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAccessState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "endDayTimestamp",
          "type": "u64"
        },
        {
          "name": "tokenAlias",
          "type": "u8"
        },
        {
          "name": "tradeAsSeller",
          "type": "u64"
        },
        {
          "name": "tradeAsBuyer",
          "type": "u64"
        },
        {
          "name": "tradePoints",
          "type": "f64"
        },
        {
          "name": "rewardPoint",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createMarketTradeState",
      "accounts": [
        {
          "name": "marketEverydayTradeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAccessState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "endDayTimestamp",
          "type": "u64"
        },
        {
          "name": "tokenAlias",
          "type": "u8"
        },
        {
          "name": "tradedAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userEveryDayTradeState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAlias",
            "type": "u8"
          },
          {
            "name": "rewardPoint",
            "type": "u64"
          },
          {
            "name": "tradePoints",
            "type": "f64"
          },
          {
            "name": "tradeAsSeller",
            "type": "u64"
          },
          {
            "name": "tradeAsBuyer",
            "type": "u64"
          },
          {
            "name": "endDayTimestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "marketEverydayTradeRecordState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAlias",
            "type": "u8"
          },
          {
            "name": "tradeAmount",
            "type": "u64"
          },
          {
            "name": "endDayTimestamp",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PubKeyMismatched",
      "msg": "PubKey Mismatched"
    },
    {
      "code": 6001,
      "name": "NotACPICall",
      "msg": "Not A CPI Call"
    },
    {
      "code": 6002,
      "name": "InvalidAccess",
      "msg": "Invalid Access"
    }
  ]
};