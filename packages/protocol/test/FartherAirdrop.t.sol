// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {console} from "forge-std/Test.sol";
import {TestConfig} from "./TestConfig.sol";
import {Merkle} from "murky/Merkle.sol";
import {FartherAirdrop1} from "../src/FartherAirdrop.sol";
import {FartherToken} from "../src/FartherToken.sol";

contract FartherAirdropTest is TestConfig {
    event Claimed(
        uint256 indexed index,
        address indexed account,
        uint256 indexed amount
    );

    FartherAirdrop1 public airdrop;

    address[] accounts = [
        getFundedAccount(1),
        getFundedAccount(2),
        getFundedAccount(3)
    ];

    uint256[] amounts = [10970375203, 347027023623, 9283969369236923692639];

    bytes32[] leaves;

    bytes32 public root;

    Merkle public merkle;

    FartherToken public token;

    function setUp() public {
        token = new FartherToken(block.timestamp);
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
        assertEq(airdrop.END_TIME(), block.timestamp + 365 days);
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

    // HELPERS

    function deployAirdrop() public returns (FartherAirdrop1 airdrop_) {
        return
            new FartherAirdrop1(
                address(token),
                root,
                block.timestamp + 365 days
            );
    }
}
