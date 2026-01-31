// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CodaToken is ERC20, Ownable {
    
    // The constructor sets the name and symbol
    // It also passes the deployer's address to the Ownable helper
    constructor() ERC20("CODA Coin", "CODA") Ownable(msg.sender) {
        // Optional: Mint some initial coins to the admin
        _mint(msg.sender, 1000 * 10**decimals());
    }

    // This function allows the Backend/Admin to reward users
    // Only the owner (you) can call this
    function mintReward(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}