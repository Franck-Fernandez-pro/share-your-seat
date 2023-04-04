// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./TicketSFT.sol";

/// @title Tickts factory
/// @author Franck Fernandez
/// @notice Deploy ERC-1155 contracts
/// @dev This contract used to create new Ticket collection
contract TicketFactory {
    // Array that contains different ERC-1155 deployed
    TicketSFT[] public sftCollections;

    // Index to contract address mapping
    mapping(uint256 collectionIndex => address contractAddress)
        public indexToContract;

    // Index to ERC-1155 owner address
    mapping(uint256 collectionIndex => address ownerAddress)
        public indexToOwner;

    // Emitted when ERC-1155 collection is deployed
    event TicketCreated(address owner, address collectionAddress, string name);

    // Emmited when ERC-1155 collection is minted
    event TicketMinted(
        address owner,
        address tokenContract,
        string name,
        uint256 amount
    );

    /// Deploys a ERC-1155 token with given parameters - returns deployed address
    /// @param _eventName Name of ERC-1155 collection
    /// @param _uri URI resolving hosted metadata
    /// @param _ticketPrices Price array of ticket types
    /// @param _availableTickets Price array of ticket types
    function deployTicket(
        string memory _eventName,
        string memory _uri,
        uint16[] memory _ticketPrices,
        uint16[] memory _availableTickets
    ) public returns (address) {
        require(bytes(_eventName).length != 0, "_eventName is empty");
        require(bytes(_uri).length != 0, "_uri is empty");
        require(
            _availableTickets.length > 0 && _ticketPrices.length > 0,
            "You should have at least one ticket"
        );
        require(
            _ticketPrices.length == _availableTickets.length,
            "Provided array have not same length"
        );

        TicketSFT t = new TicketSFT(
            _eventName,
            _uri,
            _ticketPrices,
            _availableTickets
        );
        sftCollections.push(t);
        indexToContract[sftCollections.length - 1] = address(t);
        indexToOwner[sftCollections.length - 1] = tx.origin;

        emit TicketCreated(msg.sender, address(t), t.name());

        return address(t);
    }

    /// Mint ERC-1155 token with given parameters
    /// @param _index Index position in sftCollections array. Represents which ERC-1155 you want to interact with
    /// @param _id Id being minted
    /// @param _amount Amount of sftCollections you wish to mint
    function mintTicket(uint _index, uint256 _id, uint256 _amount) public {
        sftCollections[_index].mint(msg.sender, _id, _amount);
        emit TicketMinted(
            msg.sender,
            address(sftCollections[_index]),
            sftCollections[_index].name(),
            _amount
        );
    }
}
