const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Configuração do provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;
const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;

// ABIs dos contratos
const nftABI = [
  "function getTokensByOwner(address owner) view returns (uint256[])",
  "function balanceOf(address owner) view returns (uint256)",
  "function getTokenMetadata(uint256 tokenId) view returns (tuple(string name, string description, string image, string attributes))"
];

const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function getUserInfo(address user) view returns (uint256 balance, bool isWhitelisted, bool canClaim, uint256 cooldownTime, uint256 claimAmount)"
];

let nftContract, tokenContract;
if (nftContractAddress) {
  nftContract = new ethers.Contract(nftContractAddress, nftABI, provider);
}
if (tokenContractAddress) {
  tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, provider);
}

// GET /api/user/:address/overview - Visão geral do usuário
router.get('/:address/overview', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validar endereço
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const overview = {
      address,
      nfts: {
        count: 0,
        tokens: []
      },
      tokens: {
        balance: '0',
        canClaim: false,
        isWhitelisted: false,
        claimAmount: '0',
        cooldownTime: '0'
      }
    };

    // Obter informações dos NFTs
    if (nftContract) {
      try {
        const nftBalance = await nftContract.balanceOf(address);
        const tokenIds = await nftContract.getTokensByOwner(address);
        
        overview.nfts.count = nftBalance.toString();
        
        // Obter metadados dos NFTs
        for (const tokenId of tokenIds) {
          try {
            const metadata = await nftContract.getTokenMetadata(tokenId);
            overview.nfts.tokens.push({
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
      } catch (error) {
        console.error('Error getting NFT info:', error);
      }
    }

    // Obter informações dos tokens
    if (tokenContract) {
      try {
        const userInfo = await tokenContract.getUserInfo(address);
        overview.tokens = {
          balance: userInfo.balance.toString(),
          canClaim: userInfo.canClaim,
          isWhitelisted: userInfo.isWhitelisted,
          claimAmount: userInfo.claimAmount.toString(),
          cooldownTime: userInfo.cooldownTime.toString()
        };
      } catch (error) {
        console.error('Error getting token info:', error);
      }
    }

    res.json(overview);
  } catch (error) {
    console.error('Error getting user overview:', error);
    res.status(500).json({ error: 'Failed to get user overview' });
  }
});

// GET /api/user/:address/nfts - NFTs do usuário
router.get('/:address/nfts', async (req, res) => {
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
      count: tokenIds.length,
      nfts
    });
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    res.status(500).json({ error: 'Failed to get user NFTs' });
  }
});

// GET /api/user/:address/tokens - Tokens do usuário
router.get('/:address/tokens', async (req, res) => {
  try {
    if (!tokenContract) {
      return res.status(503).json({ error: 'Token contract not configured' });
    }

    const { address } = req.params;
    
    // Validar endereço
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const userInfo = await tokenContract.getUserInfo(address);

    res.json({
      address,
      balance: userInfo.balance.toString(),
      isWhitelisted: userInfo.isWhitelisted,
      canClaim: userInfo.canClaim,
      cooldownTime: userInfo.cooldownTime.toString(),
      claimAmount: userInfo.claimAmount.toString()
    });
  } catch (error) {
    console.error('Error getting user tokens:', error);
    res.status(500).json({ error: 'Failed to get user tokens' });
  }
});

// POST /api/user/verify-signature - Verificar assinatura
router.post('/verify-signature', async (req, res) => {
  try {
    const { address, message, signature } = req.body;

    // Validações básicas
    if (!address || !message || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    try {
      // Verificar assinatura
      const recoveredAddress = ethers.verifyMessage(message, signature);
      const isValid = recoveredAddress.toLowerCase() === address.toLowerCase();

      res.json({
        valid: isValid,
        address,
        recoveredAddress,
        message
      });
    } catch (error) {
      res.json({
        valid: false,
        address,
        error: 'Invalid signature format'
      });
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

module.exports = router;