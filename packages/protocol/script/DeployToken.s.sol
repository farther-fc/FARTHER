// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherToken} from "../src/FartherToken.sol";

contract DeployToken is Script {
    function run() public {
        vm.startBroadcast();

        string memory NAME = "FarTest";
        string memory SYMBOL = "TEST";
        address OWNER = 0x85EcbFCc3a8a9049E531Cd0fEeBa3Dedf5789e60;

        FartherToken token = new FartherToken(
            NAME,
            SYMBOL,
            block.timestamp + 100
        );

        token.transferOwnership(OWNER);

        vm.stopBroadcast();
    }
}
