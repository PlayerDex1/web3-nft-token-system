const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Configuração do provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;
const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
const adminAddress = process.env.ADMIN_ADDRESS;

// ABIs dos contratos
const nftABI = [
  "function totalSupply() view returns (uint256)",
  "function paused() view returns (bool)",
  "function pause() external",
  "function unpause() external"
];

const tokenABI = [
  "function totalSupply() view returns (uint256)",
  "function paused() view returns (bool)",
  "function pause() external",
  "function unpause() external",
  "function addToWhitelist(address user) external",
  "function removeFromWhitelist(address user) external",
  "function addMultipleToWhitelist(address[] memory users) external",
  "function airdrop(address[] memory recipients, uint256[] memory amounts) external",
  "function getTokenStats() view returns (uint256 totalSupply, uint256 maxSupply, uint256 claimAmount, uint256 whitelistClaimAmount, uint256 cooldownPeriod)"
];

let nftContract, tokenContract;
if (nftContractAddress) {
  nftContract = new ethers.Contract(nftContractAddress, nftABI, provider);
}
if (tokenContractAddress) {
  tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, provider);
}

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  if (!adminAddress || address.toLowerCase() !== adminAddress.toLowerCase()) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }

  next();
};

// GET /api/admin/stats - Estatísticas gerais
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      nft: {
        totalSupply: '0',
        isPaused: false,
        contractAddress: nftContractAddress
      },
      token: {
        totalSupply: '0',
        maxSupply: '0',
        claimAmount: '0',
        whitelistClaimAmount: '0',
        cooldownPeriod: '0',
        isPaused: false,
        contractAddress: tokenContractAddress
      },
      admin: {
        address: adminAddress
      }
    };

    // Obter estatísticas do NFT
    if (nftContract) {
      try {
        stats.nft.totalSupply = (await nftContract.totalSupply()).toString();
        stats.nft.isPaused = await nftContract.paused();
      } catch (error) {
        console.error('Error getting NFT stats:', error);
      }
    }

    // Obter estatísticas do Token
    if (tokenContract) {
      try {
        const tokenStats = await tokenContract.getTokenStats();
        stats.token = {
          totalSupply: tokenStats.totalSupply.toString(),
          maxSupply: tokenStats.maxSupply.toString(),
          claimAmount: tokenStats.claimAmount.toString(),
          whitelistClaimAmount: tokenStats.whitelistClaimAmount.toString(),
          cooldownPeriod: tokenStats.cooldownPeriod.toString(),
          isPaused: await tokenContract.paused(),
          contractAddress: tokenContractAddress
        };
      } catch (error) {
        console.error('Error getting token stats:', error);
      }
    }

    res.json(stats);
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ error: 'Failed to get admin stats' });
  }
});

// POST /api/admin/nft/pause - Pausar contrato NFT
router.post('/nft/pause', isAdmin, async (req, res) => {
  try {
    if (!nftContract) {
      return res.status(503).json({ error: 'NFT contract not configured' });
    }

    // TODO: Implementar execução real da pausa
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'NFT contract pause request received',
      action: 'pause'
    });
  } catch (error) {
    console.error('Error pausing NFT contract:', error);
    res.status(500).json({ error: 'Failed to pause NFT contract' });
  }
});

// POST /api/admin/nft/unpause - Despausar contrato NFT
router.post('/nft/unpause', isAdmin, async (req, res) => {
  try {
    if (!nftContract) {
      return res.status(503).json({ error: 'NFT contract not configured' });
    }

    // TODO: Implementar execução real do unpause
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'NFT contract unpause request received',
      action: 'unpause'
    });
  } catch (error) {
    console.error('Error unpausing NFT contract:', error);
    res.status(500).json({ error: 'Failed to unpause NFT contract' });
  }
});

// POST /api/admin/token/pause - Pausar contrato Token
router.post('/token/pause', isAdmin, async (req, res) => {
  try {
    if (!tokenContract) {
      return res.status(503).json({ error: 'Token contract not configured' });
    }

    // TODO: Implementar execução real da pausa
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'Token contract pause request received',
      action: 'pause'
    });
  } catch (error) {
    console.error('Error pausing token contract:', error);
    res.status(500).json({ error: 'Failed to pause token contract' });
  }
});

// POST /api/admin/token/unpause - Despausar contrato Token
router.post('/token/unpause', isAdmin, async (req, res) => {
  try {
    if (!tokenContract) {
      return res.status(503).json({ error: 'Token contract not configured' });
    }

    // TODO: Implementar execução real do unpause
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'Token contract unpause request received',
      action: 'unpause'
    });
  } catch (error) {
    console.error('Error unpausing token contract:', error);
    res.status(500).json({ error: 'Failed to unpause token contract' });
  }
});

// POST /api/admin/token/whitelist/add - Adicionar à whitelist
router.post('/token/whitelist/add', isAdmin, async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: 'Addresses array is required' });
    }

    // Validar endereços
    for (const address of addresses) {
      if (!ethers.isAddress(address)) {
        return res.status(400).json({ error: `Invalid address format: ${address}` });
      }
    }

    // TODO: Implementar execução real da adição à whitelist
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'Whitelist add request received',
      addresses
    });
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    res.status(500).json({ error: 'Failed to add to whitelist' });
  }
});

// POST /api/admin/token/whitelist/remove - Remover da whitelist
router.post('/token/whitelist/remove', isAdmin, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    // TODO: Implementar execução real da remoção da whitelist
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'Whitelist remove request received',
      address
    });
  } catch (error) {
    console.error('Error removing from whitelist:', error);
    res.status(500).json({ error: 'Failed to remove from whitelist' });
  }
});

// POST /api/admin/token/airdrop - Airdrop de tokens
router.post('/token/airdrop', isAdmin, async (req, res) => {
  try {
    const { recipients, amounts } = req.body;

    if (!recipients || !amounts || !Array.isArray(recipients) || !Array.isArray(amounts)) {
      return res.status(400).json({ error: 'Recipients and amounts arrays are required' });
    }

    if (recipients.length !== amounts.length) {
      return res.status(400).json({ error: 'Recipients and amounts arrays must have the same length' });
    }

    // Validar endereços e quantidades
    for (let i = 0; i < recipients.length; i++) {
      if (!ethers.isAddress(recipients[i])) {
        return res.status(400).json({ error: `Invalid address format: ${recipients[i]}` });
      }
      if (isNaN(amounts[i]) || amounts[i] <= 0) {
        return res.status(400).json({ error: `Invalid amount: ${amounts[i]}` });
      }
    }

    // TODO: Implementar execução real do airdrop
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'Airdrop request received',
      recipients,
      amounts
    });
  } catch (error) {
    console.error('Error processing airdrop:', error);
    res.status(500).json({ error: 'Failed to process airdrop' });
  }
});

module.exports = router;