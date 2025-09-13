# 🚀 Web3 NFT & Token System

Sistema completo para mintar NFTs e fazer claim de tokens Web3 totalmente via contratos inteligentes. Inclui frontend React, backend Node.js e contratos Solidity.

## ✨ Funcionalidades

### 🎨 Sistema de NFTs (ERC-721)
- **Mint de NFTs** com metadados personalizados
- **Mint em lote** para múltiplos usuários
- **Armazenamento de metadados** no contrato
- **Sistema de pausa** para emergências
- **Visualização de NFTs** do usuário

### 🪙 Sistema de Tokens (ERC-20)
- **Claim de tokens** com cooldown de 24h
- **Sistema de whitelist** com claims maiores
- **Airdrop de tokens** para múltiplos endereços
- **Controle de supply** com limite máximo
- **Estatísticas em tempo real**

### 🌐 Interface Web
- **Frontend React** moderno e responsivo
- **Conexão com MetaMask** integrada
- **Dashboard** com estatísticas completas
- **Interface intuitiva** para todas as operações

### 🔧 Backend API
- **APIs RESTful** para todos os contratos
- **Rate limiting** e segurança
- **Verificação de assinaturas**
- **Endpoints para admin**

## 🏗️ Arquitetura

```
├── contracts/           # Contratos Solidity
│   ├── MyNFT.sol       # Contrato NFT (ERC-721)
│   └── MyToken.sol     # Contrato Token (ERC-20)
├── scripts/            # Scripts de deploy e interação
│   ├── deploy.js       # Deploy dos contratos
│   ├── verify.js       # Verificação dos contratos
│   └── interact.js     # Exemplos de interação
├── test/               # Testes dos contratos
│   ├── MyNFT.test.js   # Testes do contrato NFT
│   └── MyToken.test.js # Testes do contrato Token
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   └── App.js      # Aplicação principal
│   └── package.json
├── backend/            # API Node.js
│   ├── routes/         # Rotas da API
│   ├── server.js       # Servidor principal
│   └── package.json
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- MetaMask
- Hardhat
- Git

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd web3-nft-token-system
```

### 2. Instale as dependências
```bash
# Dependências principais
npm install

# Dependências do frontend
cd frontend
npm install
cd ..

# Dependências do backend
cd backend
npm install
cd ..
```

### 3. Configure as variáveis de ambiente

#### Backend (.env)
```bash
cp backend/env.example backend/.env
```

Edite `backend/.env`:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RPC_URL=http://localhost:8545
NFT_CONTRACT_ADDRESS=0x...
TOKEN_CONTRACT_ADDRESS=0x...
ADMIN_ADDRESS=0x...
```

#### Hardhat (hardhat.config.js)
```javascript
module.exports = {
  networks: {
    testnet: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"],
      chainId: 11155111
    }
  }
};
```

### 4. Deploy dos contratos

#### Rede local (Hardhat)
```bash
# Iniciar rede local
npx hardhat node

# Em outro terminal, fazer deploy
npx hardhat run scripts/deploy.js --network localhost
```

#### Testnet (Sepolia)
```bash
npx hardhat run scripts/deploy.js --network testnet
```

#### Verificar contratos
```bash
npx hardhat run scripts/verify.js --network testnet
```

### 5. Executar testes
```bash
npx hardhat test
```

### 6. Iniciar aplicação

#### Desenvolvimento (todos os serviços)
```bash
npm run dev
```

#### Individualmente
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
```

## 📖 Como Usar

### 1. Conectar Carteira
- Abra a aplicação no navegador
- Clique em "Conectar Carteira"
- Autorize a conexão no MetaMask

### 2. Mintar NFT
- Preencha os dados do NFT (nome, descrição, imagem)
- Adicione atributos em formato JSON
- Clique em "Mintar NFT"
- Confirme a transação no MetaMask

### 3. Fazer Claim de Tokens
- Verifique se você pode fazer claim
- Clique em "Fazer Claim"
- Confirme a transação no MetaMask
- Aguarde a confirmação

### 4. Visualizar Dashboard
- Veja seus NFTs e tokens
- Acompanhe estatísticas em tempo real
- Gerencie sua coleção

## 🔧 APIs Disponíveis

