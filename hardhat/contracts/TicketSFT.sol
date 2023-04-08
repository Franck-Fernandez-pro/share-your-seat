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
    uint256[] public availableTickets;
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

    // Emmited when ERC-1155 collection is mintBatch
    event TicketMintedBatch(
        address owner,
        address collectionAddr,
        uint256[] ids,
        uint256[] amounts
    );

    // Emmited when the balance of the contract has been claimed
    event Withdraw(address to, uint256 amount);

    // Emmited when receive() is trigger
    event Deposit(address _addr, uint256 _amount);

    // Emmited when fallback() is trigger
    event FallbackEvent(address _addr);

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
        uint256[] memory _availableTickets
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
        transferOwnership(msg.sender);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    fallback() external payable {
        emit FallbackEvent(msg.sender);
    }

    // :::::::::::::::::::::: FUNCTIONS ::::::::::::::::::::::
    /// Mint token
    /// @param _account address to mint the token to
    /// @param _id ID being minted
    /// @param _amount amount of tokens to mint
    function mint(
        address _account,
        uint256 _id,
        uint256 _amount
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
    ) external payable {
        require(
            _ids.length <= _amounts.length,
            "_ids and _amounts have not same length"
        );

        uint256 totalPrice = 0;
        for (uint256 idx = 0; idx < _ids.length; idx++) {
            require(
                _amounts[idx] <= availableTickets[_ids[idx]],
                "_amount not available"
            );
            totalPrice += ticketPrices[_ids[idx]] * _amounts[idx];
            availableTickets[idx] -= _amounts[idx];
        }

        require(msg.value == totalPrice, "Not enough wei sended");
        emit TicketMintedBatch(msg.sender, address(this), _amounts, _ids);

        _mintBatch(_to, _ids, _amounts, _data);
    }

    function withdraw(address _addr) external onlyOwner nonReentrant {
        emit Withdraw(_addr, address(this).balance);
        (bool success, ) = payable(_addr).call{value: address(this).balance}(
            ""
        );
        require(success, "Error on withdraw");
    }

    function collectionBalance() external view returns (uint256) {
        return address(this).balance;
    }

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
}
