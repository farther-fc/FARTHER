// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {console} from "forge-std/Test.sol";
import {TestConfig} from "./TestConfig.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {FartherDAO} from "../src/FartherDAO.sol";
import {IGovernor} from "openzeppelin/governance/Governor.sol";

contract FartherDAOTest is TestConfig {
    FartherDAO dao;
    FartherToken token;

    uint256 public constant PROPOSAL_THRESHOLD = 100_000e18;

    uint256 public constant VOTING_DELAY = 7200;

    uint256 public constant VOTING_PERIOD = 2592000;

    address internal constant BURN_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    address internal proposer = makeAddr("proposer");

    function setUp() public {
        token = new FartherToken("Farther", "FARTHER", block.timestamp);

        token.transfer(proposer, PROPOSAL_THRESHOLD);

        token.transfer(BURN_ADDRESS, 5_000_000e18);

        // Self delegate
        vm.prank(proposer);
        token.delegate(proposer);
    }

    function test_deploy_succeeds() external {
        dao = new FartherDAO(token);

        assert(address(dao.token()) == address(token));

        assertEq(dao.votingDelay(), VOTING_DELAY);
        assertEq(dao.votingPeriod(), VOTING_PERIOD);
        assertEq(dao.proposalThreshold(), PROPOSAL_THRESHOLD);
    }

    function test_proposer_has_threshold() external view {
        assertEq(token.balanceOf(proposer), PROPOSAL_THRESHOLD);
        assertEq(token.getVotes(proposer), PROPOSAL_THRESHOLD);
    }

    function test_proposal() external {
        dao = new FartherDAO(token);

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        // Advance the block to ensure the votes are counted correctly
        vm.roll(block.number + 1);

        vm.prank(proposer);
        uint256 proposalId = dao.propose(targets, values, calldatas, "test");

        // Ensure proposal exists
        assert(dao.proposalSnapshot(proposalId) > VOTING_DELAY);
        assertEq(dao.proposalProposer(proposalId), proposer);
    }

    function test_castVote() external {
        dao = new FartherDAO(token);

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        // Advance the block to ensure the votes are counted correctly
        vm.roll(block.number + 1);

        vm.prank(proposer);
        uint256 proposalId = dao.propose(targets, values, calldatas, "test");

        uint8 vote = 1;

        vm.roll(block.number + dao.votingDelay() + 1);

        dao.castVote(proposalId, vote);
    }

    function test_proposalPasses() external {
        dao = new FartherDAO(token);

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        // Advance the block to ensure the votes are counted correctly
        vm.roll(block.number + 1);

        vm.prank(proposer);
        uint256 proposalId = dao.propose(targets, values, calldatas, "test");

        uint8 vote = 1;

        vm.roll(block.number + dao.votingDelay() + 1);

        dao.castVote(proposalId, vote);

        vm.roll(block.number + dao.votingPeriod() + 1);

        assert(dao.state(proposalId) == IGovernor.ProposalState.Succeeded);
    }

    function test_quorum() external {
        dao = new FartherDAO(token);

        vm.roll(block.number + 1);

        console.log("blocknum to check", block.number - 1);

        assertEq(
            dao.quorum(block.number - 1),
            (token.totalSupply() * dao.quorumNumerator()) / 100
        );
    }
}
