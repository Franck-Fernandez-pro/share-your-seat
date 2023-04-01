// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

/// @title Tickts for an event
/// @author Franck Fernandez
/// @notice Mint and handle your tickets about an event
/// @dev This contract is deployed by TicketFactory smart contract
/// @dev You can use this contract to mint, transfer, sell, check data about an event (concert, match, theatre)
contract TicketSFT is ERC1155, Ownable {
    struct Ticket {
        string name;
        uint8 ticketType;
        uint16 amount;
    }
    string public baseMetadataURI; // Token metadata URI as https://ipfs.io/HASH/
    string public name; // Token name (Event name)
    Ticket[20] public tickets; // Array of tickets. Ticket id is the index in tickets array

    // :::::::::::::::::::::: CONSTRUCTOR ::::::::::::::::::::::
    /// @dev Executed when the factory calls its own deployTicket() function
    /// @param _eventName name of SFT collection
    /// @param _uri URI of metadatas
    /// Ticket types available for this collection
    /// @param _ticketPrices Ticket type prices
    /// @param _ticketamount Ticket type amount
    constructor(
        string memory _eventName,
        string memory _uri,
        // string[] memory _ticketTypes,
        uint256[] memory _ticketPrices,
        uint256[] memory _ticketamount
    ) ERC1155(_uri) {
        require(
            _ticketPrices.length == _ticketamount.length,
            "Provided array have not same length"
        );
        require(bytes(_uri).length != 0, "_uri is empty");
        setURI(_uri);
        baseMetadataURI = _uri;
        name = _eventName;
        transferOwnership(tx.origin);
    }

    // :::::::::::::::::::::: FUNCTIONS ::::::::::::::::::::::
    /// Set uri
    /// @param _tokenId id used to build complete uri
    /// @return metadata url
    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    baseMetadataURI,
                    Strings.toString(_tokenId),
                    ".json"
                )
            );
    }

    /// Used to change metadata, only owner access
    /// @param _newuri new uri
    function setURI(string memory _newuri) public onlyOwner {
        _setURI(_newuri);
    }

    /// Mint token
    /// @param _account address to mint the token to
    /// @param _id ID being minted
    /// @param _amount amount of tokens to mint
    function mint(
        address _account,
        uint _id,
        uint256 _amount
    ) public payable returns (uint) {
        _mint(_account, _id, _amount, "");
        return _id;
    }

    /// Mint batch tokens
    /// @param _to address to mint the token to
    /// @param _ids the IDs being minted
    /// @param _amounts amount of tokens to mint given ID
    /// @param _data additional field to pass data to function
    function mintBatch(
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        bytes memory _data
    ) public {
        _mintBatch(_to, _ids, _amounts, _data);
    }
}
