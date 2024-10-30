// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {

    }

    function to_ERC20(uint256 amount) external payable {
        _transfer(msg.sender, address(this), amount);
        _mint(msg.sender, 100 * amount);
    }

}
