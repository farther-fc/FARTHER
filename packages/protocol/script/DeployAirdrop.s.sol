// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployAirdrop is Script {
    address constant TOKEN = 0xf9A98fDC95A427fCfB1506A6E8A3143119417fBA;

    uint constant AIRDROP_AMOUNT = 448118963291220441472220;

    bytes32 constant ROOT =
        0xdbde7eb5057007592bafb26d41f6555957a969067f52bc6945be8a0fc3dfb700;

    address OWNER = 0xCa27037CeD432fadF54Dee9bC210DfD5ab2F13C8;

    uint START_TIME = 1717200000;
    uint DURATION = 365 days;

    function run() public {
        vm.startBroadcast();

        // Check if code exists at token address
        if (TOKEN.code.length == 0) {
            console.log("Token contract does not exist at address");
            vm.stopBroadcast();
            return;
        }

        FartherAirdrop airdrop = new FartherAirdrop(
            address(TOKEN),
            ROOT,
            START_TIME,
            START_TIME + DURATION
        );

        // Transfer ownership to OWNER
        airdrop.transferOwnership(OWNER);

        // Transfer amount to airdrop
        FartherToken(address(TOKEN)).transfer(address(airdrop), AIRDROP_AMOUNT);

        vm.stopBroadcast();
    }
}
