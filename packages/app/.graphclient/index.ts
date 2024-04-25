// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { FartherTypes } from './sources/farther/types';
import * as importedModule$0 from "./../.graphclientrc.js";
import * as importedModule$1 from "./sources/farther/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type Account = {
  /**  { Account address }  */
  id: Scalars['Bytes']['output'];
  /**  Number of positions this account has  */
  positionCount: Scalars['Int']['output'];
  /**  All positions that belong to this account  */
  positions: Array<Position>;
  /**  Number of open positions this account has  */
  openPositionCount: Scalars['Int']['output'];
  /**  Number of closed positions this account has  */
  closedPositionCount: Scalars['Int']['output'];
  /**  Number of deposits this account made  */
  depositCount: Scalars['Int']['output'];
  /**  All deposit events of this account  */
  deposits: Array<Deposit>;
  /**  Number of withdrawals this account made  */
  withdrawCount: Scalars['Int']['output'];
  /**  All withdraw events of this account  */
  withdraws: Array<Withdraw>;
  /**  Number of times this account has traded/swapped */
  swapCount: Scalars['Int']['output'];
  /**  All swap events of this account  */
  swaps: Array<Swap>;
  rewards: Array<Reward>;
};


export type AccountpositionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
};


export type AccountdepositsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
};


export type AccountwithdrawsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Withdraw_filter>;
};


export type AccountswapsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Swap_filter>;
};


export type AccountrewardsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Reward_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Reward_filter>;
};

export type Account_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  positionCount?: InputMaybe<Scalars['Int']['input']>;
  positionCount_not?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positions_?: InputMaybe<Position_filter>;
  openPositionCount?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  depositCount?: InputMaybe<Scalars['Int']['input']>;
  depositCount_not?: InputMaybe<Scalars['Int']['input']>;
  depositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  depositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  depositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  depositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  depositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  depositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deposits_?: InputMaybe<Deposit_filter>;
  withdrawCount?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdraws_?: InputMaybe<Withdraw_filter>;
  swapCount?: InputMaybe<Scalars['Int']['input']>;
  swapCount_not?: InputMaybe<Scalars['Int']['input']>;
  swapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  swapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  swapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  swapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  swapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  swapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  swaps_?: InputMaybe<Swap_filter>;
  rewards_?: InputMaybe<Reward_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Account_filter>>>;
};

export type Account_orderBy =
  | 'id'
  | 'positionCount'
  | 'positions'
  | 'openPositionCount'
  | 'closedPositionCount'
  | 'depositCount'
  | 'deposits'
  | 'withdrawCount'
  | 'withdraws'
  | 'swapCount'
  | 'swaps'
  | 'rewards';

export type ActiveAccount = {
  /**  { daily/hourly }-{ Address of the account }-{ Days/hours since Unix epoch }  */
  id: Scalars['Bytes']['output'];
};

export type ActiveAccount_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ActiveAccount_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ActiveAccount_filter>>>;
};

export type ActiveAccount_orderBy =
  | 'id';

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * An event is any user action that occurs in a protocol. Generally, they are Ethereum events
 * emitted by a function in the smart contracts, stored in transaction receipts as event logs.
 * However, some user actions of interest are function calls that don't emit events. For example,
 * the deposit and withdraw functions in Yearn do not emit any events. In our subgraphs, we still
 * store them as events, although they are not technically Ethereum events emitted by smart
 * contracts.
 *
 */
export type Deposit = {
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['Bytes']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['Bytes']['output'];
  /**  Nonce of the transaction that emitted this event  */
  nonce: Scalars['BigInt']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Gas limit of the transaction that emitted this event  */
  gasLimit?: Maybe<Scalars['BigInt']['output']>;
  /**  Gas used in this transaction. (Optional because not every chain will support this)  */
  gasUsed?: Maybe<Scalars['BigInt']['output']>;
  /**  Gas price of the transaction that emitted this event  */
  gasPrice?: Maybe<Scalars['BigInt']['output']>;
  /**  The protocol this transaction belongs to  */
  protocol: DexAmmProtocol;
  /**  Account that emitted this event  */
  account: Account;
  /**  The user position changed by this event  */
  position?: Maybe<Position>;
  /**  The pool involving this event  */
  pool: Pool;
  /**  lower tick of position  */
  tickLower?: Maybe<Scalars['BigInt']['output']>;
  /**  upper tick of position  */
  tickUpper?: Maybe<Scalars['BigInt']['output']>;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Amount of liquidity minted  */
  liquidity: Scalars['BigInt']['output'];
  /**  Input tokens of the pool. E.g. WETH and USDC to a WETH-USDC pool  */
  inputTokens: Array<Token>;
  /**  Amount of input tokens in the token's native unit  */
  inputTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  Amount of input tokens in the liquidity pool  */
  reserveAmounts?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  USD-normalized value of the transaction of the underlying (e.g. sum of tokens deposited into a pool)  */
  amountUSD: Scalars['BigDecimal']['output'];
};


/**
 * An event is any user action that occurs in a protocol. Generally, they are Ethereum events
 * emitted by a function in the smart contracts, stored in transaction receipts as event logs.
 * However, some user actions of interest are function calls that don't emit events. For example,
 * the deposit and withdraw functions in Yearn do not emit any events. In our subgraphs, we still
 * store them as events, although they are not technically Ethereum events emitted by smart
 * contracts.
 *
 */
export type DepositinputTokensArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
};

export type Deposit_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  nonce?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_filter>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_filter>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  tickLower?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_not?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickLower_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickUpper?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_not?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickUpper_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokens?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_?: InputMaybe<Token_filter>;
  inputTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Deposit_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Deposit_filter>>>;
};

export type Deposit_orderBy =
  | 'id'
  | 'hash'
  | 'nonce'
  | 'logIndex'
  | 'gasLimit'
  | 'gasUsed'
  | 'gasPrice'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'account'
  | 'account__id'
  | 'account__positionCount'
  | 'account__openPositionCount'
  | 'account__closedPositionCount'
  | 'account__depositCount'
  | 'account__withdrawCount'
  | 'account__swapCount'
  | 'position'
  | 'position__id'
  | 'position__tokenId'
  | 'position__isStaked'
  | 'position__hashOpened'
  | 'position__hashClosed'
  | 'position__blockNumberOpened'
  | 'position__timestampOpened'
  | 'position__blockNumberClosed'
  | 'position__timestampClosed'
  | 'position__liquidityTokenType'
  | 'position__liquidity'
  | 'position__liquidityUSD'
  | 'position__cumulativeDepositUSD'
  | 'position__cumulativeWithdrawUSD'
  | 'position__depositCount'
  | 'position__withdrawCount'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'tickLower'
  | 'tickUpper'
  | 'blockNumber'
  | 'timestamp'
  | 'liquidity'
  | 'inputTokens'
  | 'inputTokenAmounts'
  | 'reserveAmounts'
  | 'amountUSD';

export type DexAmmProtocol = Protocol & {
  /**  Smart contract address of the protocol's main contract (Factory, Registry, etc)  */
  id: Scalars['Bytes']['output'];
  /**  Name of the protocol, including version. e.g. Uniswap v3  */
  name: Scalars['String']['output'];
  /**  Slug of protocol, including version. e.g. uniswap-v3  */
  slug: Scalars['String']['output'];
  /**  Version of the subgraph schema, in SemVer format (e.g. 1.0.0)  */
  schemaVersion: Scalars['String']['output'];
  /**  Version of the subgraph implementation, in SemVer format (e.g. 1.0.0)  */
  subgraphVersion: Scalars['String']['output'];
  /**  Version of the methodology used to compute metrics, loosely based on SemVer format (e.g. 1.0.0)  */
  methodologyVersion: Scalars['String']['output'];
  /**  The blockchain network this subgraph is indexing on  */
  network: Network;
  /**  The type of protocol (e.g. DEX, Lending, Yield, etc)  */
  type: ProtocolType;
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The sum of all active and non-active liquidity in USD for this pool.  */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All liquidity in USD that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All protocol-side value locking in USD that remains uncollected and unused in the protocol.  */
  uncollectedProtocolSideValueUSD: Scalars['BigDecimal']['output'];
  /**  All supply-side value locking in USD that remains uncollected and unused in the protocol.  */
  uncollectedSupplySideValueUSD: Scalars['BigDecimal']['output'];
  /**  Current PCV (Protocol Controlled Value). Only relevant for protocols with PCV.  */
  protocolControlledValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  All historical volume in USD  */
  cumulativeVolumeUSD: Scalars['BigDecimal']['output'];
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Number of cumulative liquidity providers  */
  cumulativeUniqueLPs: Scalars['Int']['output'];
  /**  Number of cumulative traders  */
  cumulativeUniqueTraders: Scalars['Int']['output'];
  /**  Total number of pools  */
  totalPoolCount: Scalars['Int']['output'];
  /**  Total number of open positions  */
  openPositionCount: Scalars['Int']['output'];
  /**  Total number of positions (open and closed)  */
  cumulativePositionCount: Scalars['Int']['output'];
  /**  Day ID of the most recent daily snapshot  */
  lastSnapshotDayID: Scalars['Int']['output'];
  /**  Timestamp of the last time this entity was updated  */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /**  Block number of the last time this entity was updated  */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /**  Daily usage metrics for this protocol  */
  dailyUsageMetrics: Array<UsageMetricsDailySnapshot>;
  /**  Hourly usage metrics for this protocol  */
  hourlyUsageMetrics: Array<UsageMetricsHourlySnapshot>;
  /**  Daily financial metrics for this protocol  */
  financialMetrics: Array<FinancialsDailySnapshot>;
  /**  All pools that belong to this protocol  */
  pools: Array<Pool>;
  /**  This is a boolean to indicate whether or not the pools have been instantiated the were initialized before Optimism regenesis  */
  _regenesis: Scalars['Boolean']['output'];
};


export type DexAmmProtocoldailyUsageMetricsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsDailySnapshot_filter>;
};


export type DexAmmProtocolhourlyUsageMetricsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsHourlySnapshot_filter>;
};


export type DexAmmProtocolfinancialMetricsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FinancialsDailySnapshot_filter>;
};


export type DexAmmProtocolpoolsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Pool_filter>;
};

export type DexAmmProtocol_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_gt?: InputMaybe<Scalars['String']['input']>;
  slug_lt?: InputMaybe<Scalars['String']['input']>;
  slug_gte?: InputMaybe<Scalars['String']['input']>;
  slug_lte?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_lt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_lte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_lt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_lte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_lt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_lte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Network>;
  network_not?: InputMaybe<Network>;
  network_in?: InputMaybe<Array<Network>>;
  network_not_in?: InputMaybe<Array<Network>>;
  type?: InputMaybe<ProtocolType>;
  type_not?: InputMaybe<ProtocolType>;
  type_in?: InputMaybe<Array<ProtocolType>>;
  type_not_in?: InputMaybe<Array<ProtocolType>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueLPs?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueLPs_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueLPs_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueLPs_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueLPs_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueLPs_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueLPs_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueLPs_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueTraders?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueTraders_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueTraders_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueTraders_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueTraders_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueTraders_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueTraders_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueTraders_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativePositionCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativePositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativePositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativePositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativePositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativePositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativePositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativePositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotDayID?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_not?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotDayID_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyUsageMetrics_?: InputMaybe<UsageMetricsDailySnapshot_filter>;
  hourlyUsageMetrics_?: InputMaybe<UsageMetricsHourlySnapshot_filter>;
  financialMetrics_?: InputMaybe<FinancialsDailySnapshot_filter>;
  pools_?: InputMaybe<Pool_filter>;
  _regenesis?: InputMaybe<Scalars['Boolean']['input']>;
  _regenesis_not?: InputMaybe<Scalars['Boolean']['input']>;
  _regenesis_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _regenesis_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DexAmmProtocol_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DexAmmProtocol_filter>>>;
};

export type DexAmmProtocol_orderBy =
  | 'id'
  | 'name'
  | 'slug'
  | 'schemaVersion'
  | 'subgraphVersion'
  | 'methodologyVersion'
  | 'network'
  | 'type'
  | 'totalValueLockedUSD'
  | 'totalLiquidityUSD'
  | 'activeLiquidityUSD'
  | 'uncollectedProtocolSideValueUSD'
  | 'uncollectedSupplySideValueUSD'
  | 'protocolControlledValueUSD'
  | 'cumulativeVolumeUSD'
  | 'cumulativeSupplySideRevenueUSD'
  | 'cumulativeProtocolSideRevenueUSD'
  | 'cumulativeTotalRevenueUSD'
  | 'cumulativeUniqueUsers'
  | 'cumulativeUniqueLPs'
  | 'cumulativeUniqueTraders'
  | 'totalPoolCount'
  | 'openPositionCount'
  | 'cumulativePositionCount'
  | 'lastSnapshotDayID'
  | 'lastUpdateTimestamp'
  | 'lastUpdateBlockNumber'
  | 'dailyUsageMetrics'
  | 'hourlyUsageMetrics'
  | 'financialMetrics'
  | 'pools'
  | '_regenesis';

