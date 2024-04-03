// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract Deploy is Script {
    uint constant AIRDROP_AMOUNT = 69000000000000000000000000;
    bytes32 constant ROOT =
        0x2ecb046ca22426c3b259e65d5bddd9e3f0a1be947cc789f19ead030c5d858fb8;

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
