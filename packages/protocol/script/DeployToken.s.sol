// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Merkle} from "murky/Merkle.sol";

contract DeployToken is Script {
    function run() public {
        vm.startBroadcast();

        new FartherToken(block.timestamp + 100);

        vm.stopBroadcast();
    }
}
