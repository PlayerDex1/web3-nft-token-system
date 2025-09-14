# 🚀 Deploy no Vercel - Web3 NFT & Token System

Este guia explica como fazer o deploy do projeto completo no Vercel.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com)
- Projeto enviado para um repositório GitHub
- Node.js 16+ instalado localmente

## 🔧 Configuração do Projeto

### 1. Estrutura do Projeto

O projeto está organizado da seguinte forma:
```
/
├── frontend/          # Aplicação React
├── backend/           # API Node.js
├── contracts/         # Contratos Solidity
├── scripts/           # Scripts de deploy
├── vercel.json        # Configuração do Vercel
└── .vercelignore      # Arquivos ignorados
```

### 2. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Vercel:

#### Frontend (REACT_APP_*)
- `REACT_APP_API_URL`: URL da API backend
- `REACT_APP_NFT_CONTRACT_ADDRESS`: Endereço do contrato NFT
- `REACT_APP_TOKEN_CONTRACT_ADDRESS`: Endereço do contrato Token
- `REACT_APP_RPC_URL`: URL do RPC da blockchain

#### Backend
- `NODE_ENV`: production
- `PORT`: 3001
- `FRONTEND_URL`: URL do frontend
- `RPC_URL`: URL do RPC da blockchain
- `NFT_CONTRACT_ADDRESS`: Endereço do contrato NFT
- `TOKEN_CONTRACT_ADDRESS`: Endereço do contrato Token
- `ADMIN_ADDRESS`: Endereço do administrador
- `ADMIN_PRIVATE_KEY`: Chave privada do administrador
- `JWT_SECRET`: Chave secreta para JWT

## 🚀 Processo de Deploy

### Opção 1: Deploy Automático (Recomendado)

1. **Conectar ao GitHub**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione seu repositório

2. **Configurar Projeto**
   - Framework Preset: `Other`
   - Root Directory: `/` (raiz do projeto)
   - Build Command: `./build.sh`
   - Output Directory: `frontend/build`

3. **Configurar Variáveis de Ambiente**
   - Vá para Settings > Environment Variables
   - Adicione todas as variáveis listadas acima

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o processo de build e deploy

### Opção 2: Deploy Manual

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login no Vercel**
   ```bash
   vercel login
   ```

3. **Deploy do Backend**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Deploy do Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

## 🔗 Configuração de URLs

Após o deploy, você terá duas URLs:
- Frontend: `https://seu-projeto.vercel.app`
- Backend: `https://seu-backend.vercel.app`

### Atualizar URLs

1. **No Frontend**
   - Atualize `REACT_APP_API_URL` com a URL do backend
   - Redeploy o frontend

2. **No Backend**
   - Atualize `FRONTEND_URL` com a URL do frontend
   - Redeploy o backend

## 📝 Deploy dos Contratos

Antes de usar a aplicação, você precisa fazer o deploy dos contratos:

### 1. Configurar Hardhat

Edite `hardhat.config.js`:
```javascript
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"],
      chainId: 11155111
    }
  }
};
```

### 2. Deploy dos Contratos

```bash
# Deploy na testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verificar contratos
npx hardhat run scripts/verify.js --network sepolia
```

### 3. Atualizar Variáveis de Ambiente

Após o deploy, atualize as variáveis de ambiente no Vercel com os endereços dos contratos.

## 🧪 Testando o Deploy

### 1. Verificar Frontend
- Acesse a URL do frontend
- Verifique se a página carrega corretamente
- Teste a conexão com MetaMask

### 2. Verificar Backend
- Acesse `https://seu-backend.vercel.app/api/health`
- Deve retornar status OK

### 3. Testar Funcionalidades
- Conectar carteira
- Mintar NFT
- Fazer claim de tokens
- Verificar dashboard

## 🔧 Troubleshooting

### Problemas Comuns

#### Build Falha
- Verifique se todas as dependências estão instaladas
- Verifique se o Node.js está na versão 16+
- Verifique os logs de build no Vercel

#### API Não Responde
- Verifique se as variáveis de ambiente estão configuradas
- Verifique se o backend foi deployado corretamente
- Verifique os logs do backend no Vercel

#### Frontend Não Conecta com API
- Verifique se `REACT_APP_API_URL` está correto
- Verifique se o CORS está configurado no backend
- Verifique se as URLs estão acessíveis

#### MetaMask Não Conecta
- Verifique se está na rede correta
- Verifique se o RPC está configurado
- Verifique se os contratos foram deployados

### Logs e Debug

1. **Logs do Vercel**
   - Acesse o dashboard do Vercel
   - Vá para Functions > Logs

2. **Logs do Frontend**
   - Abra o DevTools do navegador
   - Verifique o Console

3. **Logs do Backend**
   - Use `console.log` no código
   - Verifique os logs no Vercel

## 📊 Monitoramento

### 1. Analytics do Vercel
- Acesse o dashboard do projeto
- Monitore visitas, performance, erros

### 2. Logs de Erro
- Configure alertas para erros críticos
- Monitore a saúde da API

### 3. Performance
- Monitore tempo de resposta da API
- Monitore tempo de carregamento do frontend

## 🔄 Atualizações

### 1. Atualizar Código
- Faça push para o GitHub
- O Vercel fará deploy automático

### 2. Atualizar Variáveis de Ambiente
- Vá para Settings > Environment Variables
- Atualize as variáveis necessárias
- Redeploy o projeto

### 3. Atualizar Contratos
- Faça deploy dos novos contratos
- Atualize os endereços nas variáveis de ambiente
- Redeploy a aplicação

## 🎯 Próximos Passos

1. **Configurar Domínio Personalizado**
   - Adicione seu domínio no Vercel
   - Configure DNS

2. **Configurar HTTPS**
   - O Vercel já fornece HTTPS automaticamente

3. **Configurar CDN**
   - O Vercel já inclui CDN global

4. **Configurar Monitoramento**
   - Integre com serviços de monitoramento
   - Configure alertas

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação do Vercel
2. Verifique os logs de erro
3. Consulte a documentação do projeto
4. Abra uma issue no GitHub

---

**Lembre-se**: Sempre teste em ambiente de desenvolvimento antes de fazer deploy em produção!