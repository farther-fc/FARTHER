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

    uint256 public constant VOTING_PERIOD = 50_400;

    address internal proposer = makeAddr("proposer");
    address internal whaleVoter1 = makeAddr("whaleVoter1");
    address internal whaleVoter2 = makeAddr("whaleVoter2");

    function setUp() public {
        token = new FartherToken("Farther", "FARTHER", block.timestamp);

        token.transfer(proposer, PROPOSAL_THRESHOLD);

        token.transfer(whaleVoter1, 10_000_000e18);
        token.transfer(whaleVoter2, 10_000_000e18);

        // Self delegate
        vm.prank(proposer);
        token.delegate(proposer);
        vm.prank(whaleVoter1);
        token.delegate(whaleVoter1);
        vm.prank(whaleVoter2);
        token.delegate(whaleVoter2);
    }

    function test_deploySucceeds() external {
        dao = new FartherDAO(token);

        assert(address(dao.token()) == address(token));

        assertEq(dao.votingDelay(), VOTING_DELAY);
        assertEq(dao.votingPeriod(), VOTING_PERIOD);
        assertEq(dao.proposalThreshold(), PROPOSAL_THRESHOLD);
    }

    function test_proposerHasThreshold() external view {
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

        vm.prank(whaleVoter1);
        dao.castVote(proposalId, vote);
        vm.prank(whaleVoter2);
        dao.castVote(proposalId, vote);

        vm.roll(block.number + dao.votingPeriod() + 1);

        assert(dao.state(proposalId) == IGovernor.ProposalState.Succeeded);
    }

    function test_quorum() external {
        dao = new FartherDAO(token);

        vm.roll(block.number + 1);

        assertEq(
            dao.quorum(block.number - 1),
            (token.totalSupply() * dao.quorumNumerator()) / 100
        );
    }

    function test_setVotingDelay() external {
        dao = new FartherDAO(token);

        uint256 newVotingDelay = 100;

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = address(dao);

        calldatas[0] = abi.encodeWithSignature(
            "setVotingDelay(uint256)",
            newVotingDelay
        );

        // Advance the block to ensure the votes are counted correctly
        vm.roll(block.number + 1);

        vm.prank(proposer);
        uint256 proposalId = dao.propose(
            targets,
            values,
            calldatas,
            "sets voting delay to 100"
        );

        uint8 vote = 1;

        vm.roll(block.number + dao.votingDelay() + 1);

        vm.prank(whaleVoter1);
        dao.castVote(proposalId, vote);
        vm.prank(whaleVoter2);
        dao.castVote(proposalId, vote);

        vm.roll(block.number + dao.votingPeriod() + 1);

        assert(dao.state(proposalId) == IGovernor.ProposalState.Succeeded);

        dao.execute(
            targets,
            values,
            calldatas,
            keccak256("sets voting delay to 100")
        );

        assertEq(dao.votingDelay(), newVotingDelay);
    }

    function test_setVotingPeriod() external {
        dao = new FartherDAO(token);

        uint256 newVotingPeriod = 100;

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = address(dao);

        calldatas[0] = abi.encodeWithSignature(
            "setVotingPeriod(uint256)",
            newVotingPeriod
        );

        // Advance the block to ensure the votes are counted correctly
        vm.roll(block.number + 1);

        vm.prank(proposer);
        uint256 proposalId = dao.propose(
            targets,
            values,
            calldatas,
            "sets voting period to 100"
        );

        uint8 vote = 1;

        vm.roll(block.number + dao.votingDelay() + 1);

        vm.prank(whaleVoter1);
        dao.castVote(proposalId, vote);
        vm.prank(whaleVoter2);
        dao.castVote(proposalId, vote);

        vm.roll(block.number + dao.votingPeriod() + 1);

        assert(dao.state(proposalId) == IGovernor.ProposalState.Succeeded);

        dao.execute(
            targets,
            values,
            calldatas,
            keccak256("sets voting period to 100")
        );

        assertEq(dao.votingPeriod(), newVotingPeriod);
    }

    function test_setProposalThreshold() external {
        dao = new FartherDAO(token);

        uint256 newProposalThreshold = 200_000e18;

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = address(dao);

        calldatas[0] = abi.encodeWithSignature(
            "setProposalThreshold(uint256)",
            newProposalThreshold
        );

        // Advance the block to ensure the votes are counted correctly
        vm.roll(block.number + 1);

        vm.prank(proposer);
        uint256 proposalId = dao.propose(
            targets,
            values,
            calldatas,
            "sets proposal threshold to 200_000"
        );

        uint8 vote = 1;

        vm.roll(block.number + dao.votingDelay() + 1);

        vm.prank(whaleVoter1);
        dao.castVote(proposalId, vote);
        vm.prank(whaleVoter2);
        dao.castVote(proposalId, vote);

        vm.roll(block.number + dao.votingPeriod() + 1);

        assert(dao.state(proposalId) == IGovernor.ProposalState.Succeeded);

        dao.execute(
            targets,
            values,
            calldatas,
            keccak256("sets proposal threshold to 200_000")
        );

        assertEq(dao.proposalThreshold(), newProposalThreshold);
    }
}
