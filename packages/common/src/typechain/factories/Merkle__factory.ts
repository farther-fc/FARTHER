/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { Merkle, MerkleInterface } from "../Merkle";

const _abi = [
  {
    type: "function",
    name: "getProof",
    inputs: [
      {
        name: "data",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "node",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getRoot",
    inputs: [
      {
        name: "data",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "hashLeafPairs",
    inputs: [
      {
        name: "left",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "right",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "_hash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "log2ceil",
    inputs: [
      {
        name: "x",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "log2ceilBitMagic",
    inputs: [
      {
        name: "x",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "verifyProof",
    inputs: [
      {
        name: "root",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "proof",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "valueToProve",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "pure",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b506108f08061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80632e08d6021461006757806358161a421461008d578063b8616195146100b0578063cf06c7b7146100d0578063dd1d2599146100e3578063e27d5153146100f6575b600080fd5b61007a610075366004610732565b610109565b6040519081526020015b60405180910390f35b6100a061009b36600461076f565b6101a9565b6040519015158152602001610084565b6100c36100be3660046107bf565b6101f3565b6040516100849190610804565b61007a6100de366004610848565b61037a565b61007a6100f1366004610861565b6104b7565b61007a610104366004610848565b6104e5565b6000600182511161016d5760405162461bcd60e51b815260206004820152602360248201527f776f6e27742067656e657261746520726f6f7420666f722073696e676c65206c60448201526232b0b360e91b60648201526084015b60405180910390fd5b6001825111156101875761018082610510565b915061016d565b8160008151811061019a5761019a610883565b60200260200101519050919050565b81516000908290825b818110156101e7576101dd838783815181106101d0576101d0610883565b60200260200101516104b7565b92506001016101b2565b50509093149392505050565b606060018351116102525760405162461bcd60e51b8152602060048201526024808201527f776f6e27742067656e65726174652070726f6f6620666f722073696e676c65206044820152633632b0b360e11b6064820152608401610164565b600061025e845161037a565b67ffffffffffffffff8111156102765761027661067e565b60405190808252806020026020018201604052801561029f578160200160208202803683370190505b50905060005b60018551111561037057836001166001036102fa578460018503815181106102cf576102cf610883565b60200260200101518282815181106102e9576102e9610883565b602002602001018181525050610357565b8451846001010361031b576000801b8282815181106102e9576102e9610883565b84846001018151811061033057610330610883565b602002602001015182828151811061034a5761034a610883565b6020026020010181815250505b60010160028404935061036985610510565b94506102a5565b5090505b92915050565b60006001821161038c57506000919050565b600082600160801b81106103ad57608093841c936103aa9083610899565b91505b6801000000000000000084106103d057604093841c936103cd9083610899565b91505b64010000000084106103ef57602093841c936103ec9083610899565b91505b62010000841061040c57601093841c936104099083610899565b91505b610100841061042857600893841c936104259083610899565b91505b6010841061044357600493841c936104409083610899565b91505b6004841061045e57600293841c9361045b9083610899565b91505b6002841061047457610471600183610899565b91505b60008161048381196001610899565b16905081811480156104955750600083115b156104a35750909392505050565b6104ae836001610899565b95945050505050565b600081831080156104cf5783600052826020526104d8565b82600052836020525b5050604060002092915050565b6000808219600101831683145b831561050857600193841c9391909101906104f2565b900392915050565b606080600083519050806001166001036105bf576002810460010167ffffffffffffffff8111156105435761054361067e565b60405190808252806020026020018201604052801561056c578160200160208202803683370190505b50915061059884600183038151811061058757610587610883565b60200260200101516000801b6104b7565b826001845103815181106105ae576105ae610883565b602002602001018181525050610608565b6002810467ffffffffffffffff8111156105db576105db61067e565b604051908082528060200260200182016040528015610604578160200160208202803683370190505b5091505b6000805b600183038110156106745761064986828151811061062c5761062c610883565b60200260200101518783600101815181106101d0576101d0610883565b84838151811061065b5761065b610883565b602090810291909101015260019091019060020161060c565b5091949350505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126106a557600080fd5b8135602067ffffffffffffffff808311156106c2576106c261067e565b8260051b604051601f19603f830116810181811084821117156106e7576106e761067e565b604052938452602081870181019490810192508785111561070757600080fd5b6020870191505b848210156107275781358352918301919083019061070e565b979650505050505050565b60006020828403121561074457600080fd5b813567ffffffffffffffff81111561075b57600080fd5b61076784828501610694565b949350505050565b60008060006060848603121561078457600080fd5b83359250602084013567ffffffffffffffff8111156107a257600080fd5b6107ae86828701610694565b925050604084013590509250925092565b600080604083850312156107d257600080fd5b823567ffffffffffffffff8111156107e957600080fd5b6107f585828601610694565b95602094909401359450505050565b6020808252825182820181905260009190848201906040850190845b8181101561083c57835183529284019291840191600101610820565b50909695505050505050565b60006020828403121561085a57600080fd5b5035919050565b6000806040838503121561087457600080fd5b50508035926020909101359150565b634e487b7160e01b600052603260045260246000fd5b8082018082111561037457634e487b7160e01b600052601160045260246000fdfea2646970667358221220e3637b51f7299b97a651a66898dbbd3d12958b172bbb3296ce077cac1089864c64736f6c63430008190033";

type MerkleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MerkleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Merkle__factory extends ContractFactory {
  constructor(...args: MerkleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Merkle & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Merkle__factory {
    return super.connect(runner) as Merkle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MerkleInterface {
    return new Interface(_abi) as MerkleInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Merkle {
    return new Contract(address, _abi, runner) as unknown as Merkle;
  }
}