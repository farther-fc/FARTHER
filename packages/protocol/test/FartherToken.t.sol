// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {Ownable} from "openzeppelin/access/Ownable.sol";

contract FartherToken_Test is Test {
    FartherToken fartherToken =
        new FartherToken("Farther", "FARTHER", block.timestamp);
    address owner;
    address rando;
    uint256 initialSupply;

    /// @dev Sets up the test suite.
    function setUp() public {
        initialSupply =
            fartherToken.TOKEN_INITIAL_SUPPLY() *
            10 ** fartherToken.decimals();

        owner = fartherToken.owner();
        rando = makeAddr("rando");
    }

    /// @dev Tests that the constructor sets the correct initial state.
    function test_constructor_succeeds() external view {
        assertEq(fartherToken.owner(), owner);
        assertEq(fartherToken.name(), "Farther");
        assertEq(fartherToken.symbol(), "FARTHER");
        assertEq(fartherToken.decimals(), 18);
        assertEq(fartherToken.totalSupply(), initialSupply);
    }

    /// @dev Tests that the owner can successfully call `mint`.
    function test_mint_fromOwner_succeeds() external {
        // Mint 100 tokens.
        vm.prank(owner);
        fartherToken.mint(owner, 100);

        // Balances have updated correctly.
        assertEq(fartherToken.balanceOf(owner), initialSupply + 100);
        assertEq(fartherToken.totalSupply(), initialSupply + 100);
    }

    /// @dev Tests that `mint` reverts when called by a non-owner.
    function test_mint_fromNotOwner_reverts() external {
        // Mint 100 tokens as rando.
        vm.prank(rando);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                rando
            )
        );

        fartherToken.mint(owner, 100);

        // Balance does not update.
        assertEq(fartherToken.balanceOf(owner), initialSupply);
        assertEq(fartherToken.totalSupply(), initialSupply);
    }

    /// @dev Tests that the owner can successfully call `burn`.
    function test_burn_succeeds() external {
        // Mint 100 tokens to rando.
        vm.prank(owner);
        fartherToken.mint(rando, 100);

        // Rando burns their tokens.
        vm.prank(rando);
        fartherToken.burn(50);

        // Balances have updated correctly.
        assertEq(fartherToken.balanceOf(rando), 50);
        assertEq(fartherToken.totalSupply(), initialSupply + 50);
    }

    /// @dev Tests that the owner can successfully call `burnFrom`.
    function test_burnFrom_succeeds() external {
        // Mint 100 tokens to rando.
        vm.prank(owner);
        fartherToken.mint(rando, 100);

        // Rando approves owner to burn 50 tokens.
        vm.prank(rando);
        fartherToken.approve(owner, 50);

        // Owner burns 50 tokens from rando.
        vm.prank(owner);
        fartherToken.burnFrom(rando, 50);

        // Balances have updated correctly.
        assertEq(fartherToken.balanceOf(rando), 50);
        assertEq(fartherToken.totalSupply(), initialSupply + 50);
    }

    /// @dev Tests that `transfer` correctly transfers tokens.
    function test_transfer_succeeds() external {
        // Mint 100 tokens to rando.
        vm.prank(owner);
        fartherToken.mint(rando, 100);

        // Rando transfers 50 tokens to owner.
        vm.prank(rando);
        fartherToken.transfer(owner, 50);

        // Balances have updated correctly.
        assertEq(fartherToken.balanceOf(rando), 50);
        assertEq(fartherToken.balanceOf(owner), initialSupply + 50);
        assertEq(fartherToken.totalSupply(), initialSupply + 100);
    }

    /// @dev Tests that `approve` correctly sets allowances.
    function test_approve_succeeds() external {
        // Mint 100 tokens to rando.
        vm.prank(owner);
        fartherToken.mint(rando, 100);

        // Rando approves owner to spend 50 tokens.
        vm.prank(rando);
        fartherToken.approve(owner, 50);

        // Allowances have updated.
        assertEq(fartherToken.allowance(rando, owner), 50);
    }

    /// @dev Tests that `transferFrom` correctly transfers tokens.
    function test_transferFrom_succeeds() external {
        // Mint 100 tokens to rando.
        vm.prank(owner);
        fartherToken.mint(rando, 100);

        // Rando approves owner to spend 50 tokens.
        vm.prank(rando);
        fartherToken.approve(owner, 50);

        // Owner transfers 50 tokens from rando to owner.
        vm.prank(owner);
        fartherToken.transferFrom(rando, owner, 50);

        // Balances have updated correctly.
        assertEq(fartherToken.balanceOf(rando), 50);
        assertEq(fartherToken.balanceOf(owner), initialSupply + 50);
        assertEq(fartherToken.totalSupply(), initialSupply + 100);
    }

    /// @dev Tests that owner can renounce ownership
    function test_renounceOwnership_succeeds() external {
        // Owner renounces ownership.
        vm.prank(owner);
        fartherToken.renounceOwnership();

        // Owner is now the zero address.
        assertEq(fartherToken.owner(), address(0));
    }
}
