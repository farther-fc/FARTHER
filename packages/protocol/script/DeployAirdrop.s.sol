// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployAirdrop is Script {
    address constant TOKEN = 0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a;
    uint constant AIRDROP_AMOUNT = 68999999999999999999999826;
    bytes32 constant ROOT =
        0x2ecb046ca22426c3b259e65d5bddd9e3f0a1be947cc789f19ead030c5d858fb8;

    function run() public {
        vm.startBroadcast();

        FartherAirdrop airdrop = new FartherAirdrop(
            address(TOKEN),
            ROOT,
            block.timestamp + 730 days
        );

        // Fund the airdrop
        FartherToken(TOKEN).transfer(address(airdrop), AIRDROP_AMOUNT);

        vm.stopBroadcast();
    }
}