export type FinancialsDailySnapshot = {
  /**  ID is # of days since Unix epoch time  */
  id: Scalars['Bytes']['output'];
  /**  Number of days since Unix epoch time  */
  day: Scalars['Int']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: DexAmmProtocol;
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The sum of all active and non-active liquidity in USD for this pool.  */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All liquidity in USD that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All protocol-side value locking in USD that remains uncollected and unused in the protocol.  */
  uncollectedProtocolSideValueUSD: Scalars['BigDecimal']['output'];
  /**  All supply-side value locking in USD that remains uncollected and unused in the protocol.  */
  uncollectedSupplySideValueUSD: Scalars['BigDecimal']['output'];
  /**  Current PCV (Protocol Controlled Value). Only relevant for protocols with PCV.  */
  protocolControlledValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  All trade volume occurred in a given day, in USD  */
  dailyVolumeUSD: Scalars['BigDecimal']['output'];
  /**  All historical trade volume in USD  */
  cumulativeVolumeUSD: Scalars['BigDecimal']['output'];
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  dailySupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  dailyProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  dailyTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Timestamp of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  timestamp: Scalars['BigInt']['output'];
  /**  Block number of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  blockNumber: Scalars['BigInt']['output'];
};

export type FinancialsDailySnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedProtocolSideValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  uncollectedSupplySideValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FinancialsDailySnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<FinancialsDailySnapshot_filter>>>;
};

export type FinancialsDailySnapshot_orderBy =
  | 'id'
  | 'day'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'totalValueLockedUSD'
  | 'totalLiquidityUSD'
  | 'activeLiquidityUSD'
  | 'uncollectedProtocolSideValueUSD'
  | 'uncollectedSupplySideValueUSD'
  | 'protocolControlledValueUSD'
  | 'dailyVolumeUSD'
  | 'cumulativeVolumeUSD'
  | 'dailySupplySideRevenueUSD'
  | 'cumulativeSupplySideRevenueUSD'
  | 'dailyProtocolSideRevenueUSD'
  | 'cumulativeProtocolSideRevenueUSD'
  | 'dailyTotalRevenueUSD'
  | 'cumulativeTotalRevenueUSD'
  | 'timestamp'
  | 'blockNumber';

export type Network =
  | 'ARBITRUM_ONE'
  | 'ARWEAVE_MAINNET'
  | 'AURORA'
  | 'AVALANCHE'
  | 'BASE'
  | 'BOBA'
  | 'BSC'
  | 'CELO'
  | 'COSMOS'
  | 'CRONOS'
  | 'MAINNET'
  | 'FANTOM'
  | 'FUSE'
  | 'HARMONY'
  | 'JUNO'
  | 'MOONBEAM'
  | 'MOONRIVER'
  | 'NEAR_MAINNET'
  | 'OPTIMISM'
  | 'OSMOSIS'
  | 'MATIC'
  | 'XDAI'
  | 'SEPOLIA';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Pool = {
  /**  Smart contract address of the pool  */
  id: Scalars['Bytes']['output'];
  /**  The protocol this pool belongs to  */
  protocol: DexAmmProtocol;
  /**  Name of liquidity pool (e.g. Curve.fi DAI/USDC/USDT)  */
  name?: Maybe<Scalars['String']['output']>;
  /**  Symbol of liquidity pool (e.g. 3CRV)  */
  symbol?: Maybe<Scalars['String']['output']>;
  /**  Token that is to represent ownership of liquidity  */
  liquidityToken?: Maybe<Token>;
  /**  Type of token used to track liquidity  */
  liquidityTokenType?: Maybe<TokenType>;
  /**  Tokens that need to be deposited to take a position in protocol. e.g. WETH and USDC to deposit into the WETH-USDC pool. Array to account for multi-asset pools like Curve and Balancer  */
  inputTokens: Array<Token>;
  /**  Fees per trade incurred to the user. Should include all fees that apply to a pool (e.g. Curve has a trading fee AND an admin fee, which is a portion of the trading fee. Uniswap only has a trading fee and no protocol fee. )  */
  fees: Array<PoolFee>;
  /**  Whether this pool is single-sided (e.g. Bancor, Platypus's Alternative Pool). The specifics of the implementation depends on the protocol.  */
  isSingleSided: Scalars['Boolean']['output'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  /**  Creation block number  */
  createdBlockNumber: Scalars['BigInt']['output'];
  /**  Current tick representing the price of token0/token1  */
  tick?: Maybe<Scalars['BigInt']['output']>;
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The sum of all active and non-active liquidity for this pool.  */
  totalLiquidity: Scalars['BigInt']['output'];
  /**  The sum of all active and non-active liquidity in USD for this pool.  */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All liquidity `k` that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidity: Scalars['BigInt']['output'];
  /**  All liquidity in USD that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All protocol-side value locked in token amounts that remains uncollected and unused in the pool.  */
  uncollectedProtocolSideTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  All protocol-side value locking in USD that remains uncollected and unused in the pool.  */
  uncollectedProtocolSideValuesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All supply-side value locked in token amounts that remains uncollected and unused in the pool.  */
  uncollectedSupplySideTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  All supply-side value locked in USD that remains uncollected and unused in the pool.  */
  uncollectedSupplySideValuesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All revenue generated by the liquidity pool, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the liquidity pool, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the liquidity pool.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All trade volume occurred for a specific input token, in native amount. The ordering should be the same as the pool's `inputTokens` field.  */
  cumulativeVolumeByTokenAmount: Array<Scalars['BigInt']['output']>;
  /**  All trade volume occurred for a specific input token, in USD. The ordering should be the same as the pool's `inputTokens` field.  */
  cumulativeVolumeByTokenUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All historical trade volume occurred in this pool, in USD  */
  cumulativeVolumeUSD: Scalars['BigDecimal']['output'];
  /**  Amount of input tokens in the pool. The ordering should be the same as the pool's `inputTokens` field.  */
  inputTokenBalances: Array<Scalars['BigInt']['output']>;
  /**  Amount of input tokens in USD in the pool. The ordering should be the same as the pool's `inputTokens` field.  */
  inputTokenBalancesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  Total supply of output tokens that are staked. Used to calculate reward APY.  */
  stakedTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Per-block reward token emission as of the current block normalized to a day, in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Total number of deposits (add liquidity)  */
  cumulativeDepositCount: Scalars['Int']['output'];
  /**  Total number of withdrawals (remove liquidity)  */
  cumulativeWithdrawCount: Scalars['Int']['output'];
  /**  Total number of trades (swaps)  */
  cumulativeSwapCount: Scalars['Int']['output'];
  /**  All positions in this market  */
  positions: Array<Position>;
  /**  Number of positions in this market  */
  positionCount: Scalars['Int']['output'];
  /**  Number of open positions in this market  */
  openPositionCount: Scalars['Int']['output'];
  /**  Number of closed positions in this market  */
  closedPositionCount: Scalars['Int']['output'];
  /**  Day ID of the most recent daily snapshot  */
  lastSnapshotDayID: Scalars['Int']['output'];
  /**  Hour ID of the most recent hourly snapshot  */
  lastSnapshotHourID: Scalars['Int']['output'];
  /**  Timestamp of the last time this entity was updated  */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /**  Block number of the last time this entity was updated  */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /**  Liquidity pool daily snapshots  */
  dailySnapshots: Array<PoolDailySnapshot>;
  /**  Liquidity pool hourly snapshots  */
  hourlySnapshots: Array<PoolHourlySnapshot>;
  /**  All deposit (add liquidity) events occurred in this pool  */
  deposits: Array<Deposit>;
  /**  All withdraw (remove liquidity) events occurred in this pool  */
  withdraws: Array<Withdraw>;
  /**  All trade (swap) events occurred in this pool  */
  swaps: Array<Swap>;
};


export type PoolinputTokensArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
};


export type PoolfeesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolFee_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolFee_filter>;
};


export type PoolpositionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
};


export type PooldailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolDailySnapshot_filter>;
};


export type PoolhourlySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolHourlySnapshot_filter>;
};


export type PooldepositsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
};


export type PoolwithdrawsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Withdraw_filter>;
};


export type PoolswapsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Swap_filter>;
};

export type PoolDailySnapshot = {
  /**  { Smart contract address of the pool }-{ # of days since Unix epoch time }  */
  id: Scalars['Bytes']['output'];
  /**  Number of days since Unix epoch time  */
  day: Scalars['Int']['output'];
  /**  The protocol this snapshot belongs to  */
  protocol: DexAmmProtocol;
  /**  The pool this snapshot belongs to  */
  pool: Pool;
  /**  Current tick representing the price of token0/token1  */
  tick?: Maybe<Scalars['BigInt']['output']>;
  /**  Current TVL (Total Value Locked) of this pool  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The sum of all active and non-active liquidity for this pool.  */
  totalLiquidity: Scalars['BigInt']['output'];
  /**  The sum of all active and non-active liquidity in USD for this pool.  */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All liquidity `k` that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidity: Scalars['BigInt']['output'];
  /**  All liquidity in USD that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All protocol-side value locked in token amounts that remains uncollected and unused in the pool.  */
  uncollectedProtocolSideTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  All protocol-side value locking in USD that remains uncollected and unused in the pool.  */
  uncollectedProtocolSideValuesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All supply-side value locked in token amounts that remains uncollected and unused in the pool.  */
  uncollectedSupplySideTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  All supply-side value locked in USD that remains uncollected and unused in the pool.  */
  uncollectedSupplySideValuesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All revenue generated by the liquidity pool, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Daily revenue generated by the liquidity pool, accrued to the supply side.  */
  dailySupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the liquidity pool, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Daily revenue generated by the liquidity pool, accrued to the protocol.  */
  dailyProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the liquidity pool.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Daily revenue generated by the liquidity pool.  */
  dailyTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All historical trade volume occurred in this pool, in USD  */
  cumulativeVolumeUSD: Scalars['BigDecimal']['output'];
  /**  All trade volume occurred in a given day, in USD  */
  dailyVolumeUSD: Scalars['BigDecimal']['output'];
  /**  All trade volume , in native amount. The ordering should be the same as the pool's `inputTokens` field.  */
  cumulativeVolumeByTokenAmount: Array<Scalars['BigInt']['output']>;
  /**  All trade volume occurred in a given day for a specific input token, in native amount. The ordering should be the same as the pool's `inputTokens` field.  */
  dailyVolumeByTokenAmount: Array<Scalars['BigInt']['output']>;
  /**  All trade volume, in USD. The ordering should be the same as the pool's `inputTokens` field.  */
  cumulativeVolumeByTokenUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All trade volume occurred in a given day for a specific input token, in USD. The ordering should be the same as the pool's `inputTokens` field.  */
  dailyVolumeByTokenUSD: Array<Scalars['BigDecimal']['output']>;
  /**  Amount of input tokens in the pool. The ordering should be the same as the pool's `inputTokens` field.  */
  inputTokenBalances: Array<Scalars['BigInt']['output']>;
  /**  Amount of input tokens in USD in the pool. The ordering should be the same as the pool's `inputTokens` field.  */
  inputTokenBalancesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  Total supply of output tokens that are staked. Used to calculate reward APY.  */
  stakedTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Per-block reward token emission as of the current block normalized to a day, in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Total number of deposits (add liquidity)  */
  cumulativeDepositCount: Scalars['Int']['output'];
  /**  Total number of deposits (add liquidity) in a day  */
  dailyDepositCount: Scalars['Int']['output'];
  /**  Total number of withdrawals (remove liquidity)  */
  cumulativeWithdrawCount: Scalars['Int']['output'];
  /**  Total number of withdrawals (remove liquidity) in a day  */
  dailyWithdrawCount: Scalars['Int']['output'];
  /**  Total number of trades (swaps)  */
  cumulativeSwapCount: Scalars['Int']['output'];
  /**  Total number of trades (swaps) in a day  */
  dailySwapCount: Scalars['Int']['output'];
  /**  Number of positions in this market  */
  positionCount: Scalars['Int']['output'];
  /**  Number of open positions in this market  */
  openPositionCount: Scalars['Int']['output'];
  /**  Number of closed positions in this market  */
  closedPositionCount: Scalars['Int']['output'];
  /**  Timestamp of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  timestamp: Scalars['BigInt']['output'];
  /**  Block number of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  blockNumber: Scalars['BigInt']['output'];
};

export type PoolDailySnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  tick?: InputMaybe<Scalars['BigInt']['input']>;
  tick_not?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tick_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidity?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  activeLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  activeLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideValuesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideValuesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolumeByTokenAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolumeByTokenAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolumeByTokenAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolumeByTokenAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolumeByTokenAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolumeByTokenAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeByTokenUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeByTokenUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeByTokenUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeByTokenUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeByTokenUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeByTokenUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalances?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalancesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeDepositCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyDepositCount?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeSwapCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeSwapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailySwapCount?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailySwapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positionCount?: InputMaybe<Scalars['Int']['input']>;
  positionCount_not?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolDailySnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PoolDailySnapshot_filter>>>;
};

export type PoolDailySnapshot_orderBy =
  | 'id'
  | 'day'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'tick'
  | 'totalValueLockedUSD'
  | 'totalLiquidity'
  | 'totalLiquidityUSD'
  | 'activeLiquidity'
  | 'activeLiquidityUSD'
  | 'uncollectedProtocolSideTokenAmounts'
  | 'uncollectedProtocolSideValuesUSD'
  | 'uncollectedSupplySideTokenAmounts'
  | 'uncollectedSupplySideValuesUSD'
  | 'cumulativeSupplySideRevenueUSD'
  | 'dailySupplySideRevenueUSD'
  | 'cumulativeProtocolSideRevenueUSD'
  | 'dailyProtocolSideRevenueUSD'
  | 'cumulativeTotalRevenueUSD'
  | 'dailyTotalRevenueUSD'
  | 'cumulativeVolumeUSD'
  | 'dailyVolumeUSD'
  | 'cumulativeVolumeByTokenAmount'
  | 'dailyVolumeByTokenAmount'
  | 'cumulativeVolumeByTokenUSD'
  | 'dailyVolumeByTokenUSD'
  | 'inputTokenBalances'
  | 'inputTokenBalancesUSD'
  | 'stakedTokenAmount'
  | 'rewardTokenEmissionsAmount'
  | 'rewardTokenEmissionsUSD'
  | 'cumulativeDepositCount'
  | 'dailyDepositCount'
  | 'cumulativeWithdrawCount'
  | 'dailyWithdrawCount'
  | 'cumulativeSwapCount'
  | 'dailySwapCount'
  | 'positionCount'
  | 'openPositionCount'
  | 'closedPositionCount'
  | 'timestamp'
  | 'blockNumber';

export type PoolFee = {
  /**  { Fee type }-{ Pool address }  */
  id: Scalars['Bytes']['output'];
  /**  Fee as a percentage of the trade (swap) amount. Does not always apply  */
  feePercentage?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Type of fee this pool uses  */
  feeType: PoolFeeType;
};

export type PoolFeeType =
  /**  Total fixed fee paid by the user per trade, as a percentage of the traded amount. e.g. 0.3% for Uniswap v2, 0.3% for Sushiswap, 0.04% for Curve v1.  */
  | 'FIXED_TRADING_FEE'
  /**  Some protocols use tiered fees instead of fixed fee (e.g. DYDX, DODO). Set `feePercentage` as 0 but handle the tiered fees in the mapping code.  */
  | 'TIERED_TRADING_FEE'
  /**  Some protocols use dynamic fees instead of fixed fee (e.g. Balancer v2). Set `feePercentage` as 0 but handle the dynamic fees in the mapping code.  */
  | 'DYNAMIC_TRADING_FEE'
  /**  Fixed fee that's paid to the LP, as a percentage of the traded amount. e.g. 0.25% for Sushiswap, 0.02% for Curve v1.  */
  | 'FIXED_LP_FEE'
  /**  Some protocols use dynamic LP fees (e.g., Bancor v2). Set `feePercentage` as 0 but handle the dynamic fees in the mapping code.  */
  | 'DYNAMIC_LP_FEE'
  /**  Fixed fee that's paid to the protocol, as a percentage of the traded amount. e.g. 0.05% for Sushiswap, 0.02% for Curve v1.  */
  | 'FIXED_PROTOCOL_FEE'
  /**  Some protocols use dynamic protocol fees (e.g., Bancor v2). Set `feePercentage` as 0 but handle the dynamic fees in the mapping code.  */
  | 'DYNAMIC_PROTOCOL_FEE'
  /**  One-time fee charged by the protocol during deposit, in percentages of the deposit token  */
  | 'DEPOSIT_FEE'
  /**  One-time fee charged by the protocol (e.g. Bancor v3) during withdrawal, in percentages of the withdrawal token  */
  | 'WITHDRAWAL_FEE';

export type PoolFee_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  feePercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feePercentage_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeType?: InputMaybe<PoolFeeType>;
  feeType_not?: InputMaybe<PoolFeeType>;
  feeType_in?: InputMaybe<Array<PoolFeeType>>;
  feeType_not_in?: InputMaybe<Array<PoolFeeType>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolFee_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PoolFee_filter>>>;
};

export type PoolFee_orderBy =
  | 'id'
  | 'feePercentage'
  | 'feeType';

