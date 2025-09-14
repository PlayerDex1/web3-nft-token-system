const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Configuração do provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;

// ABI do contrato NFT (simplificado)
const nftABI = [
  "function totalSupply() view returns (uint256)",
  "function getTokenMetadata(uint256 tokenId) view returns (tuple(string name, string description, string image, string attributes))",
  "function getTokensByOwner(address owner) view returns (uint256[])",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function mintNFT(address to, string memory name, string memory description, string memory image, string memory attributes) external returns (uint256)",
  "function batchMint(address[] memory recipients, string[] memory names, string[] memory descriptions, string[] memory images, string[] memory attributes) external",
  "function pause() external",
  "function unpause() external",
  "function paused() view returns (bool)"
];

let nftContract;
if (nftContractAddress) {
  nftContract = new ethers.Contract(nftContractAddress, nftABI, provider);
}

// GET /api/nft/stats - Estatísticas do contrato NFT
router.get('/stats', async (req, res) => {
  try {
    if (!nftContract) {
      return res.status(503).json({ error: 'NFT contract not configured' });
    }

    const totalSupply = await nftContract.totalSupply();
    const isPaused = await nftContract.paused();

    res.json({
      totalSupply: totalSupply.toString(),
      isPaused,
      contractAddress: nftContractAddress
    });
  } catch (error) {
    console.error('Error getting NFT stats:', error);
    res.status(500).json({ error: 'Failed to get NFT stats' });
  }
});

// GET /api/nft/user/:address - NFTs de um usuário
router.get('/user/:address', async (req, res) => {
  try {
    if (!nftContract) {
      return res.status(503).json({ error: 'NFT contract not configured' });
    }

    const { address } = req.params;
    
    // Validar endereço
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const tokenIds = await nftContract.getTokensByOwner(address);
    const balance = await nftContract.balanceOf(address);

    // Obter metadados de cada token
    const nfts = [];
    for (const tokenId of tokenIds) {
      try {
        const metadata = await nftContract.getTokenMetadata(tokenId);
        nfts.push({
          tokenId: tokenId.toString(),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes
        });
      } catch (error) {
        console.error(`Error getting metadata for token ${tokenId}:`, error);
      }
    }

    res.json({
      address,
      balance: balance.toString(),
      tokenCount: tokenIds.length,
      nfts
    });
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    res.status(500).json({ error: 'Failed to get user NFTs' });
  }
});

// GET /api/nft/:tokenId - Detalhes de um NFT específico
router.get('/:tokenId', async (req, res) => {
  try {
    if (!nftContract) {
      return res.status(503).json({ error: 'NFT contract not configured' });
    }

    const { tokenId } = req.params;
    const tokenIdNumber = parseInt(tokenId);

    if (isNaN(tokenIdNumber) || tokenIdNumber <= 0) {
      return res.status(400).json({ error: 'Invalid token ID' });
    }

    const owner = await nftContract.ownerOf(tokenIdNumber);
    const metadata = await nftContract.getTokenMetadata(tokenIdNumber);

    res.json({
      tokenId: tokenIdNumber,
      owner,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      attributes: metadata.attributes
    });
  } catch (error) {
    console.error('Error getting NFT details:', error);
    if (error.message.includes('Token does not exist')) {
      res.status(404).json({ error: 'NFT not found' });
    } else {
      res.status(500).json({ error: 'Failed to get NFT details' });
    }
  }
});

// POST /api/nft/mint - Mint de NFT (requer assinatura)
router.post('/mint', async (req, res) => {
  try {
    const { to, name, description, image, attributes, signature } = req.body;

    // Validações básicas
    if (!to || !name || !description || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ethers.isAddress(to)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    // TODO: Implementar verificação de assinatura
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'NFT mint request received',
      data: {
        to,
        name,
        description,
        image,
        attributes: attributes || '{}'
      }
    });
  } catch (error) {
    console.error('Error processing mint request:', error);
    res.status(500).json({ error: 'Failed to process mint request' });
  }
});

module.exports = router;