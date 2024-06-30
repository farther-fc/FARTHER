// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployAirdrop is Script {
    address constant TOKEN = 0x8ad5b9007556749DE59E088c88801a3Aaa87134B;

    // uint constant AIRDROP_AMOUNT = 3188624000000000000000000;

    bytes32 constant ROOT =
        0xe6fc94ca84c300b31b22f592633ac1d25f4d9185a7ae68939ced51b2bf79aa33;

    address OWNER = 0x97e3B75B2eebCC722B504851416e1410B32180a3;

    uint START_TIME = 1719792000;
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
        // FartherToken(address(TOKEN)).transfer(address(airdrop), AIRDROP_AMOUNT);

        vm.stopBroadcast();
    }
}
