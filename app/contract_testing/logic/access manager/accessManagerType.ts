export type AccessManager = {
  "version": "0.1.0",
  "name": "access_manager",
  "instructions": [
    {
      "name": "initAccessManagerOwnership",
      "accounts": [
        {
          "name": "accessManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
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
      "name": "grantAccessToProgram",
      "accounts": [
        {
          "name": "programAccessAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "revokeAccessToProgram",
      "accounts": [
        {
          "name": "programAccessAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "program",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "transferAccessManagerOwnership",
      "accounts": [
        {
          "name": "accessManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
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
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "closeAccessManagerOwnership",
      "accounts": [
        {
          "name": "accessManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "closeProgramAccessAccount",
      "accounts": [
        {
          "name": "programAccessAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "accessMemberOwnerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accessManagerOwner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "programAccessState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hasAccess",
            "type": "bool"
          },
          {
            "name": "program",
            "type": "publicKey"
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
      "name": "AccessNotFalse",
      "msg": "Access Not False"
    }
  ]
};

export const IDL: AccessManager = {
  "version": "0.1.0",
  "name": "access_manager",
  "instructions": [
    {
      "name": "initAccessManagerOwnership",
      "accounts": [
        {
          "name": "accessManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
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
      "name": "grantAccessToProgram",
      "accounts": [
        {
          "name": "programAccessAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "revokeAccessToProgram",
      "accounts": [
        {
          "name": "programAccessAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "program",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "transferAccessManagerOwnership",
      "accounts": [
        {
          "name": "accessManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
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
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "closeAccessManagerOwnership",
      "accounts": [
        {
          "name": "accessManagerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "closeProgramAccessAccount",
      "accounts": [
        {
          "name": "programAccessAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessManagerOwner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "accessMemberOwnerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accessManagerOwner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "programAccessState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hasAccess",
            "type": "bool"
          },
          {
            "name": "program",
            "type": "publicKey"
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
      "name": "AccessNotFalse",
      "msg": "Access Not False"
    }
  ]
};
