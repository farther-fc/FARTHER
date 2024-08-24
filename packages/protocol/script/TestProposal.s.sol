// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";
import {IGovernor} from "openzeppelin/governance/Governor.sol";

contract Propose is Script {
    function run() public {
        vm.startBroadcast();

        address TOKEN = 0xf9A98fDC95A427fCfB1506A6E8A3143119417fBA;

        // Staging
        IGovernor dao = IGovernor(0x09cF0d4472642e0c2a85DE373b9C8C13C3140A31);

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        bytes memory data = abi.encodeWithSignature(
            "transfer(address,uint256)",
            0xCa27037CeD432fadF54Dee9bC210DfD5ab2F13C8,
            1
        );

        targets[0] = TOKEN;
        calldatas[0] = data;

        console.log("address(this)", address(this));

        uint256 proposalId = dao.propose(
            targets,
            values,
            calldatas,
            "transfer proposal 1"
        );

        console.log("Proposal ID: %d", proposalId);

        console.log("state", uint256(dao.state(proposalId)));

        uint8 vote = 1; /// support

        dao.castVote(
            77276623403368459539665692651617199052214927841640430781103722167477611270634,
            vote
        );

        vm.stopBroadcast();
    }
}

contract Execute is Script {
    function run() public {
        vm.startBroadcast();

        address TOKEN = 0xf9A98fDC95A427fCfB1506A6E8A3143119417fBA;

        // Staging
        IGovernor dao = IGovernor(0x09cF0d4472642e0c2a85DE373b9C8C13C3140A31);

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        bytes memory data = abi.encodeWithSignature(
            "transfer(address,uint256)",
            0xCa27037CeD432fadF54Dee9bC210DfD5ab2F13C8,
            1
        );

        targets[0] = TOKEN;
        calldatas[0] = data;

        uint256 proposalId = dao.execute(
            targets,
            values,
            calldatas,
            keccak256("transfer proposal 1")
        );

        console.log("Proposal ID: %d", proposalId);

        vm.stopBroadcast();
    }
}
