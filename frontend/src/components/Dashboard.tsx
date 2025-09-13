import React, { useState, useEffect } from 'react';

interface User {
  address: string;
  balance: string;
  nftCount: number;
  tokenBalance: string;
  canClaim: boolean;
  isWhitelisted: boolean;
}

interface DashboardProps {
  user: User;
  onDataUpdate: () => void;
}

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onDataUpdate }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    nft: { totalSupply: '0', isPaused: false },
    token: { totalSupply: '0', maxSupply: '0', claimAmount: '0', whitelistClaimAmount: '0' }
  });

  useEffect(() => {
    loadDashboardData();
  }, [user.address]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      // Carregar NFTs do usuário
      const nftResponse = await fetch(`${apiUrl}/api/user/${user.address}/nfts`);
      if (nftResponse.ok) {
        const nftData = await nftResponse.json();
        setNfts(nftData.nfts || []);
      }

      // Carregar estatísticas gerais
      const statsResponse = await fetch(`${apiUrl}/api/admin/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      
      {/* Estatísticas do Usuário */}
      <div className="user-stats">
        <h3>Seus Dados</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <div className="stat-label">Endereço</div>
              <div className="stat-value">{formatAddress(user.address)}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Saldo ETH</div>
              <div className="stat-value">{parseFloat(user.balance).toFixed(4)} ETH</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🪙</div>
            <div className="stat-content">
              <div className="stat-label">Tokens</div>
              <div className="stat-value">{formatNumber(user.tokenBalance)}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-content">
              <div className="stat-label">NFTs</div>
              <div className="stat-value">{user.nftCount}</div>
            </div>
          </div>
          
          {user.isWhitelisted && (
            <div className="stat-card whitelist">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-label">Status</div>
                <div className="stat-value">Whitelist</div>
              </div>
            </div>
          )}
          
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-label">Claim</div>
              <div className="stat-value">{user.canClaim ? 'Disponível' : 'Cooldown'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="global-stats">
        <h3>Estatísticas Gerais</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-content">
              <div className="stat-label">Total NFTs</div>
              <div className="stat-value">{formatNumber(stats.nft.totalSupply)}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🪙</div>
            <div className="stat-content">
              <div className="stat-label">Total Tokens</div>
              <div className="stat-value">{formatNumber(stats.token.totalSupply)}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Max Supply</div>
              <div className="stat-value">{formatNumber(stats.token.maxSupply)}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Claim Amount</div>
              <div className="stat-value">{formatNumber(stats.token.claimAmount)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* NFTs do Usuário */}
      {nfts.length > 0 && (
        <div className="user-nfts">
          <h3>Seus NFTs</h3>
          <div className="nft-grid">
            {nfts.map((nft) => (
              <div key={nft.tokenId} className="nft-card">
                <div className="nft-image">
                  {nft.image ? (
                    <img src={nft.image} alt={nft.name} />
                  ) : (
                    <div className="nft-placeholder">🎨</div>
                  )}
                </div>
                <div className="nft-info">
                  <h4>{nft.name}</h4>
                  <p>{nft.description}</p>
                  <div className="nft-id">ID: {nft.tokenId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de Atualizar */}
      <div className="dashboard-actions">
        <button className="refresh-button" onClick={loadDashboardData}>
          🔄 Atualizar Dados
        </button>
      </div>
    </div>
  );
};

export default Dashboard;