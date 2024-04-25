// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployAirdrop is Script {
    address constant TOKEN = 0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a;

    uint constant AIRDROP_AMOUNT = 1500000000000000000000000000;

    bytes32 constant ROOT =
        0x261f74d3df0c625f9829d73bea156f273d93cd477e4cfc8e2b2e160f6d39d31d;

    address OWNER = 0x85EcbFCc3a8a9049E531Cd0fEeBa3Dedf5789e60;

    uint START_TIME = 1714003200;
    uint DURATION = 730 days;

    function run() public {
        vm.startBroadcast();

        FartherAirdrop airdrop = new FartherAirdrop(
            address(TOKEN),
            ROOT,
            START_TIME,
            START_TIME + DURATION
        );

        // Transfer amount to airdrop
        FartherToken(address(TOKEN)).transfer(address(airdrop), AIRDROP_AMOUNT);

        vm.stopBroadcast();
    }
}
