// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FartherDAO} from "../src/FartherDAO.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";

contract DeployDAO is Script {
    function run() public {
        vm.startBroadcast();

        address tokenAddress = vm.envAddress("TOKEN_ADDRESS");

        uint256 votingDelay = vm.envUint("VOTING_DELAY");

        uint256 votingPeriod = vm.envUint("VOTING_PERIOD");

        uint256 proposalThreshold = vm.envUint("PROPOSAL_THRESHOLD");

        new FartherDAO(
            IVotes(tokenAddress),
            votingDelay,
            votingPeriod,
            proposalThreshold
        );

        vm.stopBroadcast();
    }
}
