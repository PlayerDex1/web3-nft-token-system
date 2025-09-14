import React, { useState, useEffect } from 'react';
import './App.css';
import Web3Connection from './components/Web3Connection';
import Dashboard from './components/Dashboard';
import NFTMinter from './components/NFTMinter';
import TokenClaimer from './components/TokenClaimer';
import { ethers } from 'ethers';

interface User {
  address: string;
  balance: string;
  nftCount: number;
  tokenBalance: string;
  canClaim: boolean;
  isWhitelisted: boolean;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Conectar à carteira
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          
          setProvider(provider);
          setSigner(signer);
          setUser({
            address,
            balance: ethers.formatEther(balance),
            nftCount: 0,
            tokenBalance: '0',
            canClaim: false,
            isWhitelisted: false
          });
          setIsConnected(true);
          
          // Carregar dados do usuário
          await loadUserData(address);
        }
      } else {
        alert('MetaMask não encontrado! Instale a extensão MetaMask.');
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Erro ao conectar carteira. Tente novamente.');
    }
  };

  // Carregar dados do usuário
  const loadUserData = async (address: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/user/${address}/overview`);
      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? {
          ...prev,
          nftCount: data.nfts.count,
          tokenBalance: data.tokens.balance,
          canClaim: data.tokens.canClaim,
          isWhitelisted: data.tokens.isWhitelisted
        } : null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Desconectar carteira
  const disconnectWallet = () => {
    setUser(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
  };

  // Verificar conexão existente
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            
            setProvider(provider);
            setSigner(signer);
            setUser({
              address,
              balance: ethers.formatEther(balance),
              nftCount: 0,
              tokenBalance: '0',
              canClaim: false,
              isWhitelisted: false
            });
            setIsConnected(true);
            
            await loadUserData(address);
          }
        } catch (error) {
          console.error('Erro ao verificar conexão:', error);
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Web3 NFT & Token System</h1>
        <Web3Connection
          isConnected={isConnected}
          user={user}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      </header>

      {isConnected && user && (
        <main className="App-main">
          <nav className="App-nav">
            <button
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={activeTab === 'mint' ? 'active' : ''}
              onClick={() => setActiveTab('mint')}
            >
              🎨 Mint NFT
            </button>
            <button
              className={activeTab === 'claim' ? 'active' : ''}
              onClick={() => setActiveTab('claim')}
            >
              🪙 Claim Tokens
            </button>
          </nav>

          <div className="App-content">
            {activeTab === 'dashboard' && (
              <Dashboard user={user} onDataUpdate={() => loadUserData(user.address)} />
            )}
            {activeTab === 'mint' && (
              <NFTMinter user={user} signer={signer} onMintSuccess={() => loadUserData(user.address)} />
            )}
            {activeTab === 'claim' && (
              <TokenClaimer user={user} signer={signer} onClaimSuccess={() => loadUserData(user.address)} />
            )}
          </div>
        </main>
      )}

      {!isConnected && (
        <div className="App-welcome">
          <h2>Bem-vindo ao Web3 NFT & Token System!</h2>
          <p>Conecte sua carteira MetaMask para começar a usar o sistema.</p>
          <button className="connect-button" onClick={connectWallet}>
            🔗 Conectar Carteira
          </button>
        </div>
      )}
    </div>
  );
}

export default App;