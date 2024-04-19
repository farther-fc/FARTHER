import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FartherAirdrop
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fartherAirdropAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'merkleRoot_', internalType: 'bytes32', type: 'bytes32' },
      { name: 'endTime_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'END_TIME',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MERKLE_ROOT',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'isClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'AlreadyClaimed' },
  { type: 'error', inputs: [], name: 'ClaimWindowFinished' },
  { type: 'error', inputs: [], name: 'EndTimeInPast' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InvalidProof' },
  { type: 'error', inputs: [], name: 'NoWithdrawDuringClaim' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FartherAirdrop1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fartherAirdrop1Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'merkleRoot_', internalType: 'bytes32', type: 'bytes32' },
      { name: 'endTime_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'END_TIME',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MERKLE_ROOT',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'isClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'AlreadyClaimed' },
  { type: 'error', inputs: [], name: 'ClaimWindowFinished' },
  { type: 'error', inputs: [], name: 'EndTimeInPast' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InvalidProof' },
  { type: 'error', inputs: [], name: 'NoWithdrawDuringClaim' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FartherToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fartherTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'tokenName', internalType: 'string', type: 'string' },
      { name: 'tokenSymbol', internalType: 'string', type: 'string' },
      {
        name: 'mintingAllowedAfter_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIMUM_TIME_BETWEEN_MINTS',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINT_CAP',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN_INITIAL_SUPPLY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct Checkpoints.Checkpoint208',
        type: 'tuple',
        components: [
          { name: '_key', internalType: 'uint48', type: 'uint48' },
          { name: '_value', internalType: 'uint208', type: 'uint208' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint96', type: 'uint96' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mintingAllowedAfter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'increasedSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20ExceededSafeSupply',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'deadline', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC2612ExpiredSignature',
  },
  {
    type: 'error',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC2612InvalidSigner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'ERC5805FutureLookup',
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'blockTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'mintingAllowedAfter', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MintAllowedAfterDeployOnly',
  },
  { type: 'error', inputs: [], name: 'MintCapExceeded' },
  { type: 'error', inputs: [], name: 'MintToZeroAddressBlocked' },
  { type: 'error', inputs: [], name: 'MintingDateNotReached' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdropAbi}__
 */
export const useReadFartherAirdrop = /*#__PURE__*/ createUseReadContract({
  abi: fartherAirdropAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"END_TIME"`
 */
export const useReadFartherAirdropEndTime = /*#__PURE__*/ createUseReadContract(
  { abi: fartherAirdropAbi, functionName: 'END_TIME' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"MERKLE_ROOT"`
 */
export const useReadFartherAirdropMerkleRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherAirdropAbi,
    functionName: 'MERKLE_ROOT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"TOKEN"`
 */
export const useReadFartherAirdropToken = /*#__PURE__*/ createUseReadContract({
  abi: fartherAirdropAbi,
  functionName: 'TOKEN',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"isClaimed"`
 */
export const useReadFartherAirdropIsClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherAirdropAbi,
    functionName: 'isClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"owner"`
 */
export const useReadFartherAirdropOwner = /*#__PURE__*/ createUseReadContract({
  abi: fartherAirdropAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdropAbi}__
 */
export const useWriteFartherAirdrop = /*#__PURE__*/ createUseWriteContract({
  abi: fartherAirdropAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"claim"`
 */
export const useWriteFartherAirdropClaim = /*#__PURE__*/ createUseWriteContract(
  { abi: fartherAirdropAbi, functionName: 'claim' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFartherAirdropRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherAirdropAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteFartherAirdropTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherAirdropAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteFartherAirdropWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherAirdropAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdropAbi}__
 */
export const useSimulateFartherAirdrop =
  /*#__PURE__*/ createUseSimulateContract({ abi: fartherAirdropAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulateFartherAirdropClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdropAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFartherAirdropRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdropAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateFartherAirdropTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdropAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdropAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateFartherAirdropWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdropAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherAirdropAbi}__
 */
export const useWatchFartherAirdropEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: fartherAirdropAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherAirdropAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchFartherAirdropClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherAirdropAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherAirdropAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchFartherAirdropOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherAirdropAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__
 */
export const useReadFartherAirdrop1 = /*#__PURE__*/ createUseReadContract({
  abi: fartherAirdrop1Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"END_TIME"`
 */
export const useReadFartherAirdrop1EndTime =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherAirdrop1Abi,
    functionName: 'END_TIME',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"MERKLE_ROOT"`
 */
export const useReadFartherAirdrop1MerkleRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherAirdrop1Abi,
    functionName: 'MERKLE_ROOT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"TOKEN"`
 */
export const useReadFartherAirdrop1Token = /*#__PURE__*/ createUseReadContract({
  abi: fartherAirdrop1Abi,
  functionName: 'TOKEN',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"isClaimed"`
 */
export const useReadFartherAirdrop1IsClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherAirdrop1Abi,
    functionName: 'isClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"owner"`
 */
export const useReadFartherAirdrop1Owner = /*#__PURE__*/ createUseReadContract({
  abi: fartherAirdrop1Abi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__
 */
export const useWriteFartherAirdrop1 = /*#__PURE__*/ createUseWriteContract({
  abi: fartherAirdrop1Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"claim"`
 */
export const useWriteFartherAirdrop1Claim =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherAirdrop1Abi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFartherAirdrop1RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherAirdrop1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteFartherAirdrop1TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherAirdrop1Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteFartherAirdrop1Withdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherAirdrop1Abi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__
 */
export const useSimulateFartherAirdrop1 =
  /*#__PURE__*/ createUseSimulateContract({ abi: fartherAirdrop1Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"claim"`
 */
export const useSimulateFartherAirdrop1Claim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdrop1Abi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFartherAirdrop1RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdrop1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateFartherAirdrop1TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdrop1Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateFartherAirdrop1Withdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherAirdrop1Abi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherAirdrop1Abi}__
 */
export const useWatchFartherAirdrop1Event =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: fartherAirdrop1Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchFartherAirdrop1ClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherAirdrop1Abi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherAirdrop1Abi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchFartherAirdrop1OwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherAirdrop1Abi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__
 */
export const useReadFartherToken = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useReadFartherTokenClockMode = /*#__PURE__*/ createUseReadContract(
  { abi: fartherTokenAbi, functionName: 'CLOCK_MODE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadFartherTokenDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"MINIMUM_TIME_BETWEEN_MINTS"`
 */
export const useReadFartherTokenMinimumTimeBetweenMints =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'MINIMUM_TIME_BETWEEN_MINTS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"MINT_CAP"`
 */
export const useReadFartherTokenMintCap = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'MINT_CAP',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"TOKEN_INITIAL_SUPPLY"`
 */
export const useReadFartherTokenTokenInitialSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'TOKEN_INITIAL_SUPPLY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadFartherTokenAllowance = /*#__PURE__*/ createUseReadContract(
  { abi: fartherTokenAbi, functionName: 'allowance' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadFartherTokenBalanceOf = /*#__PURE__*/ createUseReadContract(
  { abi: fartherTokenAbi, functionName: 'balanceOf' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"checkpoints"`
 */
export const useReadFartherTokenCheckpoints =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'checkpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"clock"`
 */
export const useReadFartherTokenClock = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'clock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadFartherTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"delegates"`
 */
export const useReadFartherTokenDelegates = /*#__PURE__*/ createUseReadContract(
  { abi: fartherTokenAbi, functionName: 'delegates' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadFartherTokenEip712Domain =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"getPastTotalSupply"`
 */
export const useReadFartherTokenGetPastTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'getPastTotalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"getPastVotes"`
 */
export const useReadFartherTokenGetPastVotes =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'getPastVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"getVotes"`
 */
export const useReadFartherTokenGetVotes = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'getVotes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"mintingAllowedAfter"`
 */
export const useReadFartherTokenMintingAllowedAfter =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'mintingAllowedAfter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadFartherTokenName = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadFartherTokenNonces = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"numCheckpoints"`
 */
export const useReadFartherTokenNumCheckpoints =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'numCheckpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"owner"`
 */
export const useReadFartherTokenOwner = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"paused"`
 */
export const useReadFartherTokenPaused = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadFartherTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: fartherTokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadFartherTokenTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: fartherTokenAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__
 */
export const useWriteFartherToken = /*#__PURE__*/ createUseWriteContract({
  abi: fartherTokenAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteFartherTokenApprove = /*#__PURE__*/ createUseWriteContract(
  { abi: fartherTokenAbi, functionName: 'approve' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteFartherTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: fartherTokenAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteFartherTokenBurnFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherTokenAbi,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"delegate"`
 */
export const useWriteFartherTokenDelegate =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherTokenAbi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useWriteFartherTokenDelegateBySig =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherTokenAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteFartherTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: fartherTokenAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteFartherTokenPause = /*#__PURE__*/ createUseWriteContract({
  abi: fartherTokenAbi,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteFartherTokenPermit = /*#__PURE__*/ createUseWriteContract({
  abi: fartherTokenAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFartherTokenRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherTokenAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteFartherTokenTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherTokenAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteFartherTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteFartherTokenTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fartherTokenAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteFartherTokenUnpause = /*#__PURE__*/ createUseWriteContract(
  { abi: fartherTokenAbi, functionName: 'unpause' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__
 */
export const useSimulateFartherToken = /*#__PURE__*/ createUseSimulateContract({
  abi: fartherTokenAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateFartherTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateFartherTokenBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateFartherTokenBurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"delegate"`
 */
export const useSimulateFartherTokenDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useSimulateFartherTokenDelegateBySig =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateFartherTokenMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateFartherTokenPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateFartherTokenPermit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFartherTokenRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateFartherTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateFartherTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateFartherTokenTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fartherTokenAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateFartherTokenUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fartherTokenAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__
 */
export const useWatchFartherTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: fartherTokenAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchFartherTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"DelegateChanged"`
 */
export const useWatchFartherTokenDelegateChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'DelegateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const useWatchFartherTokenDelegateVotesChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'DelegateVotesChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useWatchFartherTokenEip712DomainChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchFartherTokenOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchFartherTokenPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchFartherTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fartherTokenAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchFartherTokenUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fartherTokenAbi,
    eventName: 'Unpaused',
  })
