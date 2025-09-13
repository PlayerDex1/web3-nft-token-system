# 🚀 Guia de Deploy - Web3 NFT & Token System

Este guia detalha como fazer deploy do sistema completo em diferentes ambientes.

## 📋 Pré-requisitos

### Ferramentas Necessárias
- Node.js 16+ e npm
- Git
- MetaMask
- Conta em provedor RPC (Infura, Alchemy, etc.)
- Chaves privadas para deploy

### Configurações Iniciais
```bash
# Instalar Hardhat globalmente
npm install -g hardhat

# Verificar instalação
npx hardhat --version
```

## 🔧 Configuração do Ambiente

### 1. Configurar Hardhat

Edite `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"],
      chainId: 11155111
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"],
      chainId: 1
    }
  }
};
```

### 2. Configurar Variáveis de Ambiente

#### Backend (.env)
```bash
# Copiar arquivo de exemplo
cp backend/env.example backend/.env
```

Editar `backend/.env`:
```env
# Servidor
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com

# Blockchain
RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
NFT_CONTRACT_ADDRESS=0x...
TOKEN_CONTRACT_ADDRESS=0x...

# Admin
ADMIN_ADDRESS=0x...
ADMIN_PRIVATE_KEY=0x...

# Segurança
JWT_SECRET=seu_jwt_secret_super_seguro
```

## 🌐 Deploy por Ambiente

### 🏠 Desenvolvimento Local

#### 1. Iniciar Rede Local
```bash
# Terminal 1 - Iniciar Hardhat node
npx hardhat node
```

#### 2. Deploy dos Contratos
```bash
# Terminal 2 - Deploy
npx hardhat run scripts/deploy.js --network localhost
```

#### 3. Iniciar Aplicação
```bash
# Terminal 3 - Backend
cd backend
npm start

# Terminal 4 - Frontend
cd frontend
npm start
```

#### 4. Configurar MetaMask
- Rede: Localhost 8545
- Chain ID: 1337
- RPC URL: http://127.0.0.1:8545
- Importar contas do Hardhat

### 🧪 Testnet (Sepolia)

#### 1. Obter ETH de Teste
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)

#### 2. Deploy dos Contratos
```bash
# Deploy
npx hardhat run scripts/deploy.js --network sepolia

# Verificar contratos
npx hardhat run scripts/verify.js --network sepolia
```

#### 3. Atualizar Configurações
```bash
# Atualizar .env com novos endereços
NFT_CONTRACT_ADDRESS=0x...
TOKEN_CONTRACT_ADDRESS=0x...
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

#### 4. Deploy da Aplicação
```bash
# Backend
cd backend
npm install --production
npm start

# Frontend
cd frontend
npm run build
# Servir com nginx, apache, ou serviço de hospedagem
```

### 🌍 Mainnet (Produção)

#### 1. Preparação
```bash
# Verificar configurações
npx hardhat compile
npx hardhat test

# Verificar saldo de ETH
npx hardhat run scripts/check-balance.js --network mainnet
```

#### 2. Deploy dos Contratos
```bash
# Deploy (CUIDADO: custa ETH real!)
npx hardhat run scripts/deploy.js --network mainnet

# Verificar contratos
npx hardhat run scripts/verify.js --network mainnet
```

#### 3. Configurar Produção
```bash
# Atualizar .env
NODE_ENV=production
RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
NFT_CONTRACT_ADDRESS=0x...
TOKEN_CONTRACT_ADDRESS=0x...
```

#### 4. Deploy da Aplicação

##### Opção A: VPS/Cloud
```bash
# Instalar dependências
npm install --production

# Usar PM2 para gerenciar processos
npm install -g pm2

# Iniciar backend
cd backend
pm2 start server.js --name "nft-token-backend"

# Iniciar frontend
cd frontend
npm run build
pm2 serve build 3000 --name "nft-token-frontend"
```

##### Opção B: Docker
```dockerfile
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

```bash
# Build e run
docker build -t nft-token-system .
docker run -p 3001:3001 nft-token-system
```

