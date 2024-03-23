// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
// import {Merkle} from "murky/Merkle.sol";
import {FartherAirdrop1} from "../src/FartherAirdrop.sol";

contract FartherAirdropTest is Test {
    FartherAirdrop1 public airdrop;

    // address[] accounts = [
    //     getFundedAccount(1),
    //     getFundedAccount(2),
    //     getFundedAccount(3)
    // ];

    // bytes32[] leaves;

    // bytes32 public root;

    // Merkle public m;

    // function setUp() public {
    //     // airdrop = new FartherAirdrop1();
    // }

    function test_deploy_succeeds() external {}
}
