// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FartherToken} from "../src/FartherToken.sol";
import {FartherVesting} from "../src/FartherVesting.sol";

contract FartherVesting_Test is Test {
    FartherToken fartherToken;
    address beneficiary;

    uint8 constant CLIFF = 25;

    function setUp() public {
        beneficiary = makeAddr("Beneficiary");
        fartherToken = new FartherToken(
            "Farther",
            "FARTHER",
            block.timestamp + 100
        );
    }

    function test_constructor_succeeds() external {
        FartherVesting fartherVesting = new FartherVesting(
            beneficiary,
            uint64(block.timestamp),
            100
        );

        assertEq(fartherVesting.owner(), beneficiary);
        assertEq(fartherVesting.start(), uint64(block.timestamp));
        assertEq(fartherVesting.duration(), 100);
        assertEq(fartherVesting.end(), uint64(block.timestamp) + 100);
        assertEq(fartherVesting.CLIFF_PERCENTAGE(), 25);
    }

    function test_cliff() external {
        uint256 testStart = block.timestamp;
        uint256 treasuryAmount = 10 ether;
        uint256 cliffAmount = (treasuryAmount * CLIFF) / 100;
        uint256 cliffDuration = 1000;
        uint64 start = uint64(block.timestamp + cliffDuration);
        uint64 duration = 100;

        FartherVesting fartherVesting = new FartherVesting(
            beneficiary,
            start,
            duration
        );

        // Send some tokens to the vesting contract
        fartherToken.transfer(address(fartherVesting), treasuryAmount);

        assertEq(fartherVesting.releasable(address(fartherToken)), 0);
        assertEq(
            fartherToken.balanceOf(address(fartherVesting)),
            treasuryAmount
        );

        // Try to withdraw before the cliff
        vm.warp(testStart + cliffDuration - 1);
        fartherVesting.release(address(fartherToken));

        assertEq(fartherVesting.releasable(address(fartherToken)), 0);
        assertEq(fartherVesting.released(address(fartherToken)), 0);
        assertEq(fartherToken.balanceOf(beneficiary), 0);

        // Try to withdraw after the cliff
        vm.warp(testStart + cliffDuration);
        fartherVesting.release(address(fartherToken));

        assertEq(fartherVesting.released(address(fartherToken)), cliffAmount);
        assertEq(fartherToken.balanceOf(beneficiary), cliffAmount);
    }

    // function test_postCliff(
    //     uint256 treasuryAmount,
    //     uint256 cliffDuration,
    //     uint64 duration
    // ) external {
    //     vm.assume(treasuryAmount > 100);
    //     vm.assume(cliffDuration > 0);
    //     vm.assume(duration > 10);

    //     uint256 testStart = block.timestamp;
    //     uint256 cliffAmount = (treasuryAmount * CLIFF) / 100;
    //     uint64 start = uint64(block.timestamp + cliffDuration);

    //     FartherVesting fartherVesting = new FartherVesting(
    //         beneficiary,
    //         start,
    //         duration
    //     );

    //     // Send some tokens to the vesting contract
    //     fartherToken.transfer(address(fartherVesting), treasuryAmount);

    //     assertEq(fartherVesting.releasable(address(fartherToken)), 0);
    //     assertEq(
    //         fartherToken.balanceOf(address(fartherVesting)),
    //         treasuryAmount
    //     );

    //     // Warp until after the cliff but before the end of the vesting schedule
    //     vm.warp(testStart + cliffDuration + duration / 2);
    //     fartherVesting.release(address(fartherToken));

    //     assertLt(
    //         fartherVesting.releasable(address(fartherToken)),
    //         treasuryAmount - cliffAmount
    //     );
    //     assertGt(fartherVesting.released(address(fartherToken)), cliffAmount);
    //     assertGt(fartherToken.balanceOf(beneficiary), cliffAmount);

    //     // Warp past the end of the vesting schedule
    //     vm.warp(testStart + cliffDuration + duration);

    //     // Release remaining funds
    //     fartherVesting.release(address(fartherToken));

    //     // Assert all has been released
    //     assertEq(fartherVesting.releasable(address(fartherToken)), 0);
    //     assertEq(
    //         fartherVesting.released(address(fartherToken)),
    //         treasuryAmount
    //     );
    //     assertEq(fartherToken.balanceOf(beneficiary), treasuryAmount);
    // }
}
