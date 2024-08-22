// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherDAO} from "../src/FartherDAO.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";

contract DeployDAO is Script {
    function run() public {
        vm.startBroadcast();

        new FartherDAO(IVotes(0x8ad5b9007556749DE59E088c88801a3Aaa87134B));

        vm.stopBroadcast();
    }
}
