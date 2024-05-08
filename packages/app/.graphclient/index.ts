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
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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
  | 'owner_rewardsClaimed_ASC'
  | 'owner_rewardsClaimed_DESC'
  | 'owner_rewardsClaimed_ASC_NULLS_FIRST'
  | 'owner_rewardsClaimed_DESC_NULLS_LAST'
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
  | 'id_DESC_NULLS_LAST'
  | 'rewardsClaimed_ASC'
  | 'rewardsClaimed_DESC'
  | 'rewardsClaimed_ASC_NULLS_FIRST'
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



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Pool: ResolverTypeWrapper<Pool>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Position: ResolverTypeWrapper<Position>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Account: ResolverTypeWrapper<Account>;
  PositionWhereInput: PositionWhereInput;
  AccountWhereInput: AccountWhereInput;
  PoolWhereInput: PoolWhereInput;
  PositionOrderByInput: PositionOrderByInput;
  PoolOrderByInput: PoolOrderByInput;
  WhereIdInput: WhereIdInput;
  PoolsConnection: ResolverTypeWrapper<PoolsConnection>;
  PoolEdge: ResolverTypeWrapper<PoolEdge>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  AccountOrderByInput: AccountOrderByInput;
  AccountsConnection: ResolverTypeWrapper<AccountsConnection>;
  AccountEdge: ResolverTypeWrapper<AccountEdge>;
  PositionsConnection: ResolverTypeWrapper<PositionsConnection>;
  PositionEdge: ResolverTypeWrapper<PositionEdge>;
  SquidStatus: ResolverTypeWrapper<SquidStatus>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Int: Scalars['Int'];
  String: Scalars['String'];
  Pool: Pool;
  BigInt: Scalars['BigInt'];
  Position: Position;
  Boolean: Scalars['Boolean'];
  Account: Account;
  PositionWhereInput: PositionWhereInput;
  AccountWhereInput: AccountWhereInput;
  PoolWhereInput: PoolWhereInput;
  WhereIdInput: WhereIdInput;
  PoolsConnection: PoolsConnection;
  PoolEdge: PoolEdge;
  PageInfo: PageInfo;
  AccountsConnection: AccountsConnection;
  AccountEdge: AccountEdge;
  PositionsConnection: PositionsConnection;
  PositionEdge: PositionEdge;
  SquidStatus: SquidStatus;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  pools?: Resolver<Array<ResolversTypes['Pool']>, ParentType, ContextType, Partial<QuerypoolsArgs>>;
  poolById?: Resolver<Maybe<ResolversTypes['Pool']>, ParentType, ContextType, RequireFields<QuerypoolByIdArgs, 'id'>>;
  poolByUniqueInput?: Resolver<Maybe<ResolversTypes['Pool']>, ParentType, ContextType, RequireFields<QuerypoolByUniqueInputArgs, 'where'>>;
  poolsConnection?: Resolver<ResolversTypes['PoolsConnection'], ParentType, ContextType, RequireFields<QuerypoolsConnectionArgs, 'orderBy'>>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, Partial<QueryaccountsArgs>>;
  accountById?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountByIdArgs, 'id'>>;
  accountByUniqueInput?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountByUniqueInputArgs, 'where'>>;
  accountsConnection?: Resolver<ResolversTypes['AccountsConnection'], ParentType, ContextType, RequireFields<QueryaccountsConnectionArgs, 'orderBy'>>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, Partial<QuerypositionsArgs>>;
  positionById?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<QuerypositionByIdArgs, 'id'>>;
  positionByUniqueInput?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<QuerypositionByUniqueInputArgs, 'where'>>;
  positionsConnection?: Resolver<ResolversTypes['PositionsConnection'], ParentType, ContextType, RequireFields<QuerypositionsConnectionArgs, 'orderBy'>>;
  squidStatus?: Resolver<Maybe<ResolversTypes['SquidStatus']>, ParentType, ContextType>;
}>;

export type PoolResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Pool'] = ResolversParentTypes['Pool']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, Partial<PoolpositionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type PositionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  isStaked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isHeldByStaker?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rewardsClaimed?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, Partial<AccountpositionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoolsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PoolsConnection'] = ResolversParentTypes['PoolsConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PoolEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoolEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PoolEdge'] = ResolversParentTypes['PoolEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AccountsConnection'] = ResolversParentTypes['AccountsConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AccountEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AccountEdge'] = ResolversParentTypes['AccountEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PositionsConnection'] = ResolversParentTypes['PositionsConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PositionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PositionEdge'] = ResolversParentTypes['PositionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Position'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SquidStatusResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SquidStatus'] = ResolversParentTypes['SquidStatus']> = ResolversObject<{
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Pool?: PoolResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  Position?: PositionResolvers<ContextType>;
  Account?: AccountResolvers<ContextType>;
  PoolsConnection?: PoolsConnectionResolvers<ContextType>;
  PoolEdge?: PoolEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  AccountsConnection?: AccountsConnectionResolvers<ContextType>;
  AccountEdge?: AccountEdgeResolvers<ContextType>;
  PositionsConnection?: PositionsConnectionResolvers<ContextType>;
  PositionEdge?: PositionEdgeResolvers<ContextType>;
  SquidStatus?: SquidStatusResolvers<ContextType>;
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
              config: {"endpoint":"https://farther.squids.live/farther-production/graphql"},
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
        location: 'FartherPositionsDocument.graphql'
      },{
        document: LpRewardClaimersDocument,
        get rawSDL() {
          return printWithCache(LpRewardClaimersDocument);
        },
        location: 'LpRewardClaimersDocument.graphql'
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
  ownerId: Scalars['String'];
  poolId: Scalars['String'];
}>;


export type FartherPositionsQuery = { positions: Array<Pick<Position, 'id' | 'isStaked' | 'isHeldByStaker'>>, accountById?: Maybe<Pick<Account, 'id' | 'rewardsClaimed'>> };

export type LPRewardClaimersQueryVariables = Exact<{ [key: string]: never; }>;


export type LPRewardClaimersQuery = { accounts: Array<Pick<Account, 'id' | 'rewardsClaimed'>> };


export const FartherPositionsDocument = gql`
    query FartherPositions($ownerId: String!, $poolId: String!) {
  positions(where: {owner: {id_eq: $ownerId}, pool: {id_eq: $poolId}}) {
    id
    isStaked
    isHeldByStaker
  }
  accountById(id: $ownerId) {
    id
    rewardsClaimed
  }
}
    ` as unknown as DocumentNode<FartherPositionsQuery, FartherPositionsQueryVariables>;
export const LPRewardClaimersDocument = gql`
    query LPRewardClaimers {
  accounts(where: {rewardsClaimed_gt: 0}) {
    id
    rewardsClaimed
  }
}
    ` as unknown as DocumentNode<LPRewardClaimersQuery, LPRewardClaimersQueryVariables>;



export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    FartherPositions(variables: FartherPositionsQueryVariables, options?: C): Promise<FartherPositionsQuery> {
      return requester<FartherPositionsQuery, FartherPositionsQueryVariables>(FartherPositionsDocument, variables, options) as Promise<FartherPositionsQuery>;
    },
    LPRewardClaimers(variables?: LPRewardClaimersQueryVariables, options?: C): Promise<LPRewardClaimersQuery> {
      return requester<LPRewardClaimersQuery, LPRewardClaimersQueryVariables>(LPRewardClaimersDocument, variables, options) as Promise<LPRewardClaimersQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;