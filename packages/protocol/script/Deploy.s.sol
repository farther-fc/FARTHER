// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop1} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract Deploy is Script {
    address DEPLOYER = 0x0796E71052751Eb1442d440565df9Bd86a689A31;
    address VBUTERIN = 0xC9CCDC272CAA17aF67f5c8Fc198839b83e06433e;
    uint testAmount = 10970375203;

    function run() public {
        Merkle merkle = new Merkle();

        bytes32[] memory leaves = new bytes32[](2);
        leaves[0] = keccak256(abi.encodePacked(uint(0), VBUTERIN, testAmount));
        leaves[1] = keccak256(
            abi.encodePacked(uint(0), DEPLOYER, testAmount * 2)
        );

        bytes32 root = merkle.getRoot(leaves);

        vm.startBroadcast();

        FartherToken token = new FartherToken(block.timestamp + 10);

        FartherAirdrop1 airdrop = new FartherAirdrop1(
            address(token),
            root,
            block.timestamp + 1 hours
        );

        // Fund the airdrop
        token.transfer(address(airdrop), testAmount * 3);

        vm.stopBroadcast();
    }
}
