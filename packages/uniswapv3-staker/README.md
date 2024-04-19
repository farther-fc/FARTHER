# uniswap-v3-staker

This is the canonical staking contract designed for [Uniswap V3](https://github.com/Uniswap/uniswap-v3-core).

## Deployments

Note that the v1.0.0 release is susceptible to a [high-difficulty, never-exploited vulnerability](https://github.com/Uniswap/v3-staker/issues/219). For this reason, please use the v1.0.2 release, deployed and verified on Etherscan:

| Network          | Explorer                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Mainnet          | <https://etherscan.io/address/0xe34139463bA50bD61336E0c446Bd8C0867c6fE65>                  |
| Arbitrum One     | <https://arbiscan.io/address/0xe34139463bA50bD61336E0c446Bd8C0867c6fE65>                   |
| Optimism         | <https://optimistic.etherscan.io/address/0xe34139463bA50bD61336E0c446Bd8C0867c6fE65>       |
| Base | <https://basescan.org/address/0x42be4d6527829fefa1493e1fb9f3676d2425c3c1> |

⚠️DEPRECATED⚠️: For historical verification purposes only, the staker at tag v1.0.0 was deployed at the address: `0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d`

## Links

- [Contract Design](docs/Design.md)

## Development and Testing

```sh
yarn
yarn test
```

## Gas Snapshots

```sh
# if gas snapshots need to be updated
$ UPDATE_SNAPSHOT=1 yarn test
```

## Contract Sizing

```sh
yarn size-contracts
```
