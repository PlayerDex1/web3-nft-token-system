const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Configuração do provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;

// ABI do contrato Token (simplificado)
const tokenABI = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function canClaim(address user) view returns (bool)",
  "function getCooldownTime(address user) view returns (uint256)",
  "function getClaimAmount(address user) view returns (uint256)",
  "function getUserInfo(address user) view returns (uint256 balance, bool isWhitelisted, bool canClaim, uint256 cooldownTime, uint256 claimAmount)",
  "function getTokenStats() view returns (uint256 totalSupply, uint256 maxSupply, uint256 claimAmount, uint256 whitelistClaimAmount, uint256 cooldownPeriod)",
  "function claimTokens() external",
  "function whitelist(address user) view returns (bool)",
  "function paused() view returns (bool)"
];

let tokenContract;
if (tokenContractAddress) {
  tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, provider);
}

// GET /api/token/stats - Estatísticas do token
router.get('/stats', async (req, res) => {
  try {
    if (!tokenContract) {
      return res.status(503).json({ error: 'Token contract not configured' });
    }

    const stats = await tokenContract.getTokenStats();
    const isPaused = await tokenContract.paused();

    res.json({
      totalSupply: stats.totalSupply.toString(),
      maxSupply: stats.maxSupply.toString(),
      claimAmount: stats.claimAmount.toString(),
      whitelistClaimAmount: stats.whitelistClaimAmount.toString(),
      cooldownPeriod: stats.cooldownPeriod.toString(),
      isPaused,
      contractAddress: tokenContractAddress
    });
  } catch (error) {
    console.error('Error getting token stats:', error);
    res.status(500).json({ error: 'Failed to get token stats' });
  }
});

// GET /api/token/balance/:address - Saldo de tokens de um endereço
router.get('/balance/:address', async (req, res) => {
  try {
    if (!tokenContract) {
      return res.status(503).json({ error: 'Token contract not configured' });
    }

    const { address } = req.params;
    
    // Validar endereço
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const balance = await tokenContract.balanceOf(address);

    res.json({
      address,
      balance: balance.toString()
    });
  } catch (error) {
    console.error('Error getting token balance:', error);
    res.status(500).json({ error: 'Failed to get token balance' });
  }
});

// GET /api/token/claim/:address - Informações de claim de um endereço
router.get('/claim/:address', async (req, res) => {
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
    console.error('Error getting claim info:', error);
    res.status(500).json({ error: 'Failed to get claim info' });
  }
});

// GET /api/token/whitelist/:address - Status da whitelist
router.get('/whitelist/:address', async (req, res) => {
  try {
    if (!tokenContract) {
      return res.status(503).json({ error: 'Token contract not configured' });
    }

    const { address } = req.params;
    
    // Validar endereço
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const isWhitelisted = await tokenContract.whitelist(address);

    res.json({
      address,
      isWhitelisted
    });
  } catch (error) {
    console.error('Error checking whitelist status:', error);
    res.status(500).json({ error: 'Failed to check whitelist status' });
  }
});

// POST /api/token/claim - Fazer claim de tokens (requer assinatura)
router.post('/claim', async (req, res) => {
  try {
    const { address, signature } = req.body;

    // Validações básicas
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    // TODO: Implementar verificação de assinatura e execução real do claim
    // Por enquanto, apenas retornar sucesso simulado
    res.json({
      success: true,
      message: 'Token claim request received',
      data: {
        address,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing claim request:', error);
    res.status(500).json({ error: 'Failed to process claim request' });
  }
});

module.exports = router;