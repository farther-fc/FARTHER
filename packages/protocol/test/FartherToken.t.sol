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

    function test_mintToZeroAddress_reverts() external {
        // Mint 100 tokens to the zero address.
        vm.expectRevert(
            abi.encodeWithSelector(
                FartherToken.MintToZeroAddressBlocked.selector
            )
        );
        fartherToken.mint(address(0), 100);

        // Balance does not update.
        assertEq(fartherToken.balanceOf(address(0)), 0);
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

    function test_mintWhenMintCapExceeded_reverts() external {
        address recipient = address(42069);

        uint256 allowedInflation = ((fartherToken.totalSupply() * fartherToken.MINT_CAP()) / 100);

        // Mint up to the cap - should succeed
        fartherToken.mint(recipient, allowedInflation);

        assertEq(fartherToken.balanceOf(recipient), allowedInflation);
        assertEq(fartherToken.totalSupply(), initialSupply + allowedInflation);


        uint256 unallowedInflation = ((fartherToken.totalSupply() * fartherToken.MINT_CAP()) / 100) + 1;

        vm.warp(block.timestamp + fartherToken.MINIMUM_TIME_BETWEEN_MINTS());

        vm.expectRevert(
            abi.encodeWithSelector(
                FartherToken.MintCapExceeded.selector
            )
        );
        fartherToken.mint(recipient, unallowedInflation);

        // Balances have not updated.
        assertEq(fartherToken.balanceOf(recipient), allowedInflation);
        assertEq(fartherToken.totalSupply(), initialSupply + allowedInflation);
    }

    /// @dev Tests that no more minting can occur after `voidInflation` is called.
    function test_voidInflation_succeeds() external {
        // Mint 100 tokens.
        fartherToken.mint(owner, 100);

        fartherToken.voidInflation();

        // Warp 100 years into the future
        vm.warp(block.timestamp + fartherToken.MINIMUM_TIME_BETWEEN_MINTS() * 100);

        // Minting is no longer allowed even if the minting date has passed.
        vm.expectRevert(
            abi.encodeWithSelector(
                FartherToken.MintingDateNotReached.selector
            )
        );

        // Minting is no longer allowed.
        fartherToken.mint(owner, 1);

        // Balances have not updated.
        assertEq(fartherToken.balanceOf(owner), initialSupply + 100);
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

    function test_getVotes() external {
        address account = address(42069);
        uint256 tokens = 370730799;

        fartherToken.mint(account, tokens);

        // Self delegate
        vm.prank(account);
        fartherToken.delegate(account);

        assertEq(fartherToken.balanceOf(account), tokens);
        assertEq(fartherToken.getVotes(account), tokens);
    }

    function test_getPastVotes() external {
        address account = address(42069);
        uint256 tokens = 370730799;
        uint256 blockNum = block.number;

        fartherToken.transfer(account, tokens);

        // Self delegate
        vm.prank(account);
        fartherToken.delegate(account);

        // Warp 100 blocks into the future
        vm.roll(blockNum + 100);

        // Check that past votes are accurate
        assertEq(fartherToken.getPastVotes(account, blockNum), tokens);
    }

    function test_delegate() external {
        address account1 = address(42069);
        address account2 = address(42070);
        uint256 tokens = 370730799;

        fartherToken.mint(account1, tokens);

        vm.prank(account1);
        fartherToken.delegate(account2);

        assertEq(fartherToken.getVotes(account2), tokens);
        assertEq(fartherToken.delegates(account1), account2);
    }
}
