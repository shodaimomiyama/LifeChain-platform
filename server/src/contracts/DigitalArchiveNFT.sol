// src/contracts/DigitalArchiveNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {ERC721} from "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DigitalArchiveNFT is ERC721 {
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("DigitalArchiveNFT", "DANFT") {}

    function mint(address to, uint256 tokenId, string memory tokenURI) public {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function _setTokenURI(
        uint256 tokenId,
        string memory tokenURI
    ) internal virtual {
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }
}
