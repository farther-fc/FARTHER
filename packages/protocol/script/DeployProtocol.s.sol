// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract Deploy is Script {
    uint constant AIRDROP_AMOUNT = 68999999999999999999999448;
    bytes32 constant ROOT =
        0xa8011c27e48a627450f0eeaa368b44649e8a48f90480297fa8f0d06a7172e43f;

    function run() public {
        vm.startBroadcast();

        FartherToken token = new FartherToken(block.timestamp + 100);

        FartherAirdrop airdrop = new FartherAirdrop(
            address(token),
            ROOT,
            block.timestamp + 730 days
        );

        // Fund the airdrop
        token.transfer(address(airdrop), AIRDROP_AMOUNT);

        vm.stopBroadcast();
    }
}
