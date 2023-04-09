// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TicketSFT.sol";

/// @title Marketplace for TicketSFT 1155
/// @author Franck Fernandez
/// @notice Buy and sell tickets
/// @dev Buyer can buy a ticket if available
/// @dev Seller can sell a ticket here, he can withdraw its balance once ticket has been sell
contract Marketplace is ReentrancyGuard {
    struct SupplyObject {
        address[] addrs;
        uint256 price;
    }

    // Collection => token id => SupplyObject
    mapping(address => mapping(uint256 => SupplyObject)) public supply;

    // Users balance
    mapping(address => uint256) public balance;

    // Emmited when user deposit a token to sell
    event Deposit(
        address from,
        TicketSFT collection,
        uint256 id,
        uint256 price
    );

    // Emmited when the balance of a user has been claimed
    event WithdrawBalance(address to, uint256 amount);

    // Emmited when a 1155 has been bought
    event Buy(address to, address from, TicketSFT collection, uint256 id);

    // :::::::::::::::::::::: FUNCTIONS ::::::::::::::::::::::
    /// Deposit 1155 token
    /// @param _collection TicketSFT collection searched
    /// @param _from Seller address
    /// @param _id Token id to sell
    function deposit(
        TicketSFT _collection,
        address _from,
        uint256 _id
    ) external {
        supply[address(_collection)][_id].addrs.push(_from);
        supply[address(_collection)][_id].price = _collection.ticketPrices(_id);
        emit Deposit(_from, _collection, _id, _collection.ticketPrices(_id));
    }

    /// Buy 1155 token
    /// @param _collection TicketSFT collection searched
    /// @param _id Token id to buy
    function buy(TicketSFT _collection, uint256 _id) external payable {
        require(
            supply[address(_collection)][_id].addrs.length > 0,
            "Not available"
        );
        require(
            msg.value == supply[address(_collection)][_id].price,
            "Not enough money sended"
        );

        address sellerAddr = supply[address(_collection)][_id].addrs[
            supply[address(_collection)][_id].addrs.length - 1
        ];
        // Transfer 1155 from seller to buyer
        _collection.safeTransferFrom(sellerAddr, msg.sender, _id, 1, "");
        supply[address(_collection)][_id].addrs.pop();
        emit Buy(msg.sender, sellerAddr, _collection, _id);
    }

    /// Withdraw your balance
    function withdrawBalance() external nonReentrant {
        require(balance[msg.sender] > 0, "Nothing to withdraw");

        uint256 tempBalance = balance[msg.sender];
        balance[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: tempBalance}("");
        require(success, "Error on withdraw");
        emit WithdrawBalance(msg.sender, tempBalance);
    }
}
