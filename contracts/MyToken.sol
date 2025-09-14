// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyToken is ERC20, Ownable, Pausable, ReentrancyGuard {
    // Configurações do token
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 milhão de tokens
    uint256 public constant CLAIM_AMOUNT = 100 * 10**18; // 100 tokens por claim
    uint256 public constant WHITELIST_CLAIM_AMOUNT = 500 * 10**18; // 500 tokens para whitelist
    uint256 public constant COOLDOWN_PERIOD = 24 hours; // 24 horas de cooldown
    
    // Mapeamentos
    mapping(address => uint256) public lastClaimTime;
    mapping(address => bool) public whitelist;
    
    // Eventos
    event TokensClaimed(address indexed user, uint256 amount);
    event WhitelistAdded(address indexed user);
    event WhitelistRemoved(address indexed user);
    event AirdropExecuted(address[] recipients, uint256[] amounts);
    
    constructor() ERC20("MyToken", "MTK") {
        // Mint inicial para o owner
        _mint(msg.sender, 100000 * 10**18); // 100k tokens iniciais
    }
    
    // Função para fazer claim de tokens
    function claimTokens() public whenNotPaused nonReentrant {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + COOLDOWN_PERIOD,
            "Cooldown period not finished"
        );
        
        uint256 claimAmount = whitelist[msg.sender] ? WHITELIST_CLAIM_AMOUNT : CLAIM_AMOUNT;
        
        require(
            totalSupply() + claimAmount <= MAX_SUPPLY,
            "Maximum supply exceeded"
        );
        
        lastClaimTime[msg.sender] = block.timestamp;
        _mint(msg.sender, claimAmount);
        
        emit TokensClaimed(msg.sender, claimAmount);
    }
    
    // Função para verificar se pode fazer claim
    function canClaim(address user) public view returns (bool) {
        return block.timestamp >= lastClaimTime[user] + COOLDOWN_PERIOD;
    }
    
    // Função para obter tempo restante do cooldown
    function getCooldownTime(address user) public view returns (uint256) {
        if (lastClaimTime[user] == 0) {
            return 0;
        }
        
        uint256 nextClaimTime = lastClaimTime[user] + COOLDOWN_PERIOD;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        
        return nextClaimTime - block.timestamp;
    }
    
    // Função para obter quantidade de claim
    function getClaimAmount(address user) public view returns (uint256) {
        return whitelist[user] ? WHITELIST_CLAIM_AMOUNT : CLAIM_AMOUNT;
    }
    
    // Funções de whitelist (apenas owner)
    function addToWhitelist(address user) public onlyOwner {
        whitelist[user] = true;
        emit WhitelistAdded(user);
    }
    
    function removeFromWhitelist(address user) public onlyOwner {
        whitelist[user] = false;
        emit WhitelistRemoved(user);
    }
    
    function addMultipleToWhitelist(address[] memory users) public onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = true;
            emit WhitelistAdded(users[i]);
        }
    }
    
    // Função para airdrop de tokens
    function airdrop(address[] memory recipients, uint256[] memory amounts) public onlyOwner {
        require(
            recipients.length == amounts.length,
            "Arrays length mismatch"
        );
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                totalSupply() + amounts[i] <= MAX_SUPPLY,
                "Maximum supply exceeded"
            );
            _mint(recipients[i], amounts[i]);
        }
        
        emit AirdropExecuted(recipients, amounts);
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
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    // Função para obter estatísticas do token
    function getTokenStats() public view returns (
        uint256 totalSupply_,
        uint256 maxSupply_,
        uint256 claimAmount_,
        uint256 whitelistClaimAmount_,
        uint256 cooldownPeriod_
    ) {
        return (
            totalSupply(),
            MAX_SUPPLY,
            CLAIM_AMOUNT,
            WHITELIST_CLAIM_AMOUNT,
            COOLDOWN_PERIOD
        );
    }
    
    // Função para obter informações de um usuário
    function getUserInfo(address user) public view returns (
        uint256 balance_,
        bool isWhitelisted_,
        bool canClaim_,
        uint256 cooldownTime_,
        uint256 claimAmount_
    ) {
        return (
            balanceOf(user),
            whitelist[user],
            canClaim(user),
            getCooldownTime(user),
            getClaimAmount(user)
        );
    }
}