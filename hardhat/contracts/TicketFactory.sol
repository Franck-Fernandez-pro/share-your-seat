// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./TicketSFT.sol";

/// @title Tickts factory
/// @author Franck Fernandez
/// @notice Deploy ERC-1155 contracts
/// @dev This contract used to create new Ticket collection
contract TicketFactory {
    // Array that contains different ERC-1155 tokens deployed
    TicketSFT[] public tokens;

    // Index to contract address mapping
    mapping(uint256 collectionIndex => address contractAddress)
        public indexToContract;

    // Index to ERC-1155 owner address
    mapping(uint256 collectionIndex => address ownerAddress)
        public indexToOwner;

    // Emitted when ERC-1155 token is deployed
    event TicketCreated(address owner, address tokenContract);

    /// Deploys a ERC-1155 token with given parameters - returns deployed address
    /// @param _eventName Name of ERC-1155 collection
    /// @param _uri URI resolving hosted metadata
    /// @param _ticketPrices Price array of ticket types
    /// @param _ticketAmounts Price array of ticket types
    function deployTicket(
        string memory _eventName,
        string memory _uri,
        uint16[] memory _ticketPrices,
        uint16[] memory _ticketAmounts
    ) public returns (address) {
        TicketSFT t = new TicketSFT(
            _eventName,
            _uri,
            _ticketPrices,
            _ticketAmounts
        );
        tokens.push(t);
        indexToContract[tokens.length - 1] = address(t);
        indexToOwner[tokens.length - 1] = tx.origin;
        emit TicketCreated(msg.sender, address(t));

        return address(t);
    }
}
