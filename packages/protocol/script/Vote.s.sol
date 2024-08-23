// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";
import {IGovernor} from "openzeppelin/governance/Governor.sol";

contract Vote is Script {
    function run() public {
        vm.startBroadcast();
        // Staging
        IGovernor dao = IGovernor(0x09cF0d4472642e0c2a85DE373b9C8C13C3140A31);

        uint8 vote = 1;

        uint256 proposalId = 2427678200132110988492448113579309402201509066561289971867613008686050538784;

        dao.castVote(proposalId, vote);

        vm.stopBroadcast();
    }
}
