// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Nonces} from "openzeppelin/utils/Nonces.sol";
import {ERC20} from "openzeppelin/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "openzeppelin/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "openzeppelin/token/ERC20/extensions/ERC20Pausable.sol";
import {Ownable} from "openzeppelin/access/Ownable.sol";
import {ERC20Permit} from "openzeppelin/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "openzeppelin/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @notice The Farther token
 */
contract FartherToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    ERC20Permit,
    ERC20Votes,
    Ownable
{
    /**
     * @dev EIP-20 token name for this token
     */
    string public constant TOKEN_NAME = "Farther";

    /**
     * @dev EIP-20 token symbol for this token
     */
    string public constant TOKEN_SYMBOL = "FARTHER";

    /**
     * @dev Total number of tokens in circulation
     */
    uint256 public constant TOKEN_INITIAL_SUPPLY = 1_000_000_000;

    /**
     * @dev Minimum time between mints
     */
    uint32 public constant MINIMUM_TIME_BETWEEN_MINTS = 1 days * 365;

    /**
     * @dev Cap on the percentage of totalSupply that can be minted at each mint
     */
    uint8 public constant MINT_CAP = 2;

    /**
     * @dev The timestamp after which minting may occur
     */
    uint256 public mintingAllowedAfter;

    /**
     * @dev The minting date has not been reached yet
     */
    error MintingDateNotReached();

    /**
     * @dev Cannot mint to the zero address
     */
    error MintToZeroAddressBlocked();

    /**
     * @dev Minting date must be set to occur after deployment
     */
    error MintAllowedAfterDeployOnly(
        uint256 blockTimestamp,
        uint256 mintingAllowedAfter
    );

    /**
     * @dev Attempted to mint more than the cap allows
     */
    error MintCapExceeded();

    /**
     * @dev Construct a new token
     * @param mintingAllowedAfter_ The timestamp after which minting may occur
     */
    constructor(
        uint256 mintingAllowedAfter_
    )
        ERC20(TOKEN_NAME, TOKEN_SYMBOL)
        ERC20Permit(TOKEN_NAME)
        Ownable(msg.sender)
    {
        if (mintingAllowedAfter_ < block.timestamp) {
            revert MintAllowedAfterDeployOnly(
                block.timestamp,
                mintingAllowedAfter_
            );
        }

        _mint(msg.sender, TOKEN_INITIAL_SUPPLY * 10 ** decimals());

        mintingAllowedAfter = mintingAllowedAfter_;
    }

    /**
     * @dev Mint new tokens
     * @param to The address of the target account
     * @param amount The number of tokens to be minted
     */
    function mint(address to, uint96 amount) external onlyOwner {
        if (block.timestamp < mintingAllowedAfter) {
            revert MintingDateNotReached();
        }

        if (to == address(0)) {
            revert MintToZeroAddressBlocked();
        }

        // record the mint
        mintingAllowedAfter = block.timestamp + MINIMUM_TIME_BETWEEN_MINTS;

        // mint the amount
        if (amount > (totalSupply() * MINT_CAP) / 100) {
            revert MintCapExceeded();
        }

        _mint(to, amount);
    }

    /**
     * @dev Pause all token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause all token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
