// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherToken} from "../src/FartherToken.sol";

contract DeployToken is Script {
    function run() public {
        vm.startBroadcast();

        string memory NAME = "Farther";
        string memory SYMBOL = "FARTHER";
        address OWNER = 0x97e3B75B2eebCC722B504851416e1410B32180a3;

        FartherToken token = new FartherToken(
            NAME,
            SYMBOL,
            block.timestamp + 100
        );

        token.transferOwnership(OWNER);

        vm.stopBroadcast();
    }
}