### NFTs
- `GET /api/nft/stats` - Estatísticas do contrato NFT
- `GET /api/nft/user/:address` - NFTs de um usuário
- `GET /api/nft/:tokenId` - Detalhes de um NFT
- `POST /api/nft/mint` - Mint de NFT

### Tokens
- `GET /api/token/stats` - Estatísticas do token
- `GET /api/token/balance/:address` - Saldo de tokens
- `GET /api/token/claim/:address` - Informações de claim
- `GET /api/token/whitelist/:address` - Status da whitelist

### Usuário
- `GET /api/user/:address/overview` - Visão geral do usuário
- `GET /api/user/:address/nfts` - NFTs do usuário
- `GET /api/user/:address/tokens` - Tokens do usuário
- `POST /api/user/verify-signature` - Verificar assinatura

### Admin
- `GET /api/admin/stats` - Estatísticas gerais
- `POST /api/admin/nft/pause` - Pausar contrato NFT
- `POST /api/admin/token/whitelist/add` - Adicionar à whitelist
- `POST /api/admin/token/airdrop` - Airdrop de tokens

## 🛡️ Segurança

### Contratos
- **Pausable**: Contratos podem ser pausados em emergências
- **ReentrancyGuard**: Proteção contra ataques de reentrância
- **Ownable**: Apenas o owner pode executar funções administrativas
- **Validações**: Validação rigorosa de entradas

### Backend
- **Rate Limiting**: Limite de requisições por IP
- **CORS**: Configuração adequada de CORS
- **Helmet**: Headers de segurança
- **Validação**: Validação de endereços e dados

### Frontend
- **Validação**: Validação de formulários
- **Sanitização**: Sanitização de entradas do usuário
- **Error Handling**: Tratamento robusto de erros

## 🧪 Testes

### Contratos
```bash
# Executar todos os testes
npx hardhat test

# Testes específicos
npx hardhat test test/MyNFT.test.js
npx hardhat test test/MyToken.test.js
```

### Cobertura de testes
- ✅ Deploy dos contratos
- ✅ Mint de NFTs
- ✅ Claim de tokens
- ✅ Sistema de whitelist
- ✅ Pausa/despausa
- ✅ Validações de segurança

## 🚀 Deploy em Produção

### 1. Configurar variáveis de ambiente
```bash
# Produção
NODE_ENV=production
RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
NFT_CONTRACT_ADDRESS=0x...
TOKEN_CONTRACT_ADDRESS=0x...
```

### 2. Deploy dos contratos
```bash
npx hardhat run scripts/deploy.js --network mainnet
npx hardhat run scripts/verify.js --network mainnet
```

### 3. Deploy do backend
```bash
cd backend
npm install --production
npm start
```

### 4. Deploy do frontend
```bash
cd frontend
npm run build
# Servir arquivos estáticos
```

## 📊 Monitoramento

### Logs
- Backend: Logs estruturados com Morgan
- Contratos: Eventos emitidos para monitoramento
- Frontend: Console logs para debug

### Métricas
- Total de NFTs mintados
- Total de tokens distribuídos
- Usuários ativos
- Transações por dia

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Problemas Comuns

#### MetaMask não conecta
- Verifique se a extensão está instalada
- Recarregue a página
- Verifique se está na rede correta

#### Transação falha
- Verifique se tem ETH suficiente para gas
- Aumente o gas limit
- Verifique se o contrato não está pausado

#### Erro de rede
- Verifique a conexão com a internet
- Verifique se o RPC está funcionando
- Tente trocar de rede

### Contato
- GitHub Issues: [Abrir issue](https://github.com/seu-usuario/web3-nft-token-system/issues)
- Email: seu-email@exemplo.com

## 🎯 Roadmap

### Próximas funcionalidades
- [ ] Integração com IPFS para metadados
- [ ] Sistema de royalties para NFTs
- [ ] Marketplace integrado
- [ ] Staking de tokens
- [ ] Sistema de governança
- [ ] Mobile app
- [ ] Integração com outras blockchains

### Melhorias técnicas
- [ ] Otimização de gas
- [ ] Testes de integração
- [ ] CI/CD pipeline
- [ ] Monitoramento avançado
- [ ] Cache de dados
- [ ] CDN para assets

---

**Desenvolvido com ❤️ para a comunidade Web3**

