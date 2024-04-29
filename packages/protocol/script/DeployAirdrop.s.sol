// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployAirdrop is Script {
    address constant TOKEN = 0x5b69Edb2434b47978D608fD1CEa375A9Ed04Aa18;

    uint constant AIRDROP_AMOUNT = 29999999999999999999996037;

    bytes32 constant ROOT =
        0x551b173c460428f3d3df5dd69397e35b5c85c18b221d2bdf77d33db5b28a7f50;

    address OWNER = 0x85EcbFCc3a8a9049E531Cd0fEeBa3Dedf5789e60;

    uint START_TIME = 1714428000;
    uint DURATION = 365 days;

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
