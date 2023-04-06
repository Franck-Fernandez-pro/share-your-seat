// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Tickts for an event
/// @author Franck Fernandez
/// @notice Mint and handle your tickets about an event
/// @dev This contract is deployed by TicketFactory smart contract
/// @dev You can use this contract to mint, transfer, sell, check data about an event (concert, match, theatre)
contract TicketSFT is ERC1155, Ownable, ReentrancyGuard {
    // Token metadata URI
    string public baseMetadataURI;

    // Token name (Event name)
    string public name;

    // Array of mintable tickets. Index is used as token id
    uint16[] public availableTickets;
    uint256 public availableTicketsLength;

    // Array of ticket prices
    uint256[] public ticketPrices;

    // Emmited when ERC-1155 collection is minted
    event TicketMinted(
        address owner,
        address collectionAddr,
        uint256 amount,
        uint256 id
    );

    // :::::::::::::::::::::: CONSTRUCTOR ::::::::::::::::::::::
    /// @dev Executed when the factory calls its own deployTicket() function
    /// @param _eventName name of SFT collection
    /// @param _uri URI of metadatas
    /// @param _ticketPrices Ticket type prices
    /// @param _availableTickets Ticket type amount
    constructor(
        string memory _eventName,
        string memory _uri,
        uint256[] memory _ticketPrices,
        uint16[] memory _availableTickets
    ) ERC1155(_uri) {
        require(
            _ticketPrices.length == _availableTickets.length,
            "Provided array have not same length"
        );
        require(bytes(_uri).length != 0, "_uri is empty");
        name = _eventName;
        baseMetadataURI = _uri;
        availableTickets = _availableTickets;
        availableTicketsLength = _availableTickets.length;
        ticketPrices = _ticketPrices;
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

    /// Mint token
    /// @param _account address to mint the token to
    /// @param _id ID being minted
    /// @param _amount amount of tokens to mint
    function mint(
        address _account,
        uint256 _id,
        uint16 _amount
    ) external payable {
        require(
            msg.value == ticketPrices[_id] * _amount,
            "Not enough wei sended"
        );
        require(_amount <= availableTickets[_id], "_amount not available");
        availableTickets[_id] -= _amount;
        emit TicketMinted(msg.sender, address(this), _amount, _id);
        _mint(_account, _id, _amount, "");
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
    ) external {
        _mintBatch(_to, _ids, _amounts, _data);
    }

    function withdraw(address _addr) external onlyOwner nonReentrant {
        (bool success, ) = payable(_addr).call{value: address(this).balance}(
            ""
        );
        require(success, "Error on withdraw");
    }

    function collectionBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
