// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Estrutura para metadados do NFT
    struct NFTMetadata {
        string name;
        string description;
        string image;
        string attributes; // JSON string com atributos
    }
    
    // Mapeamento de tokenId para metadados
    mapping(uint256 => NFTMetadata) public tokenMetadata;
    
    // Eventos
    event NFTMinted(address indexed to, uint256 indexed tokenId, string name);
    event BatchMinted(address indexed to, uint256[] tokenIds);
    
    constructor() ERC721("MyNFT", "MNFT") {}
    
    // Função para mintar um NFT
    function mintNFT(
        address to,
        string memory name,
        string memory description,
        string memory image,
        string memory attributes
    ) public onlyOwner whenNotPaused nonReentrant returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        
        // Armazenar metadados
        tokenMetadata[tokenId] = NFTMetadata({
            name: name,
            description: description,
            image: image,
            attributes: attributes
        });
        
        emit NFTMinted(to, tokenId, name);
        return tokenId;
    }
    
    // Função para mintar múltiplos NFTs
    function batchMint(
        address[] memory recipients,
        string[] memory names,
        string[] memory descriptions,
        string[] memory images,
        string[] memory attributes
    ) public onlyOwner whenNotPaused nonReentrant {
        require(
            recipients.length == names.length &&
            names.length == descriptions.length &&
            descriptions.length == images.length &&
            images.length == attributes.length,
            "Arrays length mismatch"
        );
        
        uint256[] memory tokenIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();
            
            _safeMint(recipients[i], tokenId);
            
            tokenMetadata[tokenId] = NFTMetadata({
                name: names[i],
                description: descriptions[i],
                image: images[i],
                attributes: attributes[i]
            });
            
            tokenIds[i] = tokenId;
        }
        
        emit BatchMinted(msg.sender, tokenIds);
    }
    
    // Função para obter metadados de um token
    function getTokenMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenMetadata[tokenId];
    }
    
    // Função para obter o total de tokens mintados
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Função para pausar o contrato
    function pause() public onlyOwner {
        _pause();
    }
    
    // Função para despausar o contrato
    function unpause() public onlyOwner {
        _unpause();
    }
    
    // Override da função _beforeTokenTransfer para incluir pausa
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    // Função para obter todos os tokens de um usuário
    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (ownerOf(i) == owner) {
                tokens[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokens;
    }
}