export type PoolHourlySnapshot = {
  /**  { Smart contract address of the pool }-{ # of hours since Unix epoch time }  */
  id: Scalars['Bytes']['output'];
  /**  Number of hours since Unix epoch time  */
  hour: Scalars['Int']['output'];
  /**  The protocol this snapshot belongs to  */
  protocol: DexAmmProtocol;
  /**  The pool this snapshot belongs to  */
  pool: Pool;
  /**  Current tick representing the price of token0/token1  */
  tick?: Maybe<Scalars['BigInt']['output']>;
  /**  Current TVL (Total Value Locked) of this pool  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The sum of all active and non-active liquidity for this pool.  */
  totalLiquidity: Scalars['BigInt']['output'];
  /**  The sum of all active and non-active liquidity in USD for this pool.  */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All liquidity `k` that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidity: Scalars['BigInt']['output'];
  /**  All liquidity in USD that is active. Will be equal to totalLiquidity except for in concentrated liquidity - where activeLiquidity is all liquidity positions that contain the pools current tick.  */
  activeLiquidityUSD: Scalars['BigDecimal']['output'];
  /**  All protocol-side value locked in token amounts that remains uncollected and unused in the pool.  */
  uncollectedProtocolSideTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  All protocol-side value locking in USD that remains uncollected and unused in the pool.  */
  uncollectedProtocolSideValuesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All supply-side value locked in token amounts that remains uncollected and unused in the pool.  */
  uncollectedSupplySideTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  All supply-side value locked in USD that remains uncollected and unused in the pool.  */
  uncollectedSupplySideValuesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All revenue generated by the liquidity pool, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Hourly revenue generated by the liquidity pool, accrued to the supply side.  */
  hourlySupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the liquidity pool, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Hourly revenue generated by the liquidity pool, accrued to the protocol.  */
  hourlyProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the liquidity pool.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Hourly revenue generated by the liquidity pool.  */
  hourlyTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All historical trade volume occurred in this pool, in USD  */
  cumulativeVolumeUSD: Scalars['BigDecimal']['output'];
  /**  All trade volume occurred in a given hour, in USD  */
  hourlyVolumeUSD: Scalars['BigDecimal']['output'];
  /**  All trade volume, in native amount. The ordering should be the same as the pool's `inputTokens` field.  */
  cumulativeVolumeByTokenAmount: Array<Scalars['BigInt']['output']>;
  /**  All trade volume occurred in a given hour for a specific input token, in native amount. The ordering should be the same as the pool's `inputTokens` field.  */
  hourlyVolumeByTokenAmount: Array<Scalars['BigInt']['output']>;
  /**  All trade volume, in USD. The ordering should be the same as the pool's `inputTokens` field.  */
  cumulativeVolumeByTokenUSD: Array<Scalars['BigDecimal']['output']>;
  /**  All trade volume occurred in a given hour for a specific input token, in USD. The ordering should be the same as the pool's `inputTokens` field.  */
  hourlyVolumeByTokenUSD: Array<Scalars['BigDecimal']['output']>;
  /**  Amount of input tokens in the pool. The ordering should be the same as the pool's `inputTokens` field.  */
  inputTokenBalances: Array<Scalars['BigInt']['output']>;
  /**  Amount of input tokens in USD in the pool. The ordering should be the same as the pool's `inputTokens` field.  */
  inputTokenBalancesUSD: Array<Scalars['BigDecimal']['output']>;
  /**  Total supply of output tokens that are staked. Used to calculate reward APY.  */
  stakedTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Per-block reward token emission as of the current block normalized to a day (not hour), in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Per-block reward token emission as of the current block normalized to a day (not hour), in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Total number of deposits (add liquidity)  */
  cumulativeDepositCount: Scalars['Int']['output'];
  /**  Total number of deposits (add liquidity) in an hour  */
  hourlyDepositCount: Scalars['Int']['output'];
  /**  Total number of withdrawals (remove liquidity)  */
  cumulativeWithdrawCount: Scalars['Int']['output'];
  /**  Total number of withdrawals (remove liquidity) in an hour  */
  hourlyWithdrawCount: Scalars['Int']['output'];
  /**  Total number of trades (swaps)  */
  cumulativeSwapCount: Scalars['Int']['output'];
  /**  Total number of trades (swaps) in an hour  */
  hourlySwapCount: Scalars['Int']['output'];
  /**  Number of positions in this market  */
  positionCount: Scalars['Int']['output'];
  /**  Number of open positions in this market  */
  openPositionCount: Scalars['Int']['output'];
  /**  Number of closed positions in this market  */
  closedPositionCount: Scalars['Int']['output'];
  /**  Timestamp of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  timestamp: Scalars['BigInt']['output'];
  /**  Block number of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  blockNumber: Scalars['BigInt']['output'];
};

export type PoolHourlySnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  hour_not?: InputMaybe<Scalars['Int']['input']>;
  hour_gt?: InputMaybe<Scalars['Int']['input']>;
  hour_lt?: InputMaybe<Scalars['Int']['input']>;
  hour_gte?: InputMaybe<Scalars['Int']['input']>;
  hour_lte?: InputMaybe<Scalars['Int']['input']>;
  hour_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hour_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  tick?: InputMaybe<Scalars['BigInt']['input']>;
  tick_not?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tick_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidity?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  activeLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  activeLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideValuesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideValuesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlySupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlySupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolumeByTokenAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolumeByTokenAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolumeByTokenAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolumeByTokenAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolumeByTokenAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolumeByTokenAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeByTokenUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeByTokenUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeByTokenUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeByTokenUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeByTokenUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyVolumeByTokenUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalances?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalancesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeDepositCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyDepositCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeSwapCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeSwapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlySwapCount?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlySwapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positionCount?: InputMaybe<Scalars['Int']['input']>;
  positionCount_not?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolHourlySnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PoolHourlySnapshot_filter>>>;
};

export type PoolHourlySnapshot_orderBy =
  | 'id'
  | 'hour'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'tick'
  | 'totalValueLockedUSD'
  | 'totalLiquidity'
  | 'totalLiquidityUSD'
  | 'activeLiquidity'
  | 'activeLiquidityUSD'
  | 'uncollectedProtocolSideTokenAmounts'
  | 'uncollectedProtocolSideValuesUSD'
  | 'uncollectedSupplySideTokenAmounts'
  | 'uncollectedSupplySideValuesUSD'
  | 'cumulativeSupplySideRevenueUSD'
  | 'hourlySupplySideRevenueUSD'
  | 'cumulativeProtocolSideRevenueUSD'
  | 'hourlyProtocolSideRevenueUSD'
  | 'cumulativeTotalRevenueUSD'
  | 'hourlyTotalRevenueUSD'
  | 'cumulativeVolumeUSD'
  | 'hourlyVolumeUSD'
  | 'cumulativeVolumeByTokenAmount'
  | 'hourlyVolumeByTokenAmount'
  | 'cumulativeVolumeByTokenUSD'
  | 'hourlyVolumeByTokenUSD'
  | 'inputTokenBalances'
  | 'inputTokenBalancesUSD'
  | 'stakedTokenAmount'
  | 'rewardTokenEmissionsAmount'
  | 'rewardTokenEmissionsUSD'
  | 'cumulativeDepositCount'
  | 'hourlyDepositCount'
  | 'cumulativeWithdrawCount'
  | 'hourlyWithdrawCount'
  | 'cumulativeSwapCount'
  | 'hourlySwapCount'
  | 'positionCount'
  | 'openPositionCount'
  | 'closedPositionCount'
  | 'timestamp'
  | 'blockNumber';

export type Pool_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_gt?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_lt?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_gte?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_lte?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityToken_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_?: InputMaybe<Token_filter>;
  liquidityTokenType?: InputMaybe<TokenType>;
  liquidityTokenType_not?: InputMaybe<TokenType>;
  liquidityTokenType_in?: InputMaybe<Array<TokenType>>;
  liquidityTokenType_not_in?: InputMaybe<Array<TokenType>>;
  inputTokens?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_?: InputMaybe<Token_filter>;
  fees?: InputMaybe<Array<Scalars['String']['input']>>;
  fees_not?: InputMaybe<Array<Scalars['String']['input']>>;
  fees_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  fees_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  fees_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  fees_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  fees_?: InputMaybe<PoolFee_filter>;
  isSingleSided?: InputMaybe<Scalars['Boolean']['input']>;
  isSingleSided_not?: InputMaybe<Scalars['Boolean']['input']>;
  isSingleSided_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isSingleSided_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tick?: InputMaybe<Scalars['BigInt']['input']>;
  tick_not?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tick_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidity?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  activeLiquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  activeLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  activeLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  activeLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  activeLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedProtocolSideValuesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedProtocolSideValuesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uncollectedSupplySideValuesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  uncollectedSupplySideValuesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolumeByTokenUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeByTokenUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalances?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalances_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalancesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalancesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeDepositCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeSwapCount?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeSwapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeSwapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positions_?: InputMaybe<Position_filter>;
  positionCount?: InputMaybe<Scalars['Int']['input']>;
  positionCount_not?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  positionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  positionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  positionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  openPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_not?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  closedPositionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  closedPositionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotDayID?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_not?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotDayID_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotHourID?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_not?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotHourID_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailySnapshots_?: InputMaybe<PoolDailySnapshot_filter>;
  hourlySnapshots_?: InputMaybe<PoolHourlySnapshot_filter>;
  deposits_?: InputMaybe<Deposit_filter>;
  withdraws_?: InputMaybe<Withdraw_filter>;
  swaps_?: InputMaybe<Swap_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Pool_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Pool_filter>>>;
};

export type Pool_orderBy =
  | 'id'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'name'
  | 'symbol'
  | 'liquidityToken'
  | 'liquidityToken__id'
  | 'liquidityToken__name'
  | 'liquidityToken__symbol'
  | 'liquidityToken__decimals'
  | 'liquidityToken__lastPriceUSD'
  | 'liquidityToken__lastPriceBlockNumber'
  | 'liquidityToken___lastPricePool'
  | 'liquidityToken___totalSupply'
  | 'liquidityToken___totalValueLockedUSD'
  | 'liquidityToken___largePriceChangeBuffer'
  | 'liquidityToken___largeTVLImpactBuffer'
  | 'liquidityTokenType'
  | 'inputTokens'
  | 'fees'
  | 'isSingleSided'
  | 'createdTimestamp'
  | 'createdBlockNumber'
  | 'tick'
  | 'totalValueLockedUSD'
  | 'totalLiquidity'
  | 'totalLiquidityUSD'
  | 'activeLiquidity'
  | 'activeLiquidityUSD'
  | 'uncollectedProtocolSideTokenAmounts'
  | 'uncollectedProtocolSideValuesUSD'
  | 'uncollectedSupplySideTokenAmounts'
  | 'uncollectedSupplySideValuesUSD'
  | 'cumulativeSupplySideRevenueUSD'
  | 'cumulativeProtocolSideRevenueUSD'
  | 'cumulativeTotalRevenueUSD'
  | 'cumulativeVolumeByTokenAmount'
  | 'cumulativeVolumeByTokenUSD'
  | 'cumulativeVolumeUSD'
  | 'inputTokenBalances'
  | 'inputTokenBalancesUSD'
  | 'stakedTokenAmount'
  | 'rewardTokenEmissionsAmount'
  | 'rewardTokenEmissionsUSD'
  | 'cumulativeDepositCount'
  | 'cumulativeWithdrawCount'
  | 'cumulativeSwapCount'
  | 'positions'
  | 'positionCount'
  | 'openPositionCount'
  | 'closedPositionCount'
  | 'lastSnapshotDayID'
  | 'lastSnapshotHourID'
  | 'lastUpdateTimestamp'
  | 'lastUpdateBlockNumber'
  | 'dailySnapshots'
  | 'hourlySnapshots'
  | 'deposits'
  | 'withdraws'
  | 'swaps';

export type Position = {
  id: Scalars['Bytes']['output'];
  /** NonfungiblePositionManager tokenId */
  tokenId: Scalars['BigInt']['output'];
  /**  Account that owns this position  */
  account: Account;
  /**  The liquidity pool in which this position was opened  */
  pool: Pool;
  /**  Whether this position is staked in a reward program */
  isStaked: Scalars['Boolean']['output'];
  /**  The hash of the transaction that opened this position  */
  hashOpened: Scalars['Bytes']['output'];
  /**  The hash of the transaction that closed this position  */
  hashClosed?: Maybe<Scalars['Bytes']['output']>;
  /**  Block number of when the position was opened  */
  blockNumberOpened: Scalars['BigInt']['output'];
  /**  Timestamp when the position was opened  */
  timestampOpened: Scalars['BigInt']['output'];
  /**  Block number of when the position was closed (0 if still open)  */
  blockNumberClosed?: Maybe<Scalars['BigInt']['output']>;
  /**  Timestamp when the position was closed (0 if still open)  */
  timestampClosed?: Maybe<Scalars['BigInt']['output']>;
  /**  lower tick of the position  */
  tickLower?: Maybe<Tick>;
  /**  upper tick of the position  */
  tickUpper?: Maybe<Tick>;
  /**  Token that is to represent ownership of liquidity  */
  liquidityToken?: Maybe<Token>;
  /**  Type of token used to track liquidity  */
  liquidityTokenType?: Maybe<TokenType>;
  /**  total position liquidity  */
  liquidity: Scalars['BigInt']['output'];
  /**  total position liquidity in USD  */
  liquidityUSD: Scalars['BigDecimal']['output'];
  /**  amount of tokens ever deposited to position  */
  cumulativeDepositTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  amount of tokens in USD deposited to position  */
  cumulativeDepositUSD: Scalars['BigDecimal']['output'];
  /**  amount of tokens ever withdrawn from position (without fees)  */
  cumulativeWithdrawTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  amount of tokens in USD withdrawn from position (without fees)  */
  cumulativeWithdrawUSD: Scalars['BigDecimal']['output'];
  /**  Total reward token accumulated under this position, in USD  */
  cumulativeRewardUSD?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Number of deposits related to this position  */
  depositCount: Scalars['Int']['output'];
  /**  All deposit events of this position  */
  deposits: Array<Deposit>;
  /**  Number of withdrawals related to this position  */
  withdrawCount: Scalars['Int']['output'];
  /**  All withdraw events of this position  */
  withdraws: Array<Withdraw>;
  /**  Position daily snapshots for open positions  */
  snapshots: Array<PositionSnapshot>;
};


export type PositiondepositsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
};


export type PositionwithdrawsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Withdraw_filter>;
};


export type PositionsnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PositionSnapshot_filter>;
};

export type PositionSnapshot = {
  /**  { Position ID }-{ Transaction hash }-{ Log index }  */
  id: Scalars['Bytes']['output'];
  /**  Transaction hash of the transaction that triggered this snapshot  */
  hash: Scalars['Bytes']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Nonce of the transaction that triggered this snapshot  */
  nonce: Scalars['BigInt']['output'];
  /**  Position of this snapshot  */
  position: Position;
  /**  Type of token used to track liquidity  */
  liquidityTokenType?: Maybe<TokenType>;
  /**  total position liquidity  */
  liquidity?: Maybe<Scalars['BigInt']['output']>;
  /**  total position liquidity in USD  */
  liquidityUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  amount of tokens ever deposited to position  */
  cumulativeDepositTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  amount of tokens in USD deposited to position  */
  cumulativeDepositUSD: Scalars['BigDecimal']['output'];
  /**  amount of tokens ever withdrawn from position (without fees)  */
  cumulativeWithdrawTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  amount of tokens in USD withdrawn from position (without fees)  */
  cumulativeWithdrawUSD: Scalars['BigDecimal']['output'];
  /**  Total reward token accumulated under this position, in native amounts  */
  cumulativeRewardTokenAmounts?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Total reward token accumulated under this position, in USD  */
  cumulativeRewardUSD?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Number of deposits related to this position  */
  depositCount: Scalars['Int']['output'];
  /**  Number of withdrawals related to this position  */
  withdrawCount: Scalars['Int']['output'];
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type PositionSnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nonce?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_filter>;
  liquidityTokenType?: InputMaybe<TokenType>;
  liquidityTokenType_not?: InputMaybe<TokenType>;
  liquidityTokenType_in?: InputMaybe<Array<TokenType>>;
  liquidityTokenType_not_in?: InputMaybe<Array<TokenType>>;
  liquidity?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeDepositTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeDepositUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeWithdrawTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeWithdrawUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRewardTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositCount?: InputMaybe<Scalars['Int']['input']>;
  depositCount_not?: InputMaybe<Scalars['Int']['input']>;
  depositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  depositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  depositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  depositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  depositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  depositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdrawCount?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PositionSnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PositionSnapshot_filter>>>;
};

export type PositionSnapshot_orderBy =
  | 'id'
  | 'hash'
  | 'logIndex'
  | 'nonce'
  | 'position'
  | 'position__id'
  | 'position__tokenId'
  | 'position__isStaked'
  | 'position__hashOpened'
  | 'position__hashClosed'
  | 'position__blockNumberOpened'
  | 'position__timestampOpened'
  | 'position__blockNumberClosed'
  | 'position__timestampClosed'
  | 'position__liquidityTokenType'
  | 'position__liquidity'
  | 'position__liquidityUSD'
  | 'position__cumulativeDepositUSD'
  | 'position__cumulativeWithdrawUSD'
  | 'position__depositCount'
  | 'position__withdrawCount'
  | 'liquidityTokenType'
  | 'liquidity'
  | 'liquidityUSD'
  | 'cumulativeDepositTokenAmounts'
  | 'cumulativeDepositUSD'
  | 'cumulativeWithdrawTokenAmounts'
  | 'cumulativeWithdrawUSD'
  | 'cumulativeRewardTokenAmounts'
  | 'cumulativeRewardUSD'
  | 'depositCount'
  | 'withdrawCount'
  | 'blockNumber'
  | 'timestamp';

