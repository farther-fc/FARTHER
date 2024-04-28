// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployAirdrop is Script {
    address constant TOKEN = 0x5b69Edb2434b47978D608fD1CEa375A9Ed04Aa18;

    uint constant AIRDROP_AMOUNT = 29999999999999999999999700;

    bytes32 constant ROOT =
        0x222d1c9ea0682bf6b1ebc2e23225668671889b33d92ee3026297768d8ceea568;

    address OWNER = 0x85EcbFCc3a8a9049E531Cd0fEeBa3Dedf5789e60;

    uint START_TIME = 1714343400;
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
