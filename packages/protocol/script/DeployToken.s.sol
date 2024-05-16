// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherToken} from "../src/FartherToken.sol";

contract DeployToken is Script {
    function run() public {
        vm.startBroadcast();

        string memory NAME = "FartherStaging";
        string memory SYMBOL = "FARTHER_STG";
        address OWNER = 0xCa27037CeD432fadF54Dee9bC210DfD5ab2F13C8;

        FartherToken token = new FartherToken(
            NAME,
            SYMBOL,
            block.timestamp + 100
        );

        token.transferOwnership(OWNER);

        vm.stopBroadcast();
    }
}