export type Position_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tokenId?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_filter>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  isStaked?: InputMaybe<Scalars['Boolean']['input']>;
  isStaked_not?: InputMaybe<Scalars['Boolean']['input']>;
  isStaked_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isStaked_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  hashOpened?: InputMaybe<Scalars['Bytes']['input']>;
  hashOpened_not?: InputMaybe<Scalars['Bytes']['input']>;
  hashOpened_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hashOpened_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hashOpened_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hashOpened_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hashOpened_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashOpened_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashOpened_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hashOpened_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed_not?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashClosed_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashClosed_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hashClosed_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  blockNumberOpened?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberOpened_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberOpened_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberOpened_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberOpened_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberOpened_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberOpened_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumberOpened_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestampOpened?: InputMaybe<Scalars['BigInt']['input']>;
  timestampOpened_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestampOpened_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestampOpened_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestampOpened_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestampOpened_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestampOpened_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestampOpened_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumberClosed?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberClosed_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberClosed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberClosed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberClosed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberClosed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberClosed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumberClosed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestampClosed?: InputMaybe<Scalars['BigInt']['input']>;
  timestampClosed_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestampClosed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestampClosed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestampClosed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestampClosed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestampClosed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestampClosed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickLower?: InputMaybe<Scalars['String']['input']>;
  tickLower_not?: InputMaybe<Scalars['String']['input']>;
  tickLower_gt?: InputMaybe<Scalars['String']['input']>;
  tickLower_lt?: InputMaybe<Scalars['String']['input']>;
  tickLower_gte?: InputMaybe<Scalars['String']['input']>;
  tickLower_lte?: InputMaybe<Scalars['String']['input']>;
  tickLower_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tickLower_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tickLower_contains?: InputMaybe<Scalars['String']['input']>;
  tickLower_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tickLower_not_contains?: InputMaybe<Scalars['String']['input']>;
  tickLower_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tickLower_starts_with?: InputMaybe<Scalars['String']['input']>;
  tickLower_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickLower_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tickLower_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickLower_ends_with?: InputMaybe<Scalars['String']['input']>;
  tickLower_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickLower_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tickLower_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickLower_?: InputMaybe<Tick_filter>;
  tickUpper?: InputMaybe<Scalars['String']['input']>;
  tickUpper_not?: InputMaybe<Scalars['String']['input']>;
  tickUpper_gt?: InputMaybe<Scalars['String']['input']>;
  tickUpper_lt?: InputMaybe<Scalars['String']['input']>;
  tickUpper_gte?: InputMaybe<Scalars['String']['input']>;
  tickUpper_lte?: InputMaybe<Scalars['String']['input']>;
  tickUpper_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tickUpper_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tickUpper_contains?: InputMaybe<Scalars['String']['input']>;
  tickUpper_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tickUpper_not_contains?: InputMaybe<Scalars['String']['input']>;
  tickUpper_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tickUpper_starts_with?: InputMaybe<Scalars['String']['input']>;
  tickUpper_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickUpper_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tickUpper_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickUpper_ends_with?: InputMaybe<Scalars['String']['input']>;
  tickUpper_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickUpper_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tickUpper_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tickUpper_?: InputMaybe<Tick_filter>;
  liquidityToken?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_gt?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_lt?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_gte?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_lte?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityToken_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityToken_?: InputMaybe<Token_filter>;
  liquidityTokenType?: InputMaybe<TokenType>;
  liquidityTokenType_not?: InputMaybe<TokenType>;
  liquidityTokenType_in?: InputMaybe<Array<TokenType>>;
  liquidityTokenType_not_in?: InputMaybe<Array<TokenType>>;
  liquidity?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeDepositTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeDepositUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeDepositUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeDepositUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeWithdrawTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWithdrawUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeWithdrawUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeWithdrawUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRewardUSD?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRewardUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositCount?: InputMaybe<Scalars['Int']['input']>;
  depositCount_not?: InputMaybe<Scalars['Int']['input']>;
  depositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  depositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  depositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  depositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  depositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  depositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deposits_?: InputMaybe<Deposit_filter>;
  withdrawCount?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  withdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdraws_?: InputMaybe<Withdraw_filter>;
  snapshots_?: InputMaybe<PositionSnapshot_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Position_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Position_filter>>>;
};

export type Position_orderBy =
  | 'id'
  | 'tokenId'
  | 'account'
  | 'account__id'
  | 'account__positionCount'
  | 'account__openPositionCount'
  | 'account__closedPositionCount'
  | 'account__depositCount'
  | 'account__withdrawCount'
  | 'account__swapCount'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'isStaked'
  | 'hashOpened'
  | 'hashClosed'
  | 'blockNumberOpened'
  | 'timestampOpened'
  | 'blockNumberClosed'
  | 'timestampClosed'
  | 'tickLower'
  | 'tickLower__id'
  | 'tickLower__index'
  | 'tickLower__createdTimestamp'
  | 'tickLower__createdBlockNumber'
  | 'tickLower__liquidityGross'
  | 'tickLower__liquidityGrossUSD'
  | 'tickLower__liquidityNet'
  | 'tickLower__liquidityNetUSD'
  | 'tickLower__lastSnapshotDayID'
  | 'tickLower__lastSnapshotHourID'
  | 'tickLower__lastUpdateTimestamp'
  | 'tickLower__lastUpdateBlockNumber'
  | 'tickUpper'
  | 'tickUpper__id'
  | 'tickUpper__index'
  | 'tickUpper__createdTimestamp'
  | 'tickUpper__createdBlockNumber'
  | 'tickUpper__liquidityGross'
  | 'tickUpper__liquidityGrossUSD'
  | 'tickUpper__liquidityNet'
  | 'tickUpper__liquidityNetUSD'
  | 'tickUpper__lastSnapshotDayID'
  | 'tickUpper__lastSnapshotHourID'
  | 'tickUpper__lastUpdateTimestamp'
  | 'tickUpper__lastUpdateBlockNumber'
  | 'liquidityToken'
  | 'liquidityToken__id'
  | 'liquidityToken__name'
  | 'liquidityToken__symbol'
  | 'liquidityToken__decimals'
  | 'liquidityToken__lastPriceUSD'
  | 'liquidityToken__lastPriceBlockNumber'
  | 'liquidityToken___lastPricePool'
  | 'liquidityToken___totalSupply'
  | 'liquidityToken___totalValueLockedUSD'
  | 'liquidityToken___largePriceChangeBuffer'
  | 'liquidityToken___largeTVLImpactBuffer'
  | 'liquidityTokenType'
  | 'liquidity'
  | 'liquidityUSD'
  | 'cumulativeDepositTokenAmounts'
  | 'cumulativeDepositUSD'
  | 'cumulativeWithdrawTokenAmounts'
  | 'cumulativeWithdrawUSD'
  | 'cumulativeRewardUSD'
  | 'depositCount'
  | 'deposits'
  | 'withdrawCount'
  | 'withdraws'
  | 'snapshots';

export type Protocol = {
  /**  Smart contract address of the protocol's main contract (Factory, Registry, etc)  */
  id: Scalars['Bytes']['output'];
  /**  Name of the protocol, including version. e.g. Uniswap v3  */
  name: Scalars['String']['output'];
  /**  Slug of protocol, including version. e.g. uniswap-v3  */
  slug: Scalars['String']['output'];
  /**  Version of the subgraph schema, in SemVer format (e.g. 1.0.0)  */
  schemaVersion: Scalars['String']['output'];
  /**  Version of the subgraph implementation, in SemVer format (e.g. 1.0.0)  */
  subgraphVersion: Scalars['String']['output'];
  /**  Version of the methodology used to compute metrics, loosely based on SemVer format (e.g. 1.0.0)  */
  methodologyVersion: Scalars['String']['output'];
  /**  The blockchain network this subgraph is indexing on  */
  network: Network;
  /**  The type of protocol (e.g. DEX, Lending, Yield, etc)  */
  type: ProtocolType;
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  Current PCV (Protocol Controlled Value). Only relevant for protocols with PCV.  */
  protocolControlledValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Total number of pools  */
  totalPoolCount: Scalars['Int']['output'];
  /**  Daily usage metrics for this protocol  */
  dailyUsageMetrics: Array<UsageMetricsDailySnapshot>;
  /**  Hourly usage metrics for this protocol  */
  hourlyUsageMetrics: Array<UsageMetricsHourlySnapshot>;
  /**  Daily financial metrics for this protocol  */
  financialMetrics: Array<FinancialsDailySnapshot>;
};


export type ProtocoldailyUsageMetricsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsDailySnapshot_filter>;
};


export type ProtocolhourlyUsageMetricsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsHourlySnapshot_filter>;
};


export type ProtocolfinancialMetricsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FinancialsDailySnapshot_filter>;
};

export type ProtocolType =
  | 'EXCHANGE'
  | 'LENDING'
  | 'YIELD'
  | 'BRIDGE'
  | 'GENERIC';

export type Protocol_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_gt?: InputMaybe<Scalars['String']['input']>;
  slug_lt?: InputMaybe<Scalars['String']['input']>;
  slug_gte?: InputMaybe<Scalars['String']['input']>;
  slug_lte?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_lt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_lte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_lt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_lte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_lt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_lte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Network>;
  network_not?: InputMaybe<Network>;
  network_in?: InputMaybe<Array<Network>>;
  network_not_in?: InputMaybe<Array<Network>>;
  type?: InputMaybe<ProtocolType>;
  type_not?: InputMaybe<ProtocolType>;
  type_in?: InputMaybe<Array<ProtocolType>>;
  type_not_in?: InputMaybe<Array<ProtocolType>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyUsageMetrics_?: InputMaybe<UsageMetricsDailySnapshot_filter>;
  hourlyUsageMetrics_?: InputMaybe<UsageMetricsHourlySnapshot_filter>;
  financialMetrics_?: InputMaybe<FinancialsDailySnapshot_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Protocol_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Protocol_filter>>>;
};

export type Protocol_orderBy =
  | 'id'
  | 'name'
  | 'slug'
  | 'schemaVersion'
  | 'subgraphVersion'
  | 'methodologyVersion'
  | 'network'
  | 'type'
  | 'totalValueLockedUSD'
  | 'protocolControlledValueUSD'
  | 'cumulativeSupplySideRevenueUSD'
  | 'cumulativeProtocolSideRevenueUSD'
  | 'cumulativeTotalRevenueUSD'
  | 'cumulativeUniqueUsers'
  | 'totalPoolCount'
  | 'dailyUsageMetrics'
  | 'hourlyUsageMetrics'
  | 'financialMetrics';

export type Query = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  poolFee?: Maybe<PoolFee>;
  poolFees: Array<PoolFee>;
  dexAmmProtocol?: Maybe<DexAmmProtocol>;
  dexAmmProtocols: Array<DexAmmProtocol>;
  usageMetricsDailySnapshot?: Maybe<UsageMetricsDailySnapshot>;
  usageMetricsDailySnapshots: Array<UsageMetricsDailySnapshot>;
  usageMetricsHourlySnapshot?: Maybe<UsageMetricsHourlySnapshot>;
  usageMetricsHourlySnapshots: Array<UsageMetricsHourlySnapshot>;
  financialsDailySnapshot?: Maybe<FinancialsDailySnapshot>;
  financialsDailySnapshots: Array<FinancialsDailySnapshot>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  poolDailySnapshot?: Maybe<PoolDailySnapshot>;
  poolDailySnapshots: Array<PoolDailySnapshot>;
  poolHourlySnapshot?: Maybe<PoolHourlySnapshot>;
  poolHourlySnapshots: Array<PoolHourlySnapshot>;
  tick?: Maybe<Tick>;
  ticks: Array<Tick>;
  tickDailySnapshot?: Maybe<TickDailySnapshot>;
  tickDailySnapshots: Array<TickDailySnapshot>;
  tickHourlySnapshot?: Maybe<TickHourlySnapshot>;
  tickHourlySnapshots: Array<TickHourlySnapshot>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  positionSnapshot?: Maybe<PositionSnapshot>;
  positionSnapshots: Array<PositionSnapshot>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  withdraw?: Maybe<Withdraw>;
  withdraws: Array<Withdraw>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  activeAccount?: Maybe<ActiveAccount>;
  activeAccounts: Array<ActiveAccount>;
  helperStore?: Maybe<_HelperStore>;
  helperStores: Array<_HelperStore>;
  protocol?: Maybe<Protocol>;
  protocols: Array<Protocol>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerytokenArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokensArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrewardArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrewardsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Reward_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Reward_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolFeeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolFeesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolFee_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolFee_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydexAmmProtocolArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydexAmmProtocolsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DexAmmProtocol_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DexAmmProtocol_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryusageMetricsDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryusageMetricsDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryusageMetricsHourlySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryusageMetricsHourlySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsHourlySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfinancialsDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfinancialsDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FinancialsDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Pool_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolHourlySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolHourlySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolHourlySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytickArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryticksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Tick_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Tick_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytickDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytickDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TickDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TickDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytickHourlySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytickHourlySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TickHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TickHourlySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypositionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypositionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypositionSnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PositionSnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydepositArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydepositsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerywithdrawArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerywithdrawsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Withdraw_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryswapArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryswapsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Swap_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryactiveAccountArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryactiveAccountsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ActiveAccount_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ActiveAccount_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryhelperStoreArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryhelperStoresArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<_HelperStore_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<_HelperStore_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprotocolArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprotocolsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Protocol_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Protocol_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Reward = {
  id: Scalars['Bytes']['output'];
  createdTimestamp: Scalars['BigInt']['output'];
  createdBlockNumber: Scalars['BigInt']['output'];
  token: Token;
  amount: Scalars['BigInt']['output'];
  account: Account;
};

export type Reward_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_filter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Reward_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Reward_filter>>>;
};

export type Reward_orderBy =
  | 'id'
  | 'createdTimestamp'
  | 'createdBlockNumber'
  | 'token'
  | 'token__id'
  | 'token__name'
  | 'token__symbol'
  | 'token__decimals'
  | 'token__lastPriceUSD'
  | 'token__lastPriceBlockNumber'
  | 'token___lastPricePool'
  | 'token___totalSupply'
  | 'token___totalValueLockedUSD'
  | 'token___largePriceChangeBuffer'
  | 'token___largeTVLImpactBuffer'
  | 'amount'
  | 'account'
  | 'account__id'
  | 'account__positionCount'
  | 'account__openPositionCount'
  | 'account__closedPositionCount'
  | 'account__depositCount'
  | 'account__withdrawCount'
  | 'account__swapCount';

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  poolFee?: Maybe<PoolFee>;
  poolFees: Array<PoolFee>;
  dexAmmProtocol?: Maybe<DexAmmProtocol>;
  dexAmmProtocols: Array<DexAmmProtocol>;
  usageMetricsDailySnapshot?: Maybe<UsageMetricsDailySnapshot>;
  usageMetricsDailySnapshots: Array<UsageMetricsDailySnapshot>;
  usageMetricsHourlySnapshot?: Maybe<UsageMetricsHourlySnapshot>;
  usageMetricsHourlySnapshots: Array<UsageMetricsHourlySnapshot>;
  financialsDailySnapshot?: Maybe<FinancialsDailySnapshot>;
  financialsDailySnapshots: Array<FinancialsDailySnapshot>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  poolDailySnapshot?: Maybe<PoolDailySnapshot>;
  poolDailySnapshots: Array<PoolDailySnapshot>;
  poolHourlySnapshot?: Maybe<PoolHourlySnapshot>;
  poolHourlySnapshots: Array<PoolHourlySnapshot>;
  tick?: Maybe<Tick>;
  ticks: Array<Tick>;
  tickDailySnapshot?: Maybe<TickDailySnapshot>;
  tickDailySnapshots: Array<TickDailySnapshot>;
  tickHourlySnapshot?: Maybe<TickHourlySnapshot>;
  tickHourlySnapshots: Array<TickHourlySnapshot>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  positionSnapshot?: Maybe<PositionSnapshot>;
  positionSnapshots: Array<PositionSnapshot>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  withdraw?: Maybe<Withdraw>;
  withdraws: Array<Withdraw>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  activeAccount?: Maybe<ActiveAccount>;
  activeAccounts: Array<ActiveAccount>;
  helperStore?: Maybe<_HelperStore>;
  helperStores: Array<_HelperStore>;
  protocol?: Maybe<Protocol>;
  protocols: Array<Protocol>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptiontokenArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokensArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrewardArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrewardsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Reward_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Reward_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolFeeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolFeesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolFee_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolFee_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondexAmmProtocolArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondexAmmProtocolsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DexAmmProtocol_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DexAmmProtocol_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionusageMetricsDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionusageMetricsDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionusageMetricsHourlySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionusageMetricsHourlySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UsageMetricsHourlySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfinancialsDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfinancialsDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FinancialsDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Pool_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolHourlySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolHourlySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolHourlySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontickArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionticksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Tick_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Tick_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontickDailySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontickDailySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TickDailySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TickDailySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontickHourlySnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontickHourlySnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TickHourlySnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TickHourlySnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpositionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpositionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpositionSnapshotArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PositionSnapshot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondepositArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondepositsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionwithdrawArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionwithdrawsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Withdraw_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionswapArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionswapsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Swap_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionactiveAccountArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionactiveAccountsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ActiveAccount_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ActiveAccount_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionhelperStoreArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionhelperStoresArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<_HelperStore_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<_HelperStore_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprotocolArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprotocolsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Protocol_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Protocol_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Swap = {
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['Bytes']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['Bytes']['output'];
  /**  Nonce of the transaction that emitted this event  */
  nonce: Scalars['BigInt']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Gas limit of the transaction that emitted this event  */
  gasLimit?: Maybe<Scalars['BigInt']['output']>;
  /**  Gas used in this transaction. (Optional because not every chain will support this)  */
  gasUsed?: Maybe<Scalars['BigInt']['output']>;
  /**  Gas price of the transaction that emitted this event  */
  gasPrice?: Maybe<Scalars['BigInt']['output']>;
  /**  The protocol this transaction belongs to  */
  protocol: DexAmmProtocol;
  /**  Account that emitted this event  */
  account: Account;
  /**  The pool involving this event  */
  pool: Pool;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  the tick after the swap  */
  tick?: Maybe<Scalars['BigInt']['output']>;
  /**  Token deposited into pool  */
  tokenIn: Token;
  /**  Amount of token deposited into pool in native units  */
  amountIn: Scalars['BigInt']['output'];
  /**  Amount of token deposited into pool in USD  */
  amountInUSD: Scalars['BigDecimal']['output'];
  /**  Token withdrawn from pool  */
  tokenOut: Token;
  /**  Amount of token withdrawn from pool in native units  */
  amountOut: Scalars['BigInt']['output'];
  /**  Amount of token withdrawn from pool in USD  */
  amountOutUSD: Scalars['BigDecimal']['output'];
  /**  Amount of input tokens in the liquidity pool  */
  reserveAmounts?: Maybe<Array<Scalars['BigInt']['output']>>;
};

