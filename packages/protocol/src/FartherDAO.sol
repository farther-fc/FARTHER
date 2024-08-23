// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IGovernor, Governor} from "openzeppelin/governance/Governor.sol";
import {GovernorCountingSimple} from "openzeppelin/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "openzeppelin/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "openzeppelin/governance/extensions/GovernorVotesQuorumFraction.sol";
import {IVotes} from "openzeppelin/governance/utils/IVotes.sol";
import {IERC165} from "openzeppelin/interfaces/IERC165.sol";

contract FartherDAO is
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    uint256 private _votingDelay;

    uint256 private _votingPeriod;

    uint256 private _proposalThreshold;

    constructor(
        IVotes _token,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold
    )
        Governor("FartherDAO")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(2)
    {
        _votingDelay = votingDelay;
        _votingPeriod = votingPeriod;
        _proposalThreshold = proposalThreshold;
    }

    function votingDelay() public view override returns (uint256) {
        return _votingDelay;
    }

    function votingPeriod() public view override returns (uint256) {
        return _votingPeriod;
    }

    function proposalThreshold() public view override returns (uint256) {
        return _proposalThreshold;
    }

    function state(
        uint256 proposalId
    ) public view override(Governor) returns (ProposalState) {
        return super.state(proposalId);
    }

    function setVotingDelay(uint256 newVotingDelay) public onlyGovernance {
        _votingDelay = newVotingDelay;
    }

    function setVotingPeriod(uint256 newVotingPeriod) public onlyGovernance {
        _votingPeriod = newVotingPeriod;
    }

    function setProposalThreshold(
        uint256 newProposalThreshold
    ) public onlyGovernance {
        _proposalThreshold = newProposalThreshold;
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
