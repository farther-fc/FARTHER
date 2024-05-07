// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherVesting} from "../src/FartherVesting.sol";

contract DeployVesting is Script {
    function run() public {
        vm.startBroadcast();

        address OWNER = 0x97e3B75B2eebCC722B504851416e1410B32180a3;

        uint64 START_TIME = 1746057600;
        uint64 DURATION = 63072000; // 2 years in seconds

        FartherVesting fartherVesting = new FartherVesting(
            OWNER,
            START_TIME,
            DURATION
        );

        vm.stopBroadcast();
    }
}
