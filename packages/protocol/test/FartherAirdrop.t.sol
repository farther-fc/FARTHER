// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {console} from "forge-std/Test.sol";
import {TestConfig} from "./TestConfig.sol";
import {Merkle} from "murky/Merkle.sol";
import {FartherAirdrop} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";

contract FartherAirdropTest is TestConfig {
    event Claimed(
        uint256 indexed index,
        address indexed account,
        uint256 indexed amount
    );

    FartherAirdrop public airdrop;

    uint256 pk = uint256(bytes32(vm.parseBytes(vm.envString("DEPLOYER_PK"))));

    address[] accounts = [
        getFundedAccount(pk),
        getFundedAccount(2),
        getFundedAccount(3)
    ];

    uint256[] amounts = [10970375203, 347027023623, 9283969369236923692639];

    bytes32[] leaves;

    bytes32 public root;

    Merkle public merkle;

    FartherToken public token;

    uint256 public constant DURATION = 365 days;

    function setUp() public {
        token = new FartherToken("Farther", "FARTHER", block.timestamp);
        merkle = new Merkle();

        leaves = new bytes32[](accounts.length);
        for (uint256 i = 0; i < accounts.length; ++i) {
            leaves[i] = keccak256(abi.encodePacked(i, accounts[i], amounts[i]));
        }

        root = merkle.getRoot(leaves);
        airdrop = deployAirdrop();

        // Fund the airdrop
        for (uint256 i = 0; i < accounts.length; ++i) {
            token.transfer(address(airdrop), amounts[i]);
        }
    }

    function test_deploy_succeeds() external view {
        assertEq(airdrop.TOKEN(), address(token));
        assertEq(airdrop.MERKLE_ROOT(), root);
        assertEq(airdrop.END_TIME(), block.timestamp + DURATION);
        assertEq(
            token.balanceOf(address(airdrop)),
            amounts[0] + amounts[1] + amounts[2]
        );
    }

    function test_claim_succeeds() external {
        for (uint256 i = 0; i < accounts.length; ++i) {
            assertEq(token.balanceOf(accounts[i]), 0);

            vm.expectEmit(true, true, true, true);
            emit Claimed(i, accounts[i], amounts[i]);

            airdrop.claim(
                i,
                accounts[i],
                amounts[i],
                merkle.getProof(leaves, i)
            );

            assertEq(token.balanceOf(accounts[i]), amounts[i]);
            assert(airdrop.isClaimed(i));
        }
    }

    function test_alreadyClaimed_fails() external {
        bytes32[] memory proof = merkle.getProof(leaves, 0);

        airdrop.claim(0, accounts[0], amounts[0], proof);

        vm.expectRevert(FartherAirdrop.AlreadyClaimed.selector);

        airdrop.claim(0, accounts[0], amounts[0], proof);
    }

    function test_invalidProof_fails() external {
        bytes32[] memory proof = merkle.getProof(leaves, 1);

        vm.expectRevert(FartherAirdrop.InvalidProof.selector);
        airdrop.claim(0, accounts[0], amounts[0], proof);
    }

    function test_claimWindowHasNotStarted_fails() external {
        bytes32[] memory proof = merkle.getProof(leaves, 0);

        uint256 startTime = block.timestamp + 1;

        FartherAirdrop delayedDrop = new FartherAirdrop(
            address(token),
            root,
            startTime,
            startTime + DURATION
        );

        vm.expectRevert(
            abi.encodeWithSelector(
                FartherAirdrop.ClaimWindowHasNotStarted.selector,
                startTime
            )
        );

        delayedDrop.claim(0, accounts[0], amounts[0], proof);
    }

    function test_claimWindowFinished_fails() external {
        bytes32[] memory proof = merkle.getProof(leaves, 0);

        uint256 endTime = block.timestamp + DURATION;

        vm.warp(endTime + 1);

        vm.expectRevert(
            abi.encodeWithSelector(
                FartherAirdrop.ClaimWindowFinished.selector,
                endTime
            )
        );
        airdrop.claim(0, accounts[0], amounts[0], proof);
    }

    function test_withdraw_succeeds() external {
        // Assert that owner (this contract) has the correct balance after funding the airdrop
        assertEq(
            token.balanceOf(address(this)),
            token.TOKEN_INITIAL_SUPPLY() *
                10 ** token.decimals() -
                amounts[0] -
                amounts[1] -
                amounts[2]
        );

        vm.warp(block.timestamp + DURATION + 1);
        airdrop.withdraw();

        assertEq(token.balanceOf(address(airdrop)), 0);

        // Assert that owner (this contract) is back to the full initial supply
        assertEq(
            token.balanceOf(address(this)),
            token.TOKEN_INITIAL_SUPPLY() * 10 ** token.decimals()
        );
    }

    function test_withdrawBeforeClaim_succeeds() external {
        uint256 startTime = block.timestamp + 10;

        FartherAirdrop futureDrop = new FartherAirdrop(
            address(token),
            root,
            startTime,
            startTime + DURATION
        );

        token.transfer(address(futureDrop), 42069);
        assertEq(token.balanceOf(address(futureDrop)), 42069);

        futureDrop.withdraw();

        assertEq(token.balanceOf(address(futureDrop)), 0);
    }

    function test_withdrawAfterClaim_succeeds() external {
        uint256 startTime = block.timestamp + 10;

        FartherAirdrop futureDrop = new FartherAirdrop(
            address(token),
            root,
            startTime,
            startTime + DURATION
        );

        token.transfer(address(futureDrop), 42069);
        assertEq(token.balanceOf(address(futureDrop)), 42069);

        vm.warp(startTime + DURATION + 1);
        futureDrop.withdraw();

        assertEq(token.balanceOf(address(futureDrop)), 0);
    }

    function test_withdrawDuringClaim_fails() external {
        uint256 startTime = block.timestamp + 10;

        FartherAirdrop futureDrop = new FartherAirdrop(
            address(token),
            root,
            startTime,
            startTime + DURATION
        );

        vm.warp(startTime);

        vm.expectRevert(FartherAirdrop.NoWithdrawDuringClaim.selector);
        futureDrop.withdraw();
    }

    // HELPERS

    function deployAirdrop() public returns (FartherAirdrop airdrop_) {
        return
            new FartherAirdrop(
                address(token),
                root,
                block.timestamp,
                block.timestamp + DURATION
            );
    }
}
