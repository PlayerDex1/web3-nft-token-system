import React from 'react';
import { ethers } from 'ethers';

interface User {
  address: string;
  balance: string;
  nftCount: number;
  tokenBalance: string;
  canClaim: boolean;
  isWhitelisted: boolean;
}

interface Web3ConnectionProps {
  isConnected: boolean;
  user: User | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const Web3Connection: React.FC<Web3ConnectionProps> = ({
  isConnected,
  user,
  onConnect,
  onDisconnect
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4);
  };

  return (
    <div className="web3-connection">
      {isConnected && user ? (
        <div className="connected-info">
          <div className="user-info">
            <div className="address">
              <span className="label">Endereço:</span>
              <span className="value">{formatAddress(user.address)}</span>
            </div>
            <div className="balance">
              <span className="label">ETH:</span>
              <span className="value">{formatBalance(user.balance)}</span>
            </div>
            <div className="tokens">
              <span className="label">Tokens:</span>
              <span className="value">{user.tokenBalance}</span>
            </div>
            <div className="nfts">
              <span className="label">NFTs:</span>
              <span className="value">{user.nftCount}</span>
            </div>
            {user.isWhitelisted && (
              <div className="whitelist-badge">
                ⭐ Whitelist
              </div>
            )}
          </div>
          <button className="disconnect-button" onClick={onDisconnect}>
            Desconectar
          </button>
        </div>
      ) : (
        <button className="connect-button" onClick={onConnect}>
          🔗 Conectar MetaMask
        </button>
      )}
    </div>
  );
};

export default Web3Connection;