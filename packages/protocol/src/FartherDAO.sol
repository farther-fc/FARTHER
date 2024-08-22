// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console} from "forge-std/Test.sol";

import {IGovernor, Governor} from "openzeppelin/governance/Governor.sol";
import {GovernorCountingSimple} from "openzeppelin/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "openzeppelin/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "openzeppelin/governance/extensions/GovernorVotesQuorumFraction.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";
import {IERC165} from "openzeppelin/interfaces/IERC165.sol";
// import {FartherToken} from "./FartherToken.sol";

contract FartherDAO is
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    constructor(
        IVotes _token
    )
        Governor("FartherDAO")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(2)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 7200; // 1 day
    }

    function votingPeriod() public pure override returns (uint256) {
        return 2592000; // 1 month
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 100_000e18;
    }

    // The functions below are overrides required by Solidity.

    function state(
        uint256 proposalId
    ) public view override(Governor) returns (ProposalState) {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    ) public view virtual override(Governor) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor) returns (uint48) {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor) returns (address) {
        return super._executor();
    }
}
