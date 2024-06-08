// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace FartherTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
};

export type Query = {
  pools: Array<Pool>;
  poolById?: Maybe<Pool>;
  /** @deprecated Use poolById */
  poolByUniqueInput?: Maybe<Pool>;
  poolsConnection: PoolsConnection;
  accounts: Array<Account>;
  accountById?: Maybe<Account>;
  /** @deprecated Use accountById */
  accountByUniqueInput?: Maybe<Account>;
  accountsConnection: AccountsConnection;
  positions: Array<Position>;
  positionById?: Maybe<Position>;
  /** @deprecated Use positionById */
  positionByUniqueInput?: Maybe<Position>;
  positionsConnection: PositionsConnection;
  squidStatus?: Maybe<SquidStatus>;
};


export type QuerypoolsArgs = {
  where?: InputMaybe<PoolWhereInput>;
  orderBy?: InputMaybe<Array<PoolOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QuerypoolByIdArgs = {
  id: Scalars['String'];
};


export type QuerypoolByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerypoolsConnectionArgs = {
  orderBy: Array<PoolOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PoolWhereInput>;
};


export type QueryaccountsArgs = {
  where?: InputMaybe<AccountWhereInput>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryaccountByIdArgs = {
  id: Scalars['String'];
};


export type QueryaccountByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryaccountsConnectionArgs = {
  orderBy: Array<AccountOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AccountWhereInput>;
};


export type QuerypositionsArgs = {
  where?: InputMaybe<PositionWhereInput>;
  orderBy?: InputMaybe<Array<PositionOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QuerypositionByIdArgs = {
  id: Scalars['String'];
};


export type QuerypositionByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerypositionsConnectionArgs = {
  orderBy: Array<PositionOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PositionWhereInput>;
};

export type Pool = {
  /**  Smart contract address of the pool  */
  id: Scalars['String'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt'];
  /**  Creation block number  */
  createdBlock: Scalars['BigInt'];
  /**  All positions in this market  */
  positions: Array<Position>;
};


export type PoolpositionsArgs = {
  where?: InputMaybe<PositionWhereInput>;
  orderBy?: InputMaybe<Array<PositionOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};

export type Position = {
  /** NonfungiblePositionManager tokenId */
  id: Scalars['String'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt'];
  /**  Creation block number  */
  createdBlock: Scalars['BigInt'];
  /**  Account that owns this position (staker contract is ignored, so its always the account that held it most recently other than the staker) */
  owner: Account;
  /**  The liquidity pool in which this position was opened  */
  pool: Pool;
  /**  The amount of liquidity tokens in this position  */
  liquidity: Scalars['BigInt'];
  /**  The amount of token0 in this position  */
  amount0: Scalars['BigInt'];
  /**  The amount of token1 in this position  */
  amount1: Scalars['BigInt'];
  /**  Whether this position is staked in a reward program */
  isStaked?: Maybe<Scalars['Boolean']>;
  /**  Whether this position is currently being held by the staker contract. This doesn't necessarily mean that the position is staked. */
  isHeldByStaker?: Maybe<Scalars['Boolean']>;
};

export type Account = {
  /**  { Account address }  */
  id: Scalars['String'];
  /**  Total liquidity rewards claimed by this account */
  rewardsClaimed?: Maybe<Scalars['BigInt']>;
  /**  All positions that belong to this account  */
  positions: Array<Position>;
};


export type AccountpositionsArgs = {
  where?: InputMaybe<PositionWhereInput>;
  orderBy?: InputMaybe<Array<PositionOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};

export type PositionWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  createdTimestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  createdTimestamp_eq?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  createdBlock_eq?: InputMaybe<Scalars['BigInt']>;
  createdBlock_not_eq?: InputMaybe<Scalars['BigInt']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owner_isNull?: InputMaybe<Scalars['Boolean']>;
  owner?: InputMaybe<AccountWhereInput>;
  pool_isNull?: InputMaybe<Scalars['Boolean']>;
  pool?: InputMaybe<PoolWhereInput>;
  liquidity_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidity_eq?: InputMaybe<Scalars['BigInt']>;
  liquidity_not_eq?: InputMaybe<Scalars['BigInt']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount0_isNull?: InputMaybe<Scalars['Boolean']>;
  amount0_eq?: InputMaybe<Scalars['BigInt']>;
  amount0_not_eq?: InputMaybe<Scalars['BigInt']>;
  amount0_gt?: InputMaybe<Scalars['BigInt']>;
  amount0_gte?: InputMaybe<Scalars['BigInt']>;
  amount0_lt?: InputMaybe<Scalars['BigInt']>;
  amount0_lte?: InputMaybe<Scalars['BigInt']>;
  amount0_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount1_isNull?: InputMaybe<Scalars['Boolean']>;
  amount1_eq?: InputMaybe<Scalars['BigInt']>;
  amount1_not_eq?: InputMaybe<Scalars['BigInt']>;
  amount1_gt?: InputMaybe<Scalars['BigInt']>;
  amount1_gte?: InputMaybe<Scalars['BigInt']>;
  amount1_lt?: InputMaybe<Scalars['BigInt']>;
  amount1_lte?: InputMaybe<Scalars['BigInt']>;
  amount1_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isStaked_isNull?: InputMaybe<Scalars['Boolean']>;
  isStaked_eq?: InputMaybe<Scalars['Boolean']>;
  isStaked_not_eq?: InputMaybe<Scalars['Boolean']>;
  isHeldByStaker_isNull?: InputMaybe<Scalars['Boolean']>;
  isHeldByStaker_eq?: InputMaybe<Scalars['Boolean']>;
  isHeldByStaker_not_eq?: InputMaybe<Scalars['Boolean']>;
  AND?: InputMaybe<Array<PositionWhereInput>>;
  OR?: InputMaybe<Array<PositionWhereInput>>;
};

export type AccountWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  rewardsClaimed_isNull?: InputMaybe<Scalars['Boolean']>;
  rewardsClaimed_eq?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_not_eq?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  positions_every?: InputMaybe<PositionWhereInput>;
  positions_some?: InputMaybe<PositionWhereInput>;
  positions_none?: InputMaybe<PositionWhereInput>;
  AND?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
};

export type PoolWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  createdTimestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  createdTimestamp_eq?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  createdBlock_eq?: InputMaybe<Scalars['BigInt']>;
  createdBlock_not_eq?: InputMaybe<Scalars['BigInt']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  positions_every?: InputMaybe<PositionWhereInput>;
  positions_some?: InputMaybe<PositionWhereInput>;
  positions_none?: InputMaybe<PositionWhereInput>;
  AND?: InputMaybe<Array<PoolWhereInput>>;
  OR?: InputMaybe<Array<PoolWhereInput>>;
};

export type PositionOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'createdTimestamp_ASC'
  | 'createdTimestamp_DESC'
  | 'createdTimestamp_ASC_NULLS_FIRST'
  | 'createdTimestamp_ASC_NULLS_LAST'
  | 'createdTimestamp_DESC_NULLS_FIRST'
  | 'createdTimestamp_DESC_NULLS_LAST'
  | 'createdBlock_ASC'
  | 'createdBlock_DESC'
  | 'createdBlock_ASC_NULLS_FIRST'
  | 'createdBlock_ASC_NULLS_LAST'
  | 'createdBlock_DESC_NULLS_FIRST'
  | 'createdBlock_DESC_NULLS_LAST'
  | 'owner_id_ASC'
  | 'owner_id_DESC'
  | 'owner_id_ASC_NULLS_FIRST'
  | 'owner_id_ASC_NULLS_LAST'
  | 'owner_id_DESC_NULLS_FIRST'
  | 'owner_id_DESC_NULLS_LAST'
  | 'owner_rewardsClaimed_ASC'
  | 'owner_rewardsClaimed_DESC'
  | 'owner_rewardsClaimed_ASC_NULLS_FIRST'
  | 'owner_rewardsClaimed_ASC_NULLS_LAST'
  | 'owner_rewardsClaimed_DESC_NULLS_FIRST'
  | 'owner_rewardsClaimed_DESC_NULLS_LAST'
  | 'pool_id_ASC'
  | 'pool_id_DESC'
  | 'pool_id_ASC_NULLS_FIRST'
  | 'pool_id_ASC_NULLS_LAST'
  | 'pool_id_DESC_NULLS_FIRST'
  | 'pool_id_DESC_NULLS_LAST'
  | 'pool_createdTimestamp_ASC'
  | 'pool_createdTimestamp_DESC'
  | 'pool_createdTimestamp_ASC_NULLS_FIRST'
  | 'pool_createdTimestamp_ASC_NULLS_LAST'
  | 'pool_createdTimestamp_DESC_NULLS_FIRST'
  | 'pool_createdTimestamp_DESC_NULLS_LAST'
  | 'pool_createdBlock_ASC'
  | 'pool_createdBlock_DESC'
  | 'pool_createdBlock_ASC_NULLS_FIRST'
  | 'pool_createdBlock_ASC_NULLS_LAST'
  | 'pool_createdBlock_DESC_NULLS_FIRST'
  | 'pool_createdBlock_DESC_NULLS_LAST'
  | 'liquidity_ASC'
  | 'liquidity_DESC'
  | 'liquidity_ASC_NULLS_FIRST'
  | 'liquidity_ASC_NULLS_LAST'
  | 'liquidity_DESC_NULLS_FIRST'
  | 'liquidity_DESC_NULLS_LAST'
  | 'amount0_ASC'
  | 'amount0_DESC'
  | 'amount0_ASC_NULLS_FIRST'
  | 'amount0_ASC_NULLS_LAST'
  | 'amount0_DESC_NULLS_FIRST'
  | 'amount0_DESC_NULLS_LAST'
  | 'amount1_ASC'
  | 'amount1_DESC'
  | 'amount1_ASC_NULLS_FIRST'
  | 'amount1_ASC_NULLS_LAST'
  | 'amount1_DESC_NULLS_FIRST'
  | 'amount1_DESC_NULLS_LAST'
  | 'isStaked_ASC'
  | 'isStaked_DESC'
  | 'isStaked_ASC_NULLS_FIRST'
  | 'isStaked_ASC_NULLS_LAST'
  | 'isStaked_DESC_NULLS_FIRST'
  | 'isStaked_DESC_NULLS_LAST'
  | 'isHeldByStaker_ASC'
  | 'isHeldByStaker_DESC'
  | 'isHeldByStaker_ASC_NULLS_FIRST'
  | 'isHeldByStaker_ASC_NULLS_LAST'
  | 'isHeldByStaker_DESC_NULLS_FIRST'
  | 'isHeldByStaker_DESC_NULLS_LAST';

export type PoolOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'createdTimestamp_ASC'
  | 'createdTimestamp_DESC'
  | 'createdTimestamp_ASC_NULLS_FIRST'
  | 'createdTimestamp_ASC_NULLS_LAST'
  | 'createdTimestamp_DESC_NULLS_FIRST'
  | 'createdTimestamp_DESC_NULLS_LAST'
  | 'createdBlock_ASC'
  | 'createdBlock_DESC'
  | 'createdBlock_ASC_NULLS_FIRST'
  | 'createdBlock_ASC_NULLS_LAST'
  | 'createdBlock_DESC_NULLS_FIRST'
  | 'createdBlock_DESC_NULLS_LAST';

export type WhereIdInput = {
  id: Scalars['String'];
};

export type PoolsConnection = {
  edges: Array<PoolEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PoolEdge = {
  node: Pool;
  cursor: Scalars['String'];
};

export type PageInfo = {
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
  endCursor: Scalars['String'];
};

export type AccountOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'rewardsClaimed_ASC'
  | 'rewardsClaimed_DESC'
  | 'rewardsClaimed_ASC_NULLS_FIRST'
  | 'rewardsClaimed_ASC_NULLS_LAST'
  | 'rewardsClaimed_DESC_NULLS_FIRST'
  | 'rewardsClaimed_DESC_NULLS_LAST';

export type AccountsConnection = {
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AccountEdge = {
  node: Account;
  cursor: Scalars['String'];
};

export type PositionsConnection = {
  edges: Array<PositionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PositionEdge = {
  node: Position;
  cursor: Scalars['String'];
};

export type SquidStatus = {
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']>;
};

  export type QuerySdk = {
      /** null **/
  pools: InContextSdkMethod<Query['pools'], QuerypoolsArgs, MeshContext>,
  /** null **/
  poolById: InContextSdkMethod<Query['poolById'], QuerypoolByIdArgs, MeshContext>,
  /** null **/
  poolByUniqueInput: InContextSdkMethod<Query['poolByUniqueInput'], QuerypoolByUniqueInputArgs, MeshContext>,
  /** null **/
  poolsConnection: InContextSdkMethod<Query['poolsConnection'], QuerypoolsConnectionArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Query['accounts'], QueryaccountsArgs, MeshContext>,
  /** null **/
  accountById: InContextSdkMethod<Query['accountById'], QueryaccountByIdArgs, MeshContext>,
  /** null **/
  accountByUniqueInput: InContextSdkMethod<Query['accountByUniqueInput'], QueryaccountByUniqueInputArgs, MeshContext>,
  /** null **/
  accountsConnection: InContextSdkMethod<Query['accountsConnection'], QueryaccountsConnectionArgs, MeshContext>,
  /** null **/
  positions: InContextSdkMethod<Query['positions'], QuerypositionsArgs, MeshContext>,
  /** null **/
  positionById: InContextSdkMethod<Query['positionById'], QuerypositionByIdArgs, MeshContext>,
  /** null **/
  positionByUniqueInput: InContextSdkMethod<Query['positionByUniqueInput'], QuerypositionByUniqueInputArgs, MeshContext>,
  /** null **/
  positionsConnection: InContextSdkMethod<Query['positionsConnection'], QuerypositionsConnectionArgs, MeshContext>,
  /** null **/
  squidStatus: InContextSdkMethod<Query['squidStatus'], {}, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["farther"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
