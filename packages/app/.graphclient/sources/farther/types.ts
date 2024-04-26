// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace FartherTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
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
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerypoolByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerypoolByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerypoolsConnectionArgs = {
  orderBy: Array<PoolOrderByInput>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolWhereInput>;
};


export type QueryaccountsArgs = {
  where?: InputMaybe<AccountWhereInput>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryaccountByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryaccountByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryaccountsConnectionArgs = {
  orderBy: Array<AccountOrderByInput>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountWhereInput>;
};


export type QuerypositionsArgs = {
  where?: InputMaybe<PositionWhereInput>;
  orderBy?: InputMaybe<Array<PositionOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerypositionByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerypositionByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerypositionsConnectionArgs = {
  orderBy: Array<PositionOrderByInput>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PositionWhereInput>;
};

export type Pool = {
  /**  Smart contract address of the pool  */
  id: Scalars['String']['output'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  /**  Creation block number  */
  createdBlock: Scalars['BigInt']['output'];
  /**  All positions in this market  */
  positions: Array<Position>;
};


export type PoolpositionsArgs = {
  where?: InputMaybe<PositionWhereInput>;
  orderBy?: InputMaybe<Array<PositionOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Position = {
  /** NonfungiblePositionManager tokenId */
  id: Scalars['String']['output'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  /**  Creation block number  */
  createdBlock: Scalars['BigInt']['output'];
  /**  Account that owns this position (staker contract is ignored, so its always the account that held it most recently other than the staker) */
  owner: Account;
  /**  The liquidity pool in which this position was opened  */
  pool: Pool;
  /**  Whether this position is staked in a reward program */
  isStaked?: Maybe<Scalars['Boolean']['output']>;
  /**  Whether this position is currently being held by the staker contract. This doesn't necessarily mean that the position is staked. */
  isHeldByStaker?: Maybe<Scalars['Boolean']['output']>;
};

export type Account = {
  /**  { Account address }  */
  id: Scalars['String']['output'];
  /**  All positions that belong to this account  */
  positions: Array<Position>;
};


export type AccountpositionsArgs = {
  where?: InputMaybe<PositionWhereInput>;
  orderBy?: InputMaybe<Array<PositionOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type PositionWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  createdTimestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdTimestamp_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  owner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  owner?: InputMaybe<AccountWhereInput>;
  pool_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  pool?: InputMaybe<PoolWhereInput>;
  isStaked_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isStaked_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isStaked_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isHeldByStaker_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isHeldByStaker_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isHeldByStaker_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  AND?: InputMaybe<Array<PositionWhereInput>>;
  OR?: InputMaybe<Array<PositionWhereInput>>;
};

export type AccountWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  positions_every?: InputMaybe<PositionWhereInput>;
  positions_some?: InputMaybe<PositionWhereInput>;
  positions_none?: InputMaybe<PositionWhereInput>;
  AND?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
};

export type PoolWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  createdTimestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdTimestamp_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  | 'id_DESC_NULLS_LAST'
  | 'createdTimestamp_ASC'
  | 'createdTimestamp_DESC'
  | 'createdTimestamp_ASC_NULLS_FIRST'
  | 'createdTimestamp_DESC_NULLS_LAST'
  | 'createdBlock_ASC'
  | 'createdBlock_DESC'
  | 'createdBlock_ASC_NULLS_FIRST'
  | 'createdBlock_DESC_NULLS_LAST'
  | 'owner_id_ASC'
  | 'owner_id_DESC'
  | 'owner_id_ASC_NULLS_FIRST'
  | 'owner_id_DESC_NULLS_LAST'
  | 'pool_id_ASC'
  | 'pool_id_DESC'
  | 'pool_id_ASC_NULLS_FIRST'
  | 'pool_id_DESC_NULLS_LAST'
  | 'pool_createdTimestamp_ASC'
  | 'pool_createdTimestamp_DESC'
  | 'pool_createdTimestamp_ASC_NULLS_FIRST'
  | 'pool_createdTimestamp_DESC_NULLS_LAST'
  | 'pool_createdBlock_ASC'
  | 'pool_createdBlock_DESC'
  | 'pool_createdBlock_ASC_NULLS_FIRST'
  | 'pool_createdBlock_DESC_NULLS_LAST'
  | 'isStaked_ASC'
  | 'isStaked_DESC'
  | 'isStaked_ASC_NULLS_FIRST'
  | 'isStaked_DESC_NULLS_LAST'
  | 'isHeldByStaker_ASC'
  | 'isHeldByStaker_DESC'
  | 'isHeldByStaker_ASC_NULLS_FIRST'
  | 'isHeldByStaker_DESC_NULLS_LAST';

export type PoolOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'createdTimestamp_ASC'
  | 'createdTimestamp_DESC'
  | 'createdTimestamp_ASC_NULLS_FIRST'
  | 'createdTimestamp_DESC_NULLS_LAST'
  | 'createdBlock_ASC'
  | 'createdBlock_DESC'
  | 'createdBlock_ASC_NULLS_FIRST'
  | 'createdBlock_DESC_NULLS_LAST';

export type WhereIdInput = {
  id: Scalars['String']['input'];
};

export type PoolsConnection = {
  edges: Array<PoolEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PoolEdge = {
  node: Pool;
  cursor: Scalars['String']['output'];
};

export type PageInfo = {
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
  endCursor: Scalars['String']['output'];
};

export type AccountOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST';

export type AccountsConnection = {
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AccountEdge = {
  node: Account;
  cursor: Scalars['String']['output'];
};

export type PositionsConnection = {
  edges: Array<PositionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PositionEdge = {
  node: Position;
  cursor: Scalars['String']['output'];
};

export type SquidStatus = {
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>;
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