##### Opção C: Serviços de Hospedagem
- **Vercel**: Deploy automático do frontend
- **Heroku**: Deploy do backend
- **AWS**: EC2, Lambda, S3
- **DigitalOcean**: Droplets

## 🔍 Verificação e Testes

### 1. Verificar Contratos
```bash
# Verificar no Etherscan
npx hardhat verify --network mainnet CONTRACT_ADDRESS

# Verificar funcionalidades
npx hardhat run scripts/interact.js --network mainnet
```

### 2. Testar APIs
```bash
# Health check
curl https://seu-backend.com/api/health

# Estatísticas
curl https://seu-backend.com/api/nft/stats
curl https://seu-backend.com/api/token/stats
```

### 3. Testar Frontend
- Conectar MetaMask
- Testar mint de NFT
- Testar claim de tokens
- Verificar dashboard

## 📊 Monitoramento

### 1. Logs
```bash
# PM2 logs
pm2 logs nft-token-backend
pm2 logs nft-token-frontend

# Docker logs
docker logs container-name
```

### 2. Métricas
- Uptime do servidor
- Uso de CPU/RAM
- Transações na blockchain
- Erros de API

### 3. Alertas
- Falhas de deploy
- Erros de contrato
- Alto uso de recursos
- Transações suspeitas

## 🛡️ Segurança

### 1. Contratos
- Verificar código antes do deploy
- Usar multisig para funções críticas
- Implementar timelock para mudanças
- Monitorar eventos suspeitos

### 2. Backend
- Usar HTTPS
- Configurar CORS adequadamente
- Implementar rate limiting
- Monitorar logs de acesso

### 3. Frontend
- Validar todas as entradas
- Sanitizar dados do usuário
- Usar Content Security Policy
- Implementar CSP headers

## 🔄 Atualizações

### 1. Atualizar Contratos
```bash
# Deploy nova versão
npx hardhat run scripts/deploy.js --network mainnet

# Migrar dados (se necessário)
npx hardhat run scripts/migrate.js --network mainnet
```

### 2. Atualizar Aplicação
```bash
# Pull latest changes
git pull origin main

# Rebuild
npm run build

# Restart services
pm2 restart all
```

### 3. Rollback
```bash
# Reverter para versão anterior
git checkout previous-version

# Redeploy
npm run build
pm2 restart all
```

## 🚨 Troubleshooting

### Problemas Comuns

#### Deploy falha
```bash
# Verificar saldo
npx hardhat run scripts/check-balance.js --network mainnet

# Verificar gas
npx hardhat run scripts/deploy.js --network mainnet --gas-price 20000000000
```

#### Contrato não verifica
```bash
# Verificar manualmente
npx hardhat verify --network mainnet CONTRACT_ADDRESS --constructor-args arguments.js
```

#### API não responde
```bash
# Verificar logs
pm2 logs nft-token-backend

# Verificar porta
netstat -tulpn | grep 3001
```

#### Frontend não carrega
```bash
# Verificar build
npm run build

# Verificar nginx/apache
sudo systemctl status nginx
```

### Logs Importantes
```bash
# Backend
tail -f backend/logs/app.log

# PM2
pm2 logs --lines 100

# Docker
docker logs -f container-name
```

## 📈 Escalabilidade

### 1. Backend
- Load balancer (nginx)
- Múltiplas instâncias
- Cache (Redis)
- CDN para assets

### 2. Frontend
- CDN (Cloudflare)
- Otimização de imagens
- Lazy loading
- Service workers

### 3. Blockchain
- Múltiplas redes
- Layer 2 solutions
- Gas optimization
- Batch operations

## 🎯 Próximos Passos

1. **Monitoramento**: Implementar métricas detalhadas
2. **Backup**: Sistema de backup automático
3. **CI/CD**: Pipeline de deploy automático
4. **Testes**: Testes de integração completos
5. **Documentação**: API documentation (Swagger)

---

**Lembre-se**: Sempre teste em testnet antes de fazer deploy em mainnet!