export type Swap_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  nonce?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_filter>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tick?: InputMaybe<Scalars['BigInt']['input']>;
  tick_not?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tick_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tick_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tick_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIn?: InputMaybe<Scalars['String']['input']>;
  tokenIn_not?: InputMaybe<Scalars['String']['input']>;
  tokenIn_gt?: InputMaybe<Scalars['String']['input']>;
  tokenIn_lt?: InputMaybe<Scalars['String']['input']>;
  tokenIn_gte?: InputMaybe<Scalars['String']['input']>;
  tokenIn_lte?: InputMaybe<Scalars['String']['input']>;
  tokenIn_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenIn_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenIn_contains?: InputMaybe<Scalars['String']['input']>;
  tokenIn_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIn_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenIn_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIn_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenIn_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIn_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenIn_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIn_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenIn_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIn_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenIn_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIn_?: InputMaybe<Token_filter>;
  amountIn?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenOut?: InputMaybe<Scalars['String']['input']>;
  tokenOut_not?: InputMaybe<Scalars['String']['input']>;
  tokenOut_gt?: InputMaybe<Scalars['String']['input']>;
  tokenOut_lt?: InputMaybe<Scalars['String']['input']>;
  tokenOut_gte?: InputMaybe<Scalars['String']['input']>;
  tokenOut_lte?: InputMaybe<Scalars['String']['input']>;
  tokenOut_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenOut_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenOut_contains?: InputMaybe<Scalars['String']['input']>;
  tokenOut_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOut_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenOut_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOut_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenOut_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOut_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenOut_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOut_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenOut_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOut_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenOut_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOut_?: InputMaybe<Token_filter>;
  amountOut?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountOutUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOutUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOutUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOutUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOutUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOutUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOutUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOutUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Swap_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Swap_filter>>>;
};

export type Swap_orderBy =
  | 'id'
  | 'hash'
  | 'nonce'
  | 'logIndex'
  | 'gasLimit'
  | 'gasUsed'
  | 'gasPrice'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'account'
  | 'account__id'
  | 'account__positionCount'
  | 'account__openPositionCount'
  | 'account__closedPositionCount'
  | 'account__depositCount'
  | 'account__withdrawCount'
  | 'account__swapCount'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'blockNumber'
  | 'timestamp'
  | 'tick'
  | 'tokenIn'
  | 'tokenIn__id'
  | 'tokenIn__name'
  | 'tokenIn__symbol'
  | 'tokenIn__decimals'
  | 'tokenIn__lastPriceUSD'
  | 'tokenIn__lastPriceBlockNumber'
  | 'tokenIn___lastPricePool'
  | 'tokenIn___totalSupply'
  | 'tokenIn___totalValueLockedUSD'
  | 'tokenIn___largePriceChangeBuffer'
  | 'tokenIn___largeTVLImpactBuffer'
  | 'amountIn'
  | 'amountInUSD'
  | 'tokenOut'
  | 'tokenOut__id'
  | 'tokenOut__name'
  | 'tokenOut__symbol'
  | 'tokenOut__decimals'
  | 'tokenOut__lastPriceUSD'
  | 'tokenOut__lastPriceBlockNumber'
  | 'tokenOut___lastPricePool'
  | 'tokenOut___totalSupply'
  | 'tokenOut___totalValueLockedUSD'
  | 'tokenOut___largePriceChangeBuffer'
  | 'tokenOut___largeTVLImpactBuffer'
  | 'amountOut'
  | 'amountOutUSD'
  | 'reserveAmounts';

export type Tick = {
  /**  { pool address }-{ tick index }  */
  id: Scalars['Bytes']['output'];
  /**  tick index  */
  index: Scalars['BigInt']['output'];
  /**  Liquidity pool this tick belongs to  */
  pool: Pool;
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  /**  Creation block number  */
  createdBlockNumber: Scalars['BigInt']['output'];
  /**  calculated price of token0 of tick within this pool - constant  */
  prices: Array<Scalars['BigDecimal']['output']>;
  /**  total liquidity pool has as tick lower or upper  */
  liquidityGross: Scalars['BigInt']['output'];
  /**  total liquidity in USD pool has as tick lower or upper  */
  liquidityGrossUSD: Scalars['BigDecimal']['output'];
  /**  how much liquidity changes when tick crossed  */
  liquidityNet: Scalars['BigInt']['output'];
  /**  how much liquidity in USD changes when tick crossed  */
  liquidityNetUSD: Scalars['BigDecimal']['output'];
  /**  Day ID of the most recent daily snapshot  */
  lastSnapshotDayID: Scalars['Int']['output'];
  /**  Hour ID of the most recent hourly snapshot  */
  lastSnapshotHourID: Scalars['Int']['output'];
  /**  Timestamp of the last time this entity was updated  */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /**  Block number of the last time this entity was updated  */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
};

export type TickDailySnapshot = {
  /**  { pool address }-{ tick index }-{ day ID }  */
  id: Scalars['Bytes']['output'];
  /**  Number of days since Unix epoch time  */
  day: Scalars['Int']['output'];
  /**  tick index  */
  tick: Tick;
  /**  liquidity pool this tick belongs to  */
  pool: Pool;
  /**  total liquidity pool has as tick lower or upper  */
  liquidityGross: Scalars['BigInt']['output'];
  /**  total liquidity in USD pool has as tick lower or upper  */
  liquidityGrossUSD: Scalars['BigDecimal']['output'];
  /**  how much liquidity changes when tick crossed  */
  liquidityNet: Scalars['BigInt']['output'];
  /**  how much liquidity in USD changes when tick crossed  */
  liquidityNetUSD: Scalars['BigDecimal']['output'];
  /**  Timestamp of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  timestamp: Scalars['BigInt']['output'];
  /**  Block number of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  blockNumber: Scalars['BigInt']['output'];
};

export type TickDailySnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tick?: InputMaybe<Scalars['String']['input']>;
  tick_not?: InputMaybe<Scalars['String']['input']>;
  tick_gt?: InputMaybe<Scalars['String']['input']>;
  tick_lt?: InputMaybe<Scalars['String']['input']>;
  tick_gte?: InputMaybe<Scalars['String']['input']>;
  tick_lte?: InputMaybe<Scalars['String']['input']>;
  tick_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tick_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tick_contains?: InputMaybe<Scalars['String']['input']>;
  tick_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_not_contains?: InputMaybe<Scalars['String']['input']>;
  tick_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_starts_with?: InputMaybe<Scalars['String']['input']>;
  tick_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tick_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_ends_with?: InputMaybe<Scalars['String']['input']>;
  tick_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tick_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_?: InputMaybe<Tick_filter>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  liquidityGross?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityGross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityGrossUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityGrossUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityNet?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNet_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNetUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityNetUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TickDailySnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TickDailySnapshot_filter>>>;
};

export type TickDailySnapshot_orderBy =
  | 'id'
  | 'day'
  | 'tick'
  | 'tick__id'
  | 'tick__index'
  | 'tick__createdTimestamp'
  | 'tick__createdBlockNumber'
  | 'tick__liquidityGross'
  | 'tick__liquidityGrossUSD'
  | 'tick__liquidityNet'
  | 'tick__liquidityNetUSD'
  | 'tick__lastSnapshotDayID'
  | 'tick__lastSnapshotHourID'
  | 'tick__lastUpdateTimestamp'
  | 'tick__lastUpdateBlockNumber'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'liquidityGross'
  | 'liquidityGrossUSD'
  | 'liquidityNet'
  | 'liquidityNetUSD'
  | 'timestamp'
  | 'blockNumber';

export type TickHourlySnapshot = {
  /**  { pool address }-{ tick index }-{ hour ID }  */
  id: Scalars['Bytes']['output'];
  /**  Number of hours since Unix epoch time  */
  hour: Scalars['Int']['output'];
  /**  tick index  */
  tick: Tick;
  /**  liquidity pool this tick belongs to  */
  pool: Pool;
  /**  total liquidity pool has as tick lower or upper  */
  liquidityGross: Scalars['BigInt']['output'];
  /**  total liquidity in USD pool has as tick lower or upper  */
  liquidityGrossUSD: Scalars['BigDecimal']['output'];
  /**  how much liquidity changes when tick crossed  */
  liquidityNet: Scalars['BigInt']['output'];
  /**  how much liquidity in USD changes when tick crossed  */
  liquidityNetUSD: Scalars['BigDecimal']['output'];
  /**  Timestamp of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  timestamp: Scalars['BigInt']['output'];
  /**  Block number of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  blockNumber: Scalars['BigInt']['output'];
};

export type TickHourlySnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  hour_not?: InputMaybe<Scalars['Int']['input']>;
  hour_gt?: InputMaybe<Scalars['Int']['input']>;
  hour_lt?: InputMaybe<Scalars['Int']['input']>;
  hour_gte?: InputMaybe<Scalars['Int']['input']>;
  hour_lte?: InputMaybe<Scalars['Int']['input']>;
  hour_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hour_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tick?: InputMaybe<Scalars['String']['input']>;
  tick_not?: InputMaybe<Scalars['String']['input']>;
  tick_gt?: InputMaybe<Scalars['String']['input']>;
  tick_lt?: InputMaybe<Scalars['String']['input']>;
  tick_gte?: InputMaybe<Scalars['String']['input']>;
  tick_lte?: InputMaybe<Scalars['String']['input']>;
  tick_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tick_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tick_contains?: InputMaybe<Scalars['String']['input']>;
  tick_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_not_contains?: InputMaybe<Scalars['String']['input']>;
  tick_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_starts_with?: InputMaybe<Scalars['String']['input']>;
  tick_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tick_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_ends_with?: InputMaybe<Scalars['String']['input']>;
  tick_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tick_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tick_?: InputMaybe<Tick_filter>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  liquidityGross?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityGross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityGrossUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityGrossUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityNet?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNet_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNetUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityNetUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TickHourlySnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TickHourlySnapshot_filter>>>;
};

export type TickHourlySnapshot_orderBy =
  | 'id'
  | 'hour'
  | 'tick'
  | 'tick__id'
  | 'tick__index'
  | 'tick__createdTimestamp'
  | 'tick__createdBlockNumber'
  | 'tick__liquidityGross'
  | 'tick__liquidityGrossUSD'
  | 'tick__liquidityNet'
  | 'tick__liquidityNetUSD'
  | 'tick__lastSnapshotDayID'
  | 'tick__lastSnapshotHourID'
  | 'tick__lastUpdateTimestamp'
  | 'tick__lastUpdateBlockNumber'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'liquidityGross'
  | 'liquidityGrossUSD'
  | 'liquidityNet'
  | 'liquidityNetUSD'
  | 'timestamp'
  | 'blockNumber';

export type Tick_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  prices?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prices_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prices_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prices_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prices_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prices_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityGross?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityGross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityGrossUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityGrossUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityGrossUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityNet?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNet_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNetUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityNetUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityNetUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastSnapshotDayID?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_not?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotDayID_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotDayID_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotHourID?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_not?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSnapshotHourID_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSnapshotHourID_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Tick_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Tick_filter>>>;
};

export type Tick_orderBy =
  | 'id'
  | 'index'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'createdTimestamp'
  | 'createdBlockNumber'
  | 'prices'
  | 'liquidityGross'
  | 'liquidityGrossUSD'
  | 'liquidityNet'
  | 'liquidityNetUSD'
  | 'lastSnapshotDayID'
  | 'lastSnapshotHourID'
  | 'lastUpdateTimestamp'
  | 'lastUpdateBlockNumber';

export type Token = {
  /**  Smart contract address of the token  */
  id: Scalars['Bytes']['output'];
  /**  Name of the token, mirrored from the smart contract  */
  name: Scalars['String']['output'];
  /**  Symbol of the token, mirrored from the smart contract  */
  symbol: Scalars['String']['output'];
  /**  The number of decimal places this token uses, default to 18  */
  decimals: Scalars['Int']['output'];
  /**  Optional field to track the price of a token, mostly for caching purposes  */
  lastPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Optional field to track the block number of the last token price  */
  lastPriceBlockNumber?: Maybe<Scalars['BigInt']['output']>;
  /**  last pool that gave this token a price  */
  _lastPricePool?: Maybe<Scalars['Bytes']['output']>;
  /**  amount of tokens in the protocol  */
  _totalSupply: Scalars['BigInt']['output'];
  /**  Total value locked in the protocol  */
  _totalValueLockedUSD: Scalars['BigDecimal']['output'];
  _largePriceChangeBuffer: Scalars['Int']['output'];
  _largeTVLImpactBuffer: Scalars['Int']['output'];
  rewards: Array<Reward>;
};


export type TokenrewardsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Reward_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Reward_filter>;
};

export type TokenType =
  | 'MULTIPLE'
  | 'UNKNOWN'
  | 'ERC20'
  | 'ERC721'
  | 'ERC1155'
  | 'BEP20'
  | 'BEP721'
  | 'BEP1155';

export type Token_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPriceBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _lastPricePool?: InputMaybe<Scalars['Bytes']['input']>;
  _lastPricePool_not?: InputMaybe<Scalars['Bytes']['input']>;
  _lastPricePool_gt?: InputMaybe<Scalars['Bytes']['input']>;
  _lastPricePool_lt?: InputMaybe<Scalars['Bytes']['input']>;
  _lastPricePool_gte?: InputMaybe<Scalars['Bytes']['input']>;
  _lastPricePool_lte?: InputMaybe<Scalars['Bytes']['input']>;
  _lastPricePool_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  _lastPricePool_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  _lastPricePool_contains?: InputMaybe<Scalars['Bytes']['input']>;
  _lastPricePool_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  _totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  _totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  _totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  _totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  _totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  _totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  _totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  _totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  _totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  _totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  _totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  _totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  _totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  _totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  _largePriceChangeBuffer?: InputMaybe<Scalars['Int']['input']>;
  _largePriceChangeBuffer_not?: InputMaybe<Scalars['Int']['input']>;
  _largePriceChangeBuffer_gt?: InputMaybe<Scalars['Int']['input']>;
  _largePriceChangeBuffer_lt?: InputMaybe<Scalars['Int']['input']>;
  _largePriceChangeBuffer_gte?: InputMaybe<Scalars['Int']['input']>;
  _largePriceChangeBuffer_lte?: InputMaybe<Scalars['Int']['input']>;
  _largePriceChangeBuffer_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _largePriceChangeBuffer_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _largeTVLImpactBuffer?: InputMaybe<Scalars['Int']['input']>;
  _largeTVLImpactBuffer_not?: InputMaybe<Scalars['Int']['input']>;
  _largeTVLImpactBuffer_gt?: InputMaybe<Scalars['Int']['input']>;
  _largeTVLImpactBuffer_lt?: InputMaybe<Scalars['Int']['input']>;
  _largeTVLImpactBuffer_gte?: InputMaybe<Scalars['Int']['input']>;
  _largeTVLImpactBuffer_lte?: InputMaybe<Scalars['Int']['input']>;
  _largeTVLImpactBuffer_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _largeTVLImpactBuffer_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rewards_?: InputMaybe<Reward_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Token_filter>>>;
};

export type Token_orderBy =
  | 'id'
  | 'name'
  | 'symbol'
  | 'decimals'
  | 'lastPriceUSD'
  | 'lastPriceBlockNumber'
  | '_lastPricePool'
  | '_totalSupply'
  | '_totalValueLockedUSD'
  | '_largePriceChangeBuffer'
  | '_largeTVLImpactBuffer'
  | 'rewards';

