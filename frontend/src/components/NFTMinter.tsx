import React, { useState } from 'react';
import { ethers } from 'ethers';

interface User {
  address: string;
  balance: string;
  nftCount: number;
  tokenBalance: string;
  canClaim: boolean;
  isWhitelisted: boolean;
}

interface NFTMinterProps {
  user: User;
  signer: ethers.JsonRpcSigner | null;
  onMintSuccess: () => void;
}

const NFTMinter: React.FC<NFTMinterProps> = ({ user, signer, onMintSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    attributes: '{}'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage('Nome é obrigatório');
      return false;
    }
    if (!formData.description.trim()) {
      setMessage('Descrição é obrigatória');
      return false;
    }
    if (!formData.image.trim()) {
      setMessage('URL da imagem é obrigatória');
      return false;
    }
    
    // Validar JSON dos atributos
    try {
      JSON.parse(formData.attributes);
    } catch {
      setMessage('Atributos devem ser um JSON válido');
      return false;
    }
    
    return true;
  };

  const handleMint = async () => {
    if (!signer) {
      setMessage('Carteira não conectada');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Criar mensagem para assinatura
      const message = `Mint NFT: ${formData.name}`;
      const signature = await signer.signMessage(message);

      // Enviar requisição para o backend
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/nft/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user.address,
          name: formData.name,
          description: formData.description,
          image: formData.image,
          attributes: formData.attributes,
          signature
        })
      });

      if (response.ok) {
        setMessage('✅ NFT mintado com sucesso!');
        setFormData({
          name: '',
          description: '',
          image: '',
          attributes: '{}'
        });
        onMintSuccess();
      } else {
        const error = await response.json();
        setMessage(`❌ Erro: ${error.error || 'Falha ao mintar NFT'}`);
      }
    } catch (error) {
      console.error('Erro ao mintar NFT:', error);
      setMessage('❌ Erro ao mintar NFT. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nft-minter">
      <h2>🎨 Mintar NFT</h2>
      
      <div className="mint-form">
        <div className="form-group">
          <label htmlFor="name">Nome do NFT *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Meu NFT Incrível"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva seu NFT..."
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL da Imagem *</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://exemplo.com/imagem.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="attributes">Atributos (JSON)</label>
          <textarea
            id="attributes"
            name="attributes"
            value={formData.attributes}
            onChange={handleInputChange}
            placeholder='{"raridade": "raro", "cor": "azul", "poder": 100}'
            rows={3}
          />
          <small>Formato JSON com os atributos do NFT</small>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button
          className="mint-button"
          onClick={handleMint}
          disabled={loading}
        >
          {loading ? '⏳ Mintando...' : '🎨 Mintar NFT'}
        </button>
      </div>

      <div className="mint-info">
        <h3>ℹ️ Informações</h3>
        <ul>
          <li>Você precisará assinar uma mensagem para confirmar o mint</li>
          <li>O NFT será criado em seu endereço: <code>{user.address}</code></li>
          <li>Os metadados serão armazenados no contrato</li>
          <li>Certifique-se de ter ETH suficiente para gas</li>
        </ul>
      </div>
    </div>
  );
};

export default NFTMinter;