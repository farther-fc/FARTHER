// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployAirdrop is Script {
    address constant TOKEN = 0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a;

    uint constant AIRDROP_AMOUNT = 1249999999999999999999998122;

    bytes32 constant ROOT =
        0x67653fdd3b9fd675ffea145a1cf02ec6424f7821cc72622ead0dfd3f7f91ab56;

    address OWNER = 0x85EcbFCc3a8a9049E531Cd0fEeBa3Dedf5789e60;

    uint DURATION = 730 days;

    function run() public {
        vm.startBroadcast();

        FartherAirdrop airdrop = new FartherAirdrop(
            address(TOKEN),
            ROOT,
            block.timestamp + DURATION
        );

        // Transfer amount to airdrop
        FartherToken(address(TOKEN)).transfer(address(airdrop), AIRDROP_AMOUNT);

        vm.stopBroadcast();
    }
}
