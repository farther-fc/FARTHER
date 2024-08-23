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
        address SAFE_ADDRESS = 0xf627A7E313B6c2Dd4CcA73ae65AEa9f48592eef2;

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

        bytes memory executeTransaction = abi.encodeWithSignature(
            "execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)",
            TOKEN, // Destination contract (the ERC-20 token contract)
            0, // Value in Ether to send (0 for token transfer)
            data, // Encoded function call (transfer)
            0, // Operation type (0 for CALL)
            0, // SafeTxGas (0 for auto gas estimation)
            0, // BaseGas (0 for no base gas)
            0, // GasPrice (0 if not paying gas from Safe)
            address(0), // GasToken (0 if paying gas in Ether)
            address(0), // RefundReceiver (address to receive gas refund)
            bytes("") // Signatures (empty since the DAO will sign)
        );

        targets[0] = SAFE_ADDRESS;
        calldatas[0] = executeTransaction;

        // uint256 proposalId = dao.propose(
        //     targets,
        //     values,
        //     calldatas,
        //     "transfer proposal 1"
        // );

        uint256 proposalId = dao.execute(
            targets,
            values,
            calldatas,
            keccak256("transfer proposal 1")
        );

        console.log("Proposal ID: %d", proposalId);

        console.log("state", uint256(dao.state(proposalId)));

        vm.stopBroadcast();
    }
}