export type UsageMetricsDailySnapshot = {
  /**  ID is # of days since Unix epoch time  */
  id: Scalars['Bytes']['output'];
  /**  Number of days since Unix epoch time  */
  day: Scalars['Int']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: DexAmmProtocol;
  /**  Number of unique daily active users  */
  dailyActiveUsers: Scalars['Int']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Total number of transactions occurred in a day. Transactions include all entities that implement the Event interface.  */
  dailyTransactionCount: Scalars['Int']['output'];
  /**  Total number of pools  */
  totalPoolCount: Scalars['Int']['output'];
  /**  Total number of deposits (add liquidity) in an day  */
  dailyDepositCount: Scalars['Int']['output'];
  /**  Total number of withdrawals (remove liquidity) in an day  */
  dailyWithdrawCount: Scalars['Int']['output'];
  /**  Total number of trades (swaps) in an day  */
  dailySwapCount: Scalars['Int']['output'];
  /**  Timestamp of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  timestamp: Scalars['BigInt']['output'];
  /**  Block number of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  blockNumber: Scalars['BigInt']['output'];
};

export type UsageMetricsDailySnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  dailyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyTransactionCount?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyTransactionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyDepositCount?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailySwapCount?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailySwapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailySwapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UsageMetricsDailySnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<UsageMetricsDailySnapshot_filter>>>;
};

export type UsageMetricsDailySnapshot_orderBy =
  | 'id'
  | 'day'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'dailyActiveUsers'
  | 'cumulativeUniqueUsers'
  | 'dailyTransactionCount'
  | 'totalPoolCount'
  | 'dailyDepositCount'
  | 'dailyWithdrawCount'
  | 'dailySwapCount'
  | 'timestamp'
  | 'blockNumber';

export type UsageMetricsHourlySnapshot = {
  /**  { # of hours since Unix epoch time }  */
  id: Scalars['Bytes']['output'];
  /**  Number of hours since Unix epoch time  */
  hour: Scalars['Int']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: DexAmmProtocol;
  /**  Number of unique hourly active users  */
  hourlyActiveUsers: Scalars['Int']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Total number of transactions occurred in an hour. Transactions include all entities that implement the Event interface.  */
  hourlyTransactionCount: Scalars['Int']['output'];
  /**  Total number of deposits (add liquidity) in an hour  */
  hourlyDepositCount: Scalars['Int']['output'];
  /**  Total number of withdrawals (remove liquidity) in an hour  */
  hourlyWithdrawCount: Scalars['Int']['output'];
  /**  Total number of trades (swaps) in an hour  */
  hourlySwapCount: Scalars['Int']['output'];
  /**  Timestamp of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  timestamp: Scalars['BigInt']['output'];
  /**  Block number of when this snapshot was taken/last modified (May be taken after interval has passed)  */
  blockNumber: Scalars['BigInt']['output'];
};

export type UsageMetricsHourlySnapshot_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  hour_not?: InputMaybe<Scalars['Int']['input']>;
  hour_gt?: InputMaybe<Scalars['Int']['input']>;
  hour_lt?: InputMaybe<Scalars['Int']['input']>;
  hour_gte?: InputMaybe<Scalars['Int']['input']>;
  hour_lte?: InputMaybe<Scalars['Int']['input']>;
  hour_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hour_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  hourlyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyTransactionCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyTransactionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyDepositCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlySwapCount?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlySwapCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlySwapCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UsageMetricsHourlySnapshot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<UsageMetricsHourlySnapshot_filter>>>;
};

export type UsageMetricsHourlySnapshot_orderBy =
  | 'id'
  | 'hour'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'hourlyActiveUsers'
  | 'cumulativeUniqueUsers'
  | 'hourlyTransactionCount'
  | 'hourlyDepositCount'
  | 'hourlyWithdrawCount'
  | 'hourlySwapCount'
  | 'timestamp'
  | 'blockNumber';

export type Withdraw = {
  /**  { Transaction hash }-{ Log index } */
  id: Scalars['Bytes']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['Bytes']['output'];
  /**  Nonce of the transaction that emitted this event  */
  nonce: Scalars['BigInt']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Gas limit of the transaction that emitted this event  */
  gasLimit?: Maybe<Scalars['BigInt']['output']>;
  /**  Gas used in this transaction. (Optional because not every chain will support this)  */
  gasUsed?: Maybe<Scalars['BigInt']['output']>;
  /**  Gas price of the transaction that emitted this event  */
  gasPrice?: Maybe<Scalars['BigInt']['output']>;
  /**  The protocol this transaction belongs to  */
  protocol: DexAmmProtocol;
  /**  Account that emitted this event  */
  account: Account;
  /**  The user position changed by this event  */
  position?: Maybe<Position>;
  /**  lower tick of position  */
  tickLower?: Maybe<Scalars['BigInt']['output']>;
  /**  upper tick of position  */
  tickUpper?: Maybe<Scalars['BigInt']['output']>;
  /**  The pool involving this event  */
  pool: Pool;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Amount of liquidity burned  */
  liquidity: Scalars['BigInt']['output'];
  /**  Input tokens of the pool (not input tokens of the event/transaction). E.g. WETH and USDC from a WETH-USDC pool  */
  inputTokens: Array<Token>;
  /**  Amount of input tokens in the token's native unit  */
  inputTokenAmounts: Array<Scalars['BigInt']['output']>;
  /**  Amount of input tokens in the liquidity pool  */
  reserveAmounts?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  USD-normalized value of the transaction of the underlying (e.g. sum of tokens withdrawn from a pool)  */
  amountUSD: Scalars['BigDecimal']['output'];
};


export type WithdrawinputTokensArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
};

export type Withdraw_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  nonce?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<DexAmmProtocol_filter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_filter>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_filter>;
  tickLower?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_not?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tickLower_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickLower_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickUpper?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_not?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tickUpper_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickUpper_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokens?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTokens_?: InputMaybe<Token_filter>;
  inputTokenAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Withdraw_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Withdraw_filter>>>;
};

export type Withdraw_orderBy =
  | 'id'
  | 'hash'
  | 'nonce'
  | 'logIndex'
  | 'gasLimit'
  | 'gasUsed'
  | 'gasPrice'
  | 'protocol'
  | 'protocol__id'
  | 'protocol__name'
  | 'protocol__slug'
  | 'protocol__schemaVersion'
  | 'protocol__subgraphVersion'
  | 'protocol__methodologyVersion'
  | 'protocol__network'
  | 'protocol__type'
  | 'protocol__totalValueLockedUSD'
  | 'protocol__totalLiquidityUSD'
  | 'protocol__activeLiquidityUSD'
  | 'protocol__uncollectedProtocolSideValueUSD'
  | 'protocol__uncollectedSupplySideValueUSD'
  | 'protocol__protocolControlledValueUSD'
  | 'protocol__cumulativeVolumeUSD'
  | 'protocol__cumulativeSupplySideRevenueUSD'
  | 'protocol__cumulativeProtocolSideRevenueUSD'
  | 'protocol__cumulativeTotalRevenueUSD'
  | 'protocol__cumulativeUniqueUsers'
  | 'protocol__cumulativeUniqueLPs'
  | 'protocol__cumulativeUniqueTraders'
  | 'protocol__totalPoolCount'
  | 'protocol__openPositionCount'
  | 'protocol__cumulativePositionCount'
  | 'protocol__lastSnapshotDayID'
  | 'protocol__lastUpdateTimestamp'
  | 'protocol__lastUpdateBlockNumber'
  | 'protocol___regenesis'
  | 'account'
  | 'account__id'
  | 'account__positionCount'
  | 'account__openPositionCount'
  | 'account__closedPositionCount'
  | 'account__depositCount'
  | 'account__withdrawCount'
  | 'account__swapCount'
  | 'position'
  | 'position__id'
  | 'position__tokenId'
  | 'position__isStaked'
  | 'position__hashOpened'
  | 'position__hashClosed'
  | 'position__blockNumberOpened'
  | 'position__timestampOpened'
  | 'position__blockNumberClosed'
  | 'position__timestampClosed'
  | 'position__liquidityTokenType'
  | 'position__liquidity'
  | 'position__liquidityUSD'
  | 'position__cumulativeDepositUSD'
  | 'position__cumulativeWithdrawUSD'
  | 'position__depositCount'
  | 'position__withdrawCount'
  | 'tickLower'
  | 'tickUpper'
  | 'pool'
  | 'pool__id'
  | 'pool__name'
  | 'pool__symbol'
  | 'pool__liquidityTokenType'
  | 'pool__isSingleSided'
  | 'pool__createdTimestamp'
  | 'pool__createdBlockNumber'
  | 'pool__tick'
  | 'pool__totalValueLockedUSD'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquidityUSD'
  | 'pool__activeLiquidity'
  | 'pool__activeLiquidityUSD'
  | 'pool__cumulativeSupplySideRevenueUSD'
  | 'pool__cumulativeProtocolSideRevenueUSD'
  | 'pool__cumulativeTotalRevenueUSD'
  | 'pool__cumulativeVolumeUSD'
  | 'pool__stakedTokenAmount'
  | 'pool__cumulativeDepositCount'
  | 'pool__cumulativeWithdrawCount'
  | 'pool__cumulativeSwapCount'
  | 'pool__positionCount'
  | 'pool__openPositionCount'
  | 'pool__closedPositionCount'
  | 'pool__lastSnapshotDayID'
  | 'pool__lastSnapshotHourID'
  | 'pool__lastUpdateTimestamp'
  | 'pool__lastUpdateBlockNumber'
  | 'blockNumber'
  | 'timestamp'
  | 'liquidity'
  | 'inputTokens'
  | 'inputTokenAmounts'
  | 'reserveAmounts'
  | 'amountUSD';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
};

/**   Used to keep track of the price of Ether/TVL in USD, pool deposit count, and total unique users  */
export type _HelperStore = {
  id: Scalars['Bytes']['output'];
  /**  Token Prices  */
  valueDecimalList?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  price of ETH/TVL in USD  */
  valueDecimal?: Maybe<Scalars['BigDecimal']['output']>;
  /**  # of deposits, # of unique users  */
  valueInt?: Maybe<Scalars['Int']['output']>;
};

export type _HelperStore_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  valueDecimalList?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueDecimalList_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueDecimalList_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueDecimalList_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueDecimalList_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueDecimalList_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueDecimal?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueDecimal_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueDecimal_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueDecimal_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueDecimal_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueDecimal_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueDecimal_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueDecimal_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueInt?: InputMaybe<Scalars['Int']['input']>;
  valueInt_not?: InputMaybe<Scalars['Int']['input']>;
  valueInt_gt?: InputMaybe<Scalars['Int']['input']>;
  valueInt_lt?: InputMaybe<Scalars['Int']['input']>;
  valueInt_gte?: InputMaybe<Scalars['Int']['input']>;
  valueInt_lte?: InputMaybe<Scalars['Int']['input']>;
  valueInt_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  valueInt_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<_HelperStore_filter>>>;
  or?: InputMaybe<Array<InputMaybe<_HelperStore_filter>>>;
};

