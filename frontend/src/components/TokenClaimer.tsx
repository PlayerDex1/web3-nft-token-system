import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface User {
  address: string;
  balance: string;
  nftCount: number;
  tokenBalance: string;
  canClaim: boolean;
  isWhitelisted: boolean;
}

interface TokenClaimerProps {
  user: User;
  signer: ethers.JsonRpcSigner | null;
  onClaimSuccess: () => void;
}

interface ClaimInfo {
  canClaim: boolean;
  cooldownTime: string;
  claimAmount: string;
  isWhitelisted: boolean;
}

const TokenClaimer: React.FC<TokenClaimerProps> = ({ user, signer, onClaimSuccess }) => {
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>({
    canClaim: false,
    cooldownTime: '0',
    claimAmount: '0',
    isWhitelisted: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    loadClaimInfo();
  }, [user.address]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            loadClaimInfo(); // Recarregar info quando cooldown acabar
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);

  const loadClaimInfo = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/token/claim/${user.address}`);
      if (response.ok) {
        const data = await response.json();
        setClaimInfo({
          canClaim: data.canClaim,
          cooldownTime: data.cooldownTime,
          claimAmount: data.claimAmount,
          isWhitelisted: data.isWhitelisted
        });
        
        // Configurar timer se houver cooldown
        if (!data.canClaim && data.cooldownTime !== '0') {
          setTimeLeft(parseInt(data.cooldownTime));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar info de claim:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleClaim = async () => {
    if (!signer) {
      setMessage('Carteira não conectada');
      return;
    }

    if (!claimInfo.canClaim) {
      setMessage('Você não pode fazer claim agora. Aguarde o cooldown.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Criar mensagem para assinatura
      const message = `Claim tokens: ${claimInfo.claimAmount}`;
      const signature = await signer.signMessage(message);

      // Enviar requisição para o backend
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/token/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: user.address,
          signature
        })
      });

      if (response.ok) {
        setMessage('✅ Tokens claimados com sucesso!');
        onClaimSuccess();
        loadClaimInfo(); // Recarregar info
      } else {
        const error = await response.json();
        setMessage(`❌ Erro: ${error.error || 'Falha ao fazer claim'}`);
      }
    } catch (error) {
      console.error('Erro ao fazer claim:', error);
      setMessage('❌ Erro ao fazer claim. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-claimer">
      <h2>🪙 Claim de Tokens</h2>
      
      <div className="claim-info">
        <div className="info-card">
          <div className="info-icon">💰</div>
          <div className="info-content">
            <div className="info-label">Seu Saldo</div>
            <div className="info-value">{parseInt(user.tokenBalance).toLocaleString()} tokens</div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">🎯</div>
          <div className="info-content">
            <div className="info-label">Valor do Claim</div>
            <div className="info-value">{parseInt(claimInfo.claimAmount).toLocaleString()} tokens</div>
          </div>
        </div>

        {claimInfo.isWhitelisted && (
          <div className="info-card whitelist">
            <div className="info-icon">⭐</div>
            <div className="info-content">
              <div className="info-label">Status</div>
              <div className="info-value">Whitelist (Bonus!)</div>
            </div>
          </div>
        )}

        <div className="info-card">
          <div className="info-icon">⏰</div>
          <div className="info-content">
            <div className="info-label">Cooldown</div>
            <div className="info-value">
              {claimInfo.canClaim ? 'Disponível' : timeLeft > 0 ? formatTime(timeLeft) : 'Verificando...'}
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="claim-actions">
        <button
          className="claim-button"
          onClick={handleClaim}
          disabled={loading || !claimInfo.canClaim}
        >
          {loading ? '⏳ Processando...' : '🪙 Fazer Claim'}
        </button>

        <button
          className="refresh-button"
          onClick={loadClaimInfo}
          disabled={loading}
        >
          🔄 Atualizar
        </button>
      </div>

      <div className="claim-rules">
        <h3>📋 Regras do Claim</h3>
        <ul>
          <li>Você pode fazer claim a cada 24 horas</li>
          <li>Usuários da whitelist recebem 5x mais tokens</li>
          <li>Você precisará assinar uma mensagem para confirmar</li>
          <li>Certifique-se de ter ETH suficiente para gas</li>
          <li>O cooldown é de 24 horas após cada claim</li>
        </ul>
      </div>

      <div className="claim-stats">
        <h3>📊 Estatísticas</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Valor Normal:</span>
            <span className="stat-value">100 tokens</span>
          </div>
          <div className="stat">
            <span className="stat-label">Valor Whitelist:</span>
            <span className="stat-value">500 tokens</span>
          </div>
          <div className="stat">
            <span className="stat-label">Cooldown:</span>
            <span className="stat-value">24 horas</span>
          </div>
          <div className="stat">
            <span className="stat-label">Status Atual:</span>
            <span className="stat-value">
              {claimInfo.isWhitelisted ? 'Whitelist' : 'Normal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenClaimer;