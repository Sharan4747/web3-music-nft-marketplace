// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT1155 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC1155("") {}

    struct MarketItem {
        uint256 tokenId;
        address payable creator;
        uint256 price;
        uint256 amount;
        string tokenUri;
        bool isActive; // ✅ NEW
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(address => mapping(uint256 => bool)) private userHasItem;
    mapping(uint256 => string) internal _tokenURIs;

    event MarketItemCreated(
        uint256 tokenId,
        address payable creator,
        uint256 price,
        uint256 amount
    );

    event MarketItemRemoved(uint256 tokenId); // ✅ NEW

    function mintToken(
        string memory tokenURI,
        uint256 amount,
        uint256 price
    ) public {
        require(price > 0, "Price must be at least 1 wei");

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, amount, "");
        _tokenURIs[newItemId] = tokenURI;

        idToMarketItem[newItemId] = MarketItem(
            newItemId,
            payable(msg.sender),
            price,
            amount,
            tokenURI,
            true // ✅ active
        );

        _tokenIds.increment();

        emit MarketItemCreated(newItemId, payable(msg.sender), price, amount);
    }

    function createMarketSale(uint256 tokenId) public payable {
        MarketItem storage item = idToMarketItem[tokenId];

        require(item.isActive, "Item not active");
        require(item.amount > 0, "Sold out");
        require(msg.value >= item.price, "Insufficient payment");
        require(!userHasItem[msg.sender][tokenId], "Already owned");

        userHasItem[msg.sender][tokenId] = true;
        item.amount -= 1;

        _safeTransferFrom(item.creator, msg.sender, tokenId, 1, "");
        (bool sent,) = item.creator.call{value: msg.value}("");
        require(sent, "Payment failed");
    }

    // ✅ DELETE / DELIST FUNCTION
    function removeFromMarket(uint256 tokenId) public {
        MarketItem storage item = idToMarketItem[tokenId];
        require(msg.sender == item.creator, "Only creator can delete");
        require(item.isActive, "Already removed");

        item.isActive = false;
        emit MarketItemRemoved(tokenId);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (idToMarketItem[i].isActive) {
                count++;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            if (idToMarketItem[i].isActive) {
                items[index] = idToMarketItem[i];
                index++;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (userHasItem[msg.sender][i]) {
                count++;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            if (userHasItem[msg.sender][i]) {
                items[index] = idToMarketItem[i];
                index++;
            }
        }
        return items;
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (
                idToMarketItem[i].creator == msg.sender &&
                idToMarketItem[i].isActive
            ) {
                count++;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            if (
                idToMarketItem[i].creator == msg.sender &&
                idToMarketItem[i].isActive
            ) {
                items[index] = idToMarketItem[i];
                index++;
            }
        }
        return items;
    }
}