export type _HelperStore_orderBy =
  | 'id'
  | 'valueDecimalList'
  | 'valueDecimal'
  | 'valueInt';

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Protocol: ( DexAmmProtocol );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Account: ResolverTypeWrapper<Account>;
  Account_filter: Account_filter;
  Account_orderBy: Account_orderBy;
  ActiveAccount: ResolverTypeWrapper<ActiveAccount>;
  ActiveAccount_filter: ActiveAccount_filter;
  ActiveAccount_orderBy: ActiveAccount_orderBy;
  Aggregation_interval: Aggregation_interval;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  Deposit: ResolverTypeWrapper<Deposit>;
  Deposit_filter: Deposit_filter;
  Deposit_orderBy: Deposit_orderBy;
  DexAmmProtocol: ResolverTypeWrapper<DexAmmProtocol>;
  DexAmmProtocol_filter: DexAmmProtocol_filter;
  DexAmmProtocol_orderBy: DexAmmProtocol_orderBy;
  FinancialsDailySnapshot: ResolverTypeWrapper<FinancialsDailySnapshot>;
  FinancialsDailySnapshot_filter: FinancialsDailySnapshot_filter;
  FinancialsDailySnapshot_orderBy: FinancialsDailySnapshot_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  Network: Network;
  OrderDirection: OrderDirection;
  Pool: ResolverTypeWrapper<Pool>;
  PoolDailySnapshot: ResolverTypeWrapper<PoolDailySnapshot>;
  PoolDailySnapshot_filter: PoolDailySnapshot_filter;
  PoolDailySnapshot_orderBy: PoolDailySnapshot_orderBy;
  PoolFee: ResolverTypeWrapper<PoolFee>;
  PoolFeeType: PoolFeeType;
  PoolFee_filter: PoolFee_filter;
  PoolFee_orderBy: PoolFee_orderBy;
  PoolHourlySnapshot: ResolverTypeWrapper<PoolHourlySnapshot>;
  PoolHourlySnapshot_filter: PoolHourlySnapshot_filter;
  PoolHourlySnapshot_orderBy: PoolHourlySnapshot_orderBy;
  Pool_filter: Pool_filter;
  Pool_orderBy: Pool_orderBy;
  Position: ResolverTypeWrapper<Position>;
  PositionSnapshot: ResolverTypeWrapper<PositionSnapshot>;
  PositionSnapshot_filter: PositionSnapshot_filter;
  PositionSnapshot_orderBy: PositionSnapshot_orderBy;
  Position_filter: Position_filter;
  Position_orderBy: Position_orderBy;
  Protocol: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Protocol']>;
  ProtocolType: ProtocolType;
  Protocol_filter: Protocol_filter;
  Protocol_orderBy: Protocol_orderBy;
  Query: ResolverTypeWrapper<{}>;
  Reward: ResolverTypeWrapper<Reward>;
  Reward_filter: Reward_filter;
  Reward_orderBy: Reward_orderBy;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Swap: ResolverTypeWrapper<Swap>;
  Swap_filter: Swap_filter;
  Swap_orderBy: Swap_orderBy;
  Tick: ResolverTypeWrapper<Tick>;
  TickDailySnapshot: ResolverTypeWrapper<TickDailySnapshot>;
  TickDailySnapshot_filter: TickDailySnapshot_filter;
  TickDailySnapshot_orderBy: TickDailySnapshot_orderBy;
  TickHourlySnapshot: ResolverTypeWrapper<TickHourlySnapshot>;
  TickHourlySnapshot_filter: TickHourlySnapshot_filter;
  TickHourlySnapshot_orderBy: TickHourlySnapshot_orderBy;
  Tick_filter: Tick_filter;
  Tick_orderBy: Tick_orderBy;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  Token: ResolverTypeWrapper<Token>;
  TokenType: TokenType;
  Token_filter: Token_filter;
  Token_orderBy: Token_orderBy;
  UsageMetricsDailySnapshot: ResolverTypeWrapper<UsageMetricsDailySnapshot>;
  UsageMetricsDailySnapshot_filter: UsageMetricsDailySnapshot_filter;
  UsageMetricsDailySnapshot_orderBy: UsageMetricsDailySnapshot_orderBy;
  UsageMetricsHourlySnapshot: ResolverTypeWrapper<UsageMetricsHourlySnapshot>;
  UsageMetricsHourlySnapshot_filter: UsageMetricsHourlySnapshot_filter;
  UsageMetricsHourlySnapshot_orderBy: UsageMetricsHourlySnapshot_orderBy;
  Withdraw: ResolverTypeWrapper<Withdraw>;
  Withdraw_filter: Withdraw_filter;
  Withdraw_orderBy: Withdraw_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _HelperStore: ResolverTypeWrapper<_HelperStore>;
  _HelperStore_filter: _HelperStore_filter;
  _HelperStore_orderBy: _HelperStore_orderBy;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: Account;
  Account_filter: Account_filter;
  ActiveAccount: ActiveAccount;
  ActiveAccount_filter: ActiveAccount_filter;
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean']['output'];
  Bytes: Scalars['Bytes']['output'];
  Deposit: Deposit;
  Deposit_filter: Deposit_filter;
  DexAmmProtocol: DexAmmProtocol;
  DexAmmProtocol_filter: DexAmmProtocol_filter;
  FinancialsDailySnapshot: FinancialsDailySnapshot;
  FinancialsDailySnapshot_filter: FinancialsDailySnapshot_filter;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  Pool: Pool;
  PoolDailySnapshot: PoolDailySnapshot;
  PoolDailySnapshot_filter: PoolDailySnapshot_filter;
  PoolFee: PoolFee;
  PoolFee_filter: PoolFee_filter;
  PoolHourlySnapshot: PoolHourlySnapshot;
  PoolHourlySnapshot_filter: PoolHourlySnapshot_filter;
  Pool_filter: Pool_filter;
  Position: Position;
  PositionSnapshot: PositionSnapshot;
  PositionSnapshot_filter: PositionSnapshot_filter;
  Position_filter: Position_filter;
  Protocol: ResolversInterfaceTypes<ResolversParentTypes>['Protocol'];
  Protocol_filter: Protocol_filter;
  Query: {};
  Reward: Reward;
  Reward_filter: Reward_filter;
  String: Scalars['String']['output'];
  Subscription: {};
  Swap: Swap;
  Swap_filter: Swap_filter;
  Tick: Tick;
  TickDailySnapshot: TickDailySnapshot;
  TickDailySnapshot_filter: TickDailySnapshot_filter;
  TickHourlySnapshot: TickHourlySnapshot;
  TickHourlySnapshot_filter: TickHourlySnapshot_filter;
  Tick_filter: Tick_filter;
  Timestamp: Scalars['Timestamp']['output'];
  Token: Token;
  Token_filter: Token_filter;
  UsageMetricsDailySnapshot: UsageMetricsDailySnapshot;
  UsageMetricsDailySnapshot_filter: UsageMetricsDailySnapshot_filter;
  UsageMetricsHourlySnapshot: UsageMetricsHourlySnapshot;
  UsageMetricsHourlySnapshot_filter: UsageMetricsHourlySnapshot_filter;
  Withdraw: Withdraw;
  Withdraw_filter: Withdraw_filter;
  _Block_: _Block_;
  _HelperStore: _HelperStore;
  _HelperStore_filter: _HelperStore_filter;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  positionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<AccountpositionsArgs, 'skip' | 'first'>>;
  openPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  closedPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  depositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  deposits?: Resolver<Array<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<AccountdepositsArgs, 'skip' | 'first'>>;
  withdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  withdraws?: Resolver<Array<ResolversTypes['Withdraw']>, ParentType, ContextType, RequireFields<AccountwithdrawsArgs, 'skip' | 'first'>>;
  swapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  swaps?: Resolver<Array<ResolversTypes['Swap']>, ParentType, ContextType, RequireFields<AccountswapsArgs, 'skip' | 'first'>>;
  rewards?: Resolver<Array<ResolversTypes['Reward']>, ParentType, ContextType, RequireFields<AccountrewardsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActiveAccountResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ActiveAccount'] = ResolversParentTypes['ActiveAccount']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type DepositResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Deposit'] = ResolversParentTypes['Deposit']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  logIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gasLimit?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  gasUsed?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  gasPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  tickLower?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  tickUpper?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  inputTokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<DepositinputTokensArgs, 'skip' | 'first'>>;
  inputTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  reserveAmounts?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  amountUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DexAmmProtocolResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DexAmmProtocol'] = ResolversParentTypes['DexAmmProtocol']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subgraphVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  methodologyVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  network?: Resolver<ResolversTypes['Network'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ProtocolType'], ParentType, ContextType>;
  totalValueLockedUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  activeLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  uncollectedProtocolSideValueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  uncollectedSupplySideValueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  protocolControlledValueUSD?: Resolver<Maybe<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  cumulativeVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeSupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeUniqueUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeUniqueLPs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeUniqueTraders?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPoolCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  openPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativePositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastSnapshotDayID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastUpdateTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lastUpdateBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  dailyUsageMetrics?: Resolver<Array<ResolversTypes['UsageMetricsDailySnapshot']>, ParentType, ContextType, RequireFields<DexAmmProtocoldailyUsageMetricsArgs, 'skip' | 'first'>>;
  hourlyUsageMetrics?: Resolver<Array<ResolversTypes['UsageMetricsHourlySnapshot']>, ParentType, ContextType, RequireFields<DexAmmProtocolhourlyUsageMetricsArgs, 'skip' | 'first'>>;
  financialMetrics?: Resolver<Array<ResolversTypes['FinancialsDailySnapshot']>, ParentType, ContextType, RequireFields<DexAmmProtocolfinancialMetricsArgs, 'skip' | 'first'>>;
  pools?: Resolver<Array<ResolversTypes['Pool']>, ParentType, ContextType, RequireFields<DexAmmProtocolpoolsArgs, 'skip' | 'first'>>;
  _regenesis?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FinancialsDailySnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FinancialsDailySnapshot'] = ResolversParentTypes['FinancialsDailySnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  totalValueLockedUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  activeLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  uncollectedProtocolSideValueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  uncollectedSupplySideValueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  protocolControlledValueUSD?: Resolver<Maybe<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  dailyVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  dailySupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeSupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  dailyProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  dailyTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type PoolResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Pool'] = ResolversParentTypes['Pool']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  liquidityToken?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  liquidityTokenType?: Resolver<Maybe<ResolversTypes['TokenType']>, ParentType, ContextType>;
  inputTokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<PoolinputTokensArgs, 'skip' | 'first'>>;
  fees?: Resolver<Array<ResolversTypes['PoolFee']>, ParentType, ContextType, RequireFields<PoolfeesArgs, 'skip' | 'first'>>;
  isSingleSided?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tick?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  totalValueLockedUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  activeLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  activeLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  uncollectedProtocolSideTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  uncollectedProtocolSideValuesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  uncollectedSupplySideTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  uncollectedSupplySideValuesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  cumulativeSupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeVolumeByTokenAmount?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cumulativeVolumeByTokenUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  cumulativeVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  inputTokenBalances?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  inputTokenBalancesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  stakedTokenAmount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardTokenEmissionsAmount?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  rewardTokenEmissionsUSD?: Resolver<Maybe<Array<ResolversTypes['BigDecimal']>>, ParentType, ContextType>;
  cumulativeDepositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeWithdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeSwapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<PoolpositionsArgs, 'skip' | 'first'>>;
  positionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  openPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  closedPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastSnapshotDayID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastSnapshotHourID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastUpdateTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lastUpdateBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  dailySnapshots?: Resolver<Array<ResolversTypes['PoolDailySnapshot']>, ParentType, ContextType, RequireFields<PooldailySnapshotsArgs, 'skip' | 'first'>>;
  hourlySnapshots?: Resolver<Array<ResolversTypes['PoolHourlySnapshot']>, ParentType, ContextType, RequireFields<PoolhourlySnapshotsArgs, 'skip' | 'first'>>;
  deposits?: Resolver<Array<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<PooldepositsArgs, 'skip' | 'first'>>;
  withdraws?: Resolver<Array<ResolversTypes['Withdraw']>, ParentType, ContextType, RequireFields<PoolwithdrawsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<ResolversTypes['Swap']>, ParentType, ContextType, RequireFields<PoolswapsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoolDailySnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PoolDailySnapshot'] = ResolversParentTypes['PoolDailySnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  tick?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  totalValueLockedUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  activeLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  activeLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  uncollectedProtocolSideTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  uncollectedProtocolSideValuesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  uncollectedSupplySideTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  uncollectedSupplySideValuesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  cumulativeSupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  dailySupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  dailyProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  dailyTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  dailyVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeVolumeByTokenAmount?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  dailyVolumeByTokenAmount?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cumulativeVolumeByTokenUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  dailyVolumeByTokenUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  inputTokenBalances?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  inputTokenBalancesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  stakedTokenAmount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardTokenEmissionsAmount?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  rewardTokenEmissionsUSD?: Resolver<Maybe<Array<ResolversTypes['BigDecimal']>>, ParentType, ContextType>;
  cumulativeDepositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailyDepositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeWithdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailyWithdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeSwapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailySwapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  positionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  openPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  closedPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoolFeeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PoolFee'] = ResolversParentTypes['PoolFee']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  feePercentage?: Resolver<Maybe<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  feeType?: Resolver<ResolversTypes['PoolFeeType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoolHourlySnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PoolHourlySnapshot'] = ResolversParentTypes['PoolHourlySnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hour?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  tick?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  totalValueLockedUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  activeLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  activeLiquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  uncollectedProtocolSideTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  uncollectedProtocolSideValuesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  uncollectedSupplySideTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  uncollectedSupplySideValuesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  cumulativeSupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  hourlySupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  hourlyProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  hourlyTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  hourlyVolumeUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeVolumeByTokenAmount?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  hourlyVolumeByTokenAmount?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cumulativeVolumeByTokenUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  hourlyVolumeByTokenUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  inputTokenBalances?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  inputTokenBalancesUSD?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  stakedTokenAmount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rewardTokenEmissionsAmount?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  rewardTokenEmissionsUSD?: Resolver<Maybe<Array<ResolversTypes['BigDecimal']>>, ParentType, ContextType>;
  cumulativeDepositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hourlyDepositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeWithdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hourlyWithdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeSwapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hourlySwapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  positionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  openPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  closedPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  isStaked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hashOpened?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hashClosed?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  blockNumberOpened?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestampOpened?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumberClosed?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  timestampClosed?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  tickLower?: Resolver<Maybe<ResolversTypes['Tick']>, ParentType, ContextType>;
  tickUpper?: Resolver<Maybe<ResolversTypes['Tick']>, ParentType, ContextType>;
  liquidityToken?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  liquidityTokenType?: Resolver<Maybe<ResolversTypes['TokenType']>, ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeDepositTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cumulativeDepositUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeWithdrawTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cumulativeWithdrawUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeRewardUSD?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  depositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  deposits?: Resolver<Array<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<PositiondepositsArgs, 'skip' | 'first'>>;
  withdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  withdraws?: Resolver<Array<ResolversTypes['Withdraw']>, ParentType, ContextType, RequireFields<PositionwithdrawsArgs, 'skip' | 'first'>>;
  snapshots?: Resolver<Array<ResolversTypes['PositionSnapshot']>, ParentType, ContextType, RequireFields<PositionsnapshotsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionSnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PositionSnapshot'] = ResolversParentTypes['PositionSnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  logIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Position'], ParentType, ContextType>;
  liquidityTokenType?: Resolver<Maybe<ResolversTypes['TokenType']>, ParentType, ContextType>;
  liquidity?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  liquidityUSD?: Resolver<Maybe<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  cumulativeDepositTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cumulativeDepositUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeWithdrawTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cumulativeWithdrawUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeRewardTokenAmounts?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  cumulativeRewardUSD?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  depositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  withdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProtocolResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Protocol'] = ResolversParentTypes['Protocol']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DexAmmProtocol', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subgraphVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  methodologyVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  network?: Resolver<ResolversTypes['Network'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ProtocolType'], ParentType, ContextType>;
  totalValueLockedUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  protocolControlledValueUSD?: Resolver<Maybe<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  cumulativeSupplySideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeProtocolSideRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeTotalRevenueUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  cumulativeUniqueUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPoolCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailyUsageMetrics?: Resolver<Array<ResolversTypes['UsageMetricsDailySnapshot']>, ParentType, ContextType, RequireFields<ProtocoldailyUsageMetricsArgs, 'skip' | 'first'>>;
  hourlyUsageMetrics?: Resolver<Array<ResolversTypes['UsageMetricsHourlySnapshot']>, ParentType, ContextType, RequireFields<ProtocolhourlyUsageMetricsArgs, 'skip' | 'first'>>;
  financialMetrics?: Resolver<Array<ResolversTypes['FinancialsDailySnapshot']>, ParentType, ContextType, RequireFields<ProtocolfinancialMetricsArgs, 'skip' | 'first'>>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokenArgs, 'id' | 'subgraphError'>>;
  tokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  reward?: Resolver<Maybe<ResolversTypes['Reward']>, ParentType, ContextType, RequireFields<QueryrewardArgs, 'id' | 'subgraphError'>>;
  rewards?: Resolver<Array<ResolversTypes['Reward']>, ParentType, ContextType, RequireFields<QueryrewardsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolFee?: Resolver<Maybe<ResolversTypes['PoolFee']>, ParentType, ContextType, RequireFields<QuerypoolFeeArgs, 'id' | 'subgraphError'>>;
  poolFees?: Resolver<Array<ResolversTypes['PoolFee']>, ParentType, ContextType, RequireFields<QuerypoolFeesArgs, 'skip' | 'first' | 'subgraphError'>>;
  dexAmmProtocol?: Resolver<Maybe<ResolversTypes['DexAmmProtocol']>, ParentType, ContextType, RequireFields<QuerydexAmmProtocolArgs, 'id' | 'subgraphError'>>;
  dexAmmProtocols?: Resolver<Array<ResolversTypes['DexAmmProtocol']>, ParentType, ContextType, RequireFields<QuerydexAmmProtocolsArgs, 'skip' | 'first' | 'subgraphError'>>;
  usageMetricsDailySnapshot?: Resolver<Maybe<ResolversTypes['UsageMetricsDailySnapshot']>, ParentType, ContextType, RequireFields<QueryusageMetricsDailySnapshotArgs, 'id' | 'subgraphError'>>;
  usageMetricsDailySnapshots?: Resolver<Array<ResolversTypes['UsageMetricsDailySnapshot']>, ParentType, ContextType, RequireFields<QueryusageMetricsDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  usageMetricsHourlySnapshot?: Resolver<Maybe<ResolversTypes['UsageMetricsHourlySnapshot']>, ParentType, ContextType, RequireFields<QueryusageMetricsHourlySnapshotArgs, 'id' | 'subgraphError'>>;
  usageMetricsHourlySnapshots?: Resolver<Array<ResolversTypes['UsageMetricsHourlySnapshot']>, ParentType, ContextType, RequireFields<QueryusageMetricsHourlySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  financialsDailySnapshot?: Resolver<Maybe<ResolversTypes['FinancialsDailySnapshot']>, ParentType, ContextType, RequireFields<QueryfinancialsDailySnapshotArgs, 'id' | 'subgraphError'>>;
  financialsDailySnapshots?: Resolver<Array<ResolversTypes['FinancialsDailySnapshot']>, ParentType, ContextType, RequireFields<QueryfinancialsDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  pool?: Resolver<Maybe<ResolversTypes['Pool']>, ParentType, ContextType, RequireFields<QuerypoolArgs, 'id' | 'subgraphError'>>;
  pools?: Resolver<Array<ResolversTypes['Pool']>, ParentType, ContextType, RequireFields<QuerypoolsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolDailySnapshot?: Resolver<Maybe<ResolversTypes['PoolDailySnapshot']>, ParentType, ContextType, RequireFields<QuerypoolDailySnapshotArgs, 'id' | 'subgraphError'>>;
  poolDailySnapshots?: Resolver<Array<ResolversTypes['PoolDailySnapshot']>, ParentType, ContextType, RequireFields<QuerypoolDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolHourlySnapshot?: Resolver<Maybe<ResolversTypes['PoolHourlySnapshot']>, ParentType, ContextType, RequireFields<QuerypoolHourlySnapshotArgs, 'id' | 'subgraphError'>>;
  poolHourlySnapshots?: Resolver<Array<ResolversTypes['PoolHourlySnapshot']>, ParentType, ContextType, RequireFields<QuerypoolHourlySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  tick?: Resolver<Maybe<ResolversTypes['Tick']>, ParentType, ContextType, RequireFields<QuerytickArgs, 'id' | 'subgraphError'>>;
  ticks?: Resolver<Array<ResolversTypes['Tick']>, ParentType, ContextType, RequireFields<QueryticksArgs, 'skip' | 'first' | 'subgraphError'>>;
  tickDailySnapshot?: Resolver<Maybe<ResolversTypes['TickDailySnapshot']>, ParentType, ContextType, RequireFields<QuerytickDailySnapshotArgs, 'id' | 'subgraphError'>>;
  tickDailySnapshots?: Resolver<Array<ResolversTypes['TickDailySnapshot']>, ParentType, ContextType, RequireFields<QuerytickDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  tickHourlySnapshot?: Resolver<Maybe<ResolversTypes['TickHourlySnapshot']>, ParentType, ContextType, RequireFields<QuerytickHourlySnapshotArgs, 'id' | 'subgraphError'>>;
  tickHourlySnapshots?: Resolver<Array<ResolversTypes['TickHourlySnapshot']>, ParentType, ContextType, RequireFields<QuerytickHourlySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountArgs, 'id' | 'subgraphError'>>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  position?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<QuerypositionArgs, 'id' | 'subgraphError'>>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<QuerypositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  positionSnapshot?: Resolver<Maybe<ResolversTypes['PositionSnapshot']>, ParentType, ContextType, RequireFields<QuerypositionSnapshotArgs, 'id' | 'subgraphError'>>;
  positionSnapshots?: Resolver<Array<ResolversTypes['PositionSnapshot']>, ParentType, ContextType, RequireFields<QuerypositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  deposit?: Resolver<Maybe<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<QuerydepositArgs, 'id' | 'subgraphError'>>;
  deposits?: Resolver<Array<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<QuerydepositsArgs, 'skip' | 'first' | 'subgraphError'>>;
  withdraw?: Resolver<Maybe<ResolversTypes['Withdraw']>, ParentType, ContextType, RequireFields<QuerywithdrawArgs, 'id' | 'subgraphError'>>;
  withdraws?: Resolver<Array<ResolversTypes['Withdraw']>, ParentType, ContextType, RequireFields<QuerywithdrawsArgs, 'skip' | 'first' | 'subgraphError'>>;
  swap?: Resolver<Maybe<ResolversTypes['Swap']>, ParentType, ContextType, RequireFields<QueryswapArgs, 'id' | 'subgraphError'>>;
  swaps?: Resolver<Array<ResolversTypes['Swap']>, ParentType, ContextType, RequireFields<QueryswapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  activeAccount?: Resolver<Maybe<ResolversTypes['ActiveAccount']>, ParentType, ContextType, RequireFields<QueryactiveAccountArgs, 'id' | 'subgraphError'>>;
  activeAccounts?: Resolver<Array<ResolversTypes['ActiveAccount']>, ParentType, ContextType, RequireFields<QueryactiveAccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  helperStore?: Resolver<Maybe<ResolversTypes['_HelperStore']>, ParentType, ContextType, RequireFields<QueryhelperStoreArgs, 'id' | 'subgraphError'>>;
  helperStores?: Resolver<Array<ResolversTypes['_HelperStore']>, ParentType, ContextType, RequireFields<QueryhelperStoresArgs, 'skip' | 'first' | 'subgraphError'>>;
  protocol?: Resolver<Maybe<ResolversTypes['Protocol']>, ParentType, ContextType, RequireFields<QueryprotocolArgs, 'id' | 'subgraphError'>>;
  protocols?: Resolver<Array<ResolversTypes['Protocol']>, ParentType, ContextType, RequireFields<QueryprotocolsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type RewardResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Reward'] = ResolversParentTypes['Reward']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  createdTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  token?: SubscriptionResolver<Maybe<ResolversTypes['Token']>, "token", ParentType, ContextType, RequireFields<SubscriptiontokenArgs, 'id' | 'subgraphError'>>;
  tokens?: SubscriptionResolver<Array<ResolversTypes['Token']>, "tokens", ParentType, ContextType, RequireFields<SubscriptiontokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  reward?: SubscriptionResolver<Maybe<ResolversTypes['Reward']>, "reward", ParentType, ContextType, RequireFields<SubscriptionrewardArgs, 'id' | 'subgraphError'>>;
  rewards?: SubscriptionResolver<Array<ResolversTypes['Reward']>, "rewards", ParentType, ContextType, RequireFields<SubscriptionrewardsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolFee?: SubscriptionResolver<Maybe<ResolversTypes['PoolFee']>, "poolFee", ParentType, ContextType, RequireFields<SubscriptionpoolFeeArgs, 'id' | 'subgraphError'>>;
  poolFees?: SubscriptionResolver<Array<ResolversTypes['PoolFee']>, "poolFees", ParentType, ContextType, RequireFields<SubscriptionpoolFeesArgs, 'skip' | 'first' | 'subgraphError'>>;
  dexAmmProtocol?: SubscriptionResolver<Maybe<ResolversTypes['DexAmmProtocol']>, "dexAmmProtocol", ParentType, ContextType, RequireFields<SubscriptiondexAmmProtocolArgs, 'id' | 'subgraphError'>>;
  dexAmmProtocols?: SubscriptionResolver<Array<ResolversTypes['DexAmmProtocol']>, "dexAmmProtocols", ParentType, ContextType, RequireFields<SubscriptiondexAmmProtocolsArgs, 'skip' | 'first' | 'subgraphError'>>;
  usageMetricsDailySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['UsageMetricsDailySnapshot']>, "usageMetricsDailySnapshot", ParentType, ContextType, RequireFields<SubscriptionusageMetricsDailySnapshotArgs, 'id' | 'subgraphError'>>;
  usageMetricsDailySnapshots?: SubscriptionResolver<Array<ResolversTypes['UsageMetricsDailySnapshot']>, "usageMetricsDailySnapshots", ParentType, ContextType, RequireFields<SubscriptionusageMetricsDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  usageMetricsHourlySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['UsageMetricsHourlySnapshot']>, "usageMetricsHourlySnapshot", ParentType, ContextType, RequireFields<SubscriptionusageMetricsHourlySnapshotArgs, 'id' | 'subgraphError'>>;
  usageMetricsHourlySnapshots?: SubscriptionResolver<Array<ResolversTypes['UsageMetricsHourlySnapshot']>, "usageMetricsHourlySnapshots", ParentType, ContextType, RequireFields<SubscriptionusageMetricsHourlySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  financialsDailySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['FinancialsDailySnapshot']>, "financialsDailySnapshot", ParentType, ContextType, RequireFields<SubscriptionfinancialsDailySnapshotArgs, 'id' | 'subgraphError'>>;
  financialsDailySnapshots?: SubscriptionResolver<Array<ResolversTypes['FinancialsDailySnapshot']>, "financialsDailySnapshots", ParentType, ContextType, RequireFields<SubscriptionfinancialsDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  pool?: SubscriptionResolver<Maybe<ResolversTypes['Pool']>, "pool", ParentType, ContextType, RequireFields<SubscriptionpoolArgs, 'id' | 'subgraphError'>>;
  pools?: SubscriptionResolver<Array<ResolversTypes['Pool']>, "pools", ParentType, ContextType, RequireFields<SubscriptionpoolsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolDailySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['PoolDailySnapshot']>, "poolDailySnapshot", ParentType, ContextType, RequireFields<SubscriptionpoolDailySnapshotArgs, 'id' | 'subgraphError'>>;
  poolDailySnapshots?: SubscriptionResolver<Array<ResolversTypes['PoolDailySnapshot']>, "poolDailySnapshots", ParentType, ContextType, RequireFields<SubscriptionpoolDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolHourlySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['PoolHourlySnapshot']>, "poolHourlySnapshot", ParentType, ContextType, RequireFields<SubscriptionpoolHourlySnapshotArgs, 'id' | 'subgraphError'>>;
  poolHourlySnapshots?: SubscriptionResolver<Array<ResolversTypes['PoolHourlySnapshot']>, "poolHourlySnapshots", ParentType, ContextType, RequireFields<SubscriptionpoolHourlySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  tick?: SubscriptionResolver<Maybe<ResolversTypes['Tick']>, "tick", ParentType, ContextType, RequireFields<SubscriptiontickArgs, 'id' | 'subgraphError'>>;
  ticks?: SubscriptionResolver<Array<ResolversTypes['Tick']>, "ticks", ParentType, ContextType, RequireFields<SubscriptionticksArgs, 'skip' | 'first' | 'subgraphError'>>;
  tickDailySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['TickDailySnapshot']>, "tickDailySnapshot", ParentType, ContextType, RequireFields<SubscriptiontickDailySnapshotArgs, 'id' | 'subgraphError'>>;
  tickDailySnapshots?: SubscriptionResolver<Array<ResolversTypes['TickDailySnapshot']>, "tickDailySnapshots", ParentType, ContextType, RequireFields<SubscriptiontickDailySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  tickHourlySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['TickHourlySnapshot']>, "tickHourlySnapshot", ParentType, ContextType, RequireFields<SubscriptiontickHourlySnapshotArgs, 'id' | 'subgraphError'>>;
  tickHourlySnapshots?: SubscriptionResolver<Array<ResolversTypes['TickHourlySnapshot']>, "tickHourlySnapshots", ParentType, ContextType, RequireFields<SubscriptiontickHourlySnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  account?: SubscriptionResolver<Maybe<ResolversTypes['Account']>, "account", ParentType, ContextType, RequireFields<SubscriptionaccountArgs, 'id' | 'subgraphError'>>;
  accounts?: SubscriptionResolver<Array<ResolversTypes['Account']>, "accounts", ParentType, ContextType, RequireFields<SubscriptionaccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  position?: SubscriptionResolver<Maybe<ResolversTypes['Position']>, "position", ParentType, ContextType, RequireFields<SubscriptionpositionArgs, 'id' | 'subgraphError'>>;
  positions?: SubscriptionResolver<Array<ResolversTypes['Position']>, "positions", ParentType, ContextType, RequireFields<SubscriptionpositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  positionSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['PositionSnapshot']>, "positionSnapshot", ParentType, ContextType, RequireFields<SubscriptionpositionSnapshotArgs, 'id' | 'subgraphError'>>;
  positionSnapshots?: SubscriptionResolver<Array<ResolversTypes['PositionSnapshot']>, "positionSnapshots", ParentType, ContextType, RequireFields<SubscriptionpositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  deposit?: SubscriptionResolver<Maybe<ResolversTypes['Deposit']>, "deposit", ParentType, ContextType, RequireFields<SubscriptiondepositArgs, 'id' | 'subgraphError'>>;
  deposits?: SubscriptionResolver<Array<ResolversTypes['Deposit']>, "deposits", ParentType, ContextType, RequireFields<SubscriptiondepositsArgs, 'skip' | 'first' | 'subgraphError'>>;
  withdraw?: SubscriptionResolver<Maybe<ResolversTypes['Withdraw']>, "withdraw", ParentType, ContextType, RequireFields<SubscriptionwithdrawArgs, 'id' | 'subgraphError'>>;
  withdraws?: SubscriptionResolver<Array<ResolversTypes['Withdraw']>, "withdraws", ParentType, ContextType, RequireFields<SubscriptionwithdrawsArgs, 'skip' | 'first' | 'subgraphError'>>;
  swap?: SubscriptionResolver<Maybe<ResolversTypes['Swap']>, "swap", ParentType, ContextType, RequireFields<SubscriptionswapArgs, 'id' | 'subgraphError'>>;
  swaps?: SubscriptionResolver<Array<ResolversTypes['Swap']>, "swaps", ParentType, ContextType, RequireFields<SubscriptionswapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  activeAccount?: SubscriptionResolver<Maybe<ResolversTypes['ActiveAccount']>, "activeAccount", ParentType, ContextType, RequireFields<SubscriptionactiveAccountArgs, 'id' | 'subgraphError'>>;
  activeAccounts?: SubscriptionResolver<Array<ResolversTypes['ActiveAccount']>, "activeAccounts", ParentType, ContextType, RequireFields<SubscriptionactiveAccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  helperStore?: SubscriptionResolver<Maybe<ResolversTypes['_HelperStore']>, "helperStore", ParentType, ContextType, RequireFields<SubscriptionhelperStoreArgs, 'id' | 'subgraphError'>>;
  helperStores?: SubscriptionResolver<Array<ResolversTypes['_HelperStore']>, "helperStores", ParentType, ContextType, RequireFields<SubscriptionhelperStoresArgs, 'skip' | 'first' | 'subgraphError'>>;
  protocol?: SubscriptionResolver<Maybe<ResolversTypes['Protocol']>, "protocol", ParentType, ContextType, RequireFields<SubscriptionprotocolArgs, 'id' | 'subgraphError'>>;
  protocols?: SubscriptionResolver<Array<ResolversTypes['Protocol']>, "protocols", ParentType, ContextType, RequireFields<SubscriptionprotocolsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type SwapResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Swap'] = ResolversParentTypes['Swap']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  logIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gasLimit?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  gasUsed?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  gasPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tick?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  tokenIn?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  amountIn?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  amountInUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  tokenOut?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  amountOut?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  amountOutUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  reserveAmounts?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TickResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Tick'] = ResolversParentTypes['Tick']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  createdTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  prices?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  liquidityGross?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityGrossUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  liquidityNet?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityNetUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  lastSnapshotDayID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastSnapshotHourID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastUpdateTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lastUpdateBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TickDailySnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TickDailySnapshot'] = ResolversParentTypes['TickDailySnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tick?: Resolver<ResolversTypes['Tick'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  liquidityGross?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityGrossUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  liquidityNet?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityNetUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TickHourlySnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TickHourlySnapshot'] = ResolversParentTypes['TickHourlySnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hour?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tick?: Resolver<ResolversTypes['Tick'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  liquidityGross?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityGrossUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  liquidityNet?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityNetUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type TokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastPriceUSD?: Resolver<Maybe<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  lastPriceBlockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  _lastPricePool?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  _totalSupply?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  _totalValueLockedUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  _largePriceChangeBuffer?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  _largeTVLImpactBuffer?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rewards?: Resolver<Array<ResolversTypes['Reward']>, ParentType, ContextType, RequireFields<TokenrewardsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsageMetricsDailySnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UsageMetricsDailySnapshot'] = ResolversParentTypes['UsageMetricsDailySnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  dailyActiveUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeUniqueUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailyTransactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPoolCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailyDepositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailyWithdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailySwapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsageMetricsHourlySnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UsageMetricsHourlySnapshot'] = ResolversParentTypes['UsageMetricsHourlySnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hour?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  hourlyActiveUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cumulativeUniqueUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hourlyTransactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hourlyDepositCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hourlyWithdrawCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hourlySwapCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WithdrawResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Withdraw'] = ResolversParentTypes['Withdraw']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  logIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gasLimit?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  gasUsed?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  gasPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  protocol?: Resolver<ResolversTypes['DexAmmProtocol'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType>;
  tickLower?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  tickUpper?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  inputTokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<WithdrawinputTokensArgs, 'skip' | 'first'>>;
  inputTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  reserveAmounts?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  amountUSD?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parentHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _HelperStoreResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_HelperStore'] = ResolversParentTypes['_HelperStore']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  valueDecimalList?: Resolver<Maybe<Array<ResolversTypes['BigDecimal']>>, ParentType, ContextType>;
  valueDecimal?: Resolver<Maybe<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
  valueInt?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  ActiveAccount?: ActiveAccountResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Deposit?: DepositResolvers<ContextType>;
  DexAmmProtocol?: DexAmmProtocolResolvers<ContextType>;
  FinancialsDailySnapshot?: FinancialsDailySnapshotResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Pool?: PoolResolvers<ContextType>;
  PoolDailySnapshot?: PoolDailySnapshotResolvers<ContextType>;
  PoolFee?: PoolFeeResolvers<ContextType>;
  PoolHourlySnapshot?: PoolHourlySnapshotResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  PositionSnapshot?: PositionSnapshotResolvers<ContextType>;
  Protocol?: ProtocolResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reward?: RewardResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Swap?: SwapResolvers<ContextType>;
  Tick?: TickResolvers<ContextType>;
  TickDailySnapshot?: TickDailySnapshotResolvers<ContextType>;
  TickHourlySnapshot?: TickHourlySnapshotResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Token?: TokenResolvers<ContextType>;
  UsageMetricsDailySnapshot?: UsageMetricsDailySnapshotResolvers<ContextType>;
  UsageMetricsHourlySnapshot?: UsageMetricsHourlySnapshotResolvers<ContextType>;
  Withdraw?: WithdrawResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _HelperStore?: _HelperStoreResolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = FartherTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclientrc.js":
      return Promise.resolve(importedModule$0) as T;
    
    case ".graphclient/sources/farther/introspectionSchema":
      return Promise.resolve(importedModule$1) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const fartherTransforms = [];
const additionalTypeDefs = [] as any[];
const fartherHandler = new GraphqlHandler({
              name: "farther",
              config: {"endpoint":"https://api.studio.thegraph.com/query/70489/farther-base/version/latest"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("farther"),
              logger: logger.child("farther"),
              importFn,
            });
sources[0] = {
          name: 'farther',
          handler: fartherHandler,
          transforms: fartherTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })
const documentHashMap = {
        a901a14734d3e4a70273b0137639ca7dcbc4a7dbc8b04f16c03cf949e547cf42: FartherPositionsDocument
      }
additionalEnvelopPlugins.push(usePersistedOperations({
        getPersistedOperation(key) {
          return documentHashMap[key];
        },
      }))

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: FartherPositionsDocument,
        get rawSDL() {
          return printWithCache(FartherPositionsDocument);
        },
        location: 'FartherPositionsDocument.graphql',
        sha256Hash: 'a901a14734d3e4a70273b0137639ca7dcbc4a7dbc8b04f16c03cf949e547cf42'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type FartherPositionsQueryVariables = Exact<{
  account: Scalars['String']['input'];
  poolId: Scalars['String']['input'];
}>;


export type FartherPositionsQuery = { positions: Array<(
    Pick<Position, 'id' | 'tokenId' | 'isStaked'>
    & { account: (
      Pick<Account, 'id'>
      & { rewards: Array<(
        Pick<Reward, 'amount'>
        & { token: Pick<Token, 'id'> }
      )> }
    ), pool: Pick<Pool, 'id'> }
  )> };


export const FartherPositionsDocument = gql`
    query FartherPositions($account: String!, $poolId: String!) {
  positions(where: {account: $account, pool: $poolId}) {
    id
    tokenId
    isStaked
    account {
      id
      rewards {
        amount
        token {
          id
        }
      }
    }
    pool {
      id
    }
  }
}
    ` as unknown as DocumentNode<FartherPositionsQuery, FartherPositionsQueryVariables>;


export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    FartherPositions(variables: FartherPositionsQueryVariables, options?: C): Promise<FartherPositionsQuery> {
      return requester<FartherPositionsQuery, FartherPositionsQueryVariables>(FartherPositionsDocument, variables, options) as Promise<FartherPositionsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;