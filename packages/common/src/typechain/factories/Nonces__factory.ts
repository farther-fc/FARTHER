/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type { Nonces, NoncesInterface } from "../Nonces";

const _abi = [
  {
    type: "function",
    name: "nonces",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "error",
    name: "InvalidAccountNonce",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
      {
        name: "currentNonce",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const;

export class Nonces__factory {
  static readonly abi = _abi;
  static createInterface(): NoncesInterface {
    return new Interface(_abi) as NoncesInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Nonces {
    return new Contract(address, _abi, runner) as unknown as Nonces;
  }
}
