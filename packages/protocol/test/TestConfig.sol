// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

contract TestConfig is Test {
    /**
     * @dev Returns an address funded with ETH
     * @param num Number used to generate the address (more convenient than passing address(num))
     */
    function getFundedAccount(uint256 num) public returns (address) {
        address addr = vm.addr(num);
        // Fund with some ETH
        vm.deal(addr, 1e19);

        return addr;
    }
}
