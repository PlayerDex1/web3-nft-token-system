# 📚 Documentação da API - Web3 NFT & Token System

Documentação completa das APIs RESTful do sistema.

## 🌐 Base URL

```
Desenvolvimento: http://localhost:3001/api
Produção: https://seu-dominio.com/api
```

## 🔐 Autenticação

### Headers Obrigatórios
```http
Content-Type: application/json
```

### Verificação de Assinatura (Opcional)
```http
X-Signature: 0x...
X-Message: mensagem_assinada
```

## 📊 Endpoints

### 🎨 NFTs

#### GET /nft/stats
Estatísticas gerais do contrato NFT.

**Resposta:**
```json
{
  "totalSupply": "100",
  "paused": false,
  "contractAddress": "0x..."
}
```

#### GET /nft/user/:address
Obter NFTs de um usuário específico.

**Parâmetros:**
- `address` (string): Endereço da carteira

**Resposta:**
```json
{
  "address": "0x...",
  "nftCount": 5,
  "nfts": [
    {
      "tokenId": "1",
      "tokenURI": "https://...",
      "name": "Meu NFT",
      "description": "Descrição do NFT",
      "image": "https://...",
      "attributes": "{\"rarity\": \"common\"}",
      "timestamp": "1640995200"
    }
  ]
}
```

#### GET /nft/:tokenId
Detalhes de um NFT específico.

**Parâmetros:**
- `tokenId` (string): ID do token

**Resposta:**
```json
{
  "tokenId": "1",
  "owner": "0x...",
  "tokenURI": "https://...",
  "name": "Meu NFT",
  "description": "Descrição do NFT",
  "image": "https://...",
  "attributes": "{\"rarity\": \"common\"}",
  "timestamp": "1640995200"
}
```

#### POST /nft/mint
Mint de NFT (requer assinatura).

**Body:**
```json
{
  "to": "0x...",
  "tokenURI": "https://...",
  "name": "Meu NFT",
  "description": "Descrição do NFT",
  "image": "https://...",
  "attributes": "{\"rarity\": \"common\"}",
  "signature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Mint simulado - use o frontend para mint real",
  "data": {
    "to": "0x...",
    "tokenURI": "https://...",
    "name": "Meu NFT",
    "description": "Descrição do NFT",
    "image": "https://...",
    "attributes": "{\"rarity\": \"common\"}"
  }
}
```

#### GET /nft/contract/pause
Verificar se o contrato está pausado.

**Resposta:**
```json
{
  "paused": false
}
```

### 🪙 Tokens

#### GET /token/stats
Estatísticas gerais do token.

**Resposta:**
```json
{
  "totalSupply": "1000000",
  "maxSupply": "1000000",
  "remainingSupply": "800000",
  "claimAmount": "100",
  "whitelistClaimAmount": "500",
  "contractAddress": "0x..."
}
```

#### GET /token/balance/:address
Saldo de tokens de um endereço.

**Parâmetros:**
- `address` (string): Endereço da carteira

**Resposta:**
```json
{
  "address": "0x...",
  "balance": "100000000000000000000",
  "balanceFormatted": "100.0"
}
```

#### GET /token/claim/:address
Informações de claim de um endereço.

**Parâmetros:**
- `address` (string): Endereço da carteira

**Resposta:**
```json
{
  "address": "0x...",
  "claimInfo": {
    "amount": "100000000000000000000",
    "timestamp": "1640995200",
    "claimed": true
  },
  "canClaim": false,
  "isWhitelisted": false
}
```

#### GET /token/whitelist/:address
Verificar se endereço está na whitelist.

**Parâmetros:**
- `address` (string): Endereço da carteira

**Resposta:**
```json
{
  "address": "0x...",
  "isWhitelisted": true
}
```

#### POST /token/whitelist/add
Adicionar endereço à whitelist (admin).

**Body:**
```json
{
  "address": "0x...",
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Adição à whitelist simulada",
  "data": {
    "address": "0x..."
  }
}
```

#### POST /token/whitelist/remove
Remover endereço da whitelist (admin).

**Body:**
```json
{
  "address": "0x...",
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Remoção da whitelist simulada",
  "data": {
    "address": "0x..."
  }
}
```

#### GET /token/contract/pause
Verificar se o contrato está pausado.

**Resposta:**
```json
{
  "paused": false
}
```

### 👤 Usuário

#### GET /user/:address/overview
Visão geral completa do usuário.

**Parâmetros:**
- `address` (string): Endereço da carteira

**Resposta:**
```json
{
  "address": "0x...",
  "nft": {
    "balance": "5",
    "nfts": [
      {
        "tokenId": "1",
        "name": "Meu NFT",
        "description": "Descrição do NFT",
        "image": "https://...",
        "attributes": "{\"rarity\": \"common\"}",
        "timestamp": "1640995200"
      }
    ]
  },
  "token": {
    "balance": "100000000000000000000",
    "balanceFormatted": "100.0",
    "claimInfo": {
      "amount": "100000000000000000000",
      "timestamp": "1640995200",
      "claimed": true
    },
    "canClaim": false,
    "isWhitelisted": false
  },
  "stats": {
    "totalSupply": "1000000",
    "maxSupply": "1000000",
    "remainingSupply": "800000",
    "claimAmount": "100",
    "whitelistClaimAmount": "500"
  }
}
```

#### GET /user/:address/nfts
NFTs do usuário.

**Parâmetros:**
- `address` (string): Endereço da carteira

**Resposta:**
```json
{
  "address": "0x...",
  "nftCount": 5,
  "nfts": [
    {
      "tokenId": "1",
      "tokenURI": "https://...",
      "name": "Meu NFT",
      "description": "Descrição do NFT",
      "image": "https://...",
      "attributes": "{\"rarity\": \"common\"}",
      "timestamp": "1640995200"
    }
  ]
}
```

#### GET /user/:address/tokens
Informações de tokens do usuário.

**Parâmetros:**
- `address` (string): Endereço da carteira

**Resposta:**
```json
{
  "address": "0x...",
  "balance": "100000000000000000000",
  "balanceFormatted": "100.0",
  "claimInfo": {
    "amount": "100000000000000000000",
    "timestamp": "1640995200",
    "claimed": true
  },
  "canClaim": false,
  "isWhitelisted": false,
  "stats": {
    "totalSupply": "1000000",
    "maxSupply": "1000000",
    "remainingSupply": "800000",
    "claimAmount": "100",
    "whitelistClaimAmount": "500"
  }
}
```

#### POST /user/verify-signature
Verificar assinatura de mensagem.

**Body:**
```json
{
  "message": "mensagem_original",
  "signature": "0x...",
  "expectedAddress": "0x..."
}
```

**Resposta:**
```json
{
  "isValid": true,
  "recoveredAddress": "0x...",
  "expectedAddress": "0x...",
  "message": "mensagem_original"
}
```

### 🔧 Admin

#### GET /admin/stats
Estatísticas gerais do sistema.

**Resposta:**
```json
{
  "nft": {
    "totalSupply": "100",
    "paused": false,
    "contractAddress": "0x..."
  },
  "token": {
    "totalSupply": "1000000",
    "maxSupply": "1000000",
    "remainingSupply": "800000",
    "claimAmount": "100",
    "whitelistClaimAmount": "500",
    "paused": false,
    "contractAddress": "0x..."
  }
}
```

#### POST /admin/nft/pause
Pausar contrato NFT (admin).

**Body:**
```json
{
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Pausar NFT simulado",
  "action": "pause"
}
```

#### POST /admin/nft/unpause
Despausar contrato NFT (admin).

**Body:**
```json
{
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Despausar NFT simulado",
  "action": "unpause"
}
```

#### POST /admin/token/pause
Pausar contrato Token (admin).

**Body:**
```json
{
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Pausar Token simulado",
  "action": "pause"
}
```

#### POST /admin/token/unpause
Despausar contrato Token (admin).

**Body:**
```json
{
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Despausar Token simulado",
  "action": "unpause"
}
```

#### POST /admin/token/whitelist/add
Adicionar à whitelist (admin).

**Body:**
```json
{
  "address": "0x...",
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Adicionar à whitelist simulado",
  "data": {
    "address": "0x..."
  }
}
```

#### POST /admin/token/whitelist/remove
Remover da whitelist (admin).

**Body:**
```json
{
  "address": "0x...",
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Remover da whitelist simulado",
  "data": {
    "address": "0x..."
  }
}
```

#### POST /admin/token/airdrop
Airdrop de tokens (admin).

**Body:**
```json
{
  "recipients": ["0x...", "0x..."],
  "amounts": ["100000000000000000000", "200000000000000000000"],
  "adminSignature": "0x...",
  "message": "mensagem_assinada"
}
```

**Resposta:**
```json
{
  "message": "Airdrop simulado",
  "data": {
    "recipients": ["0x...", "0x..."],
    "amounts": ["100000000000000000000", "200000000000000000000"],
    "totalRecipients": 2
  }
}
```

### 🏥 Health Check

#### GET /health
Status da API.

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## 📝 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Dados inválidos |
| 401 | Não autorizado |
| 404 | Não encontrado |
| 429 | Muitas requisições |
| 500 | Erro interno do servidor |

## 🚨 Tratamento de Erros

### Formato de Erro
```json
{
  "error": "Tipo do erro",
  "message": "Descrição detalhada do erro"
}
```

### Exemplos de Erros

#### Endereço Inválido
```json
{
  "error": "Endereço inválido",
  "message": "O endereço fornecido não é válido"
}
```

#### Contrato Não Configurado
```json
{
  "error": "Contrato não configurado",
  "message": "O endereço do contrato não foi configurado"
}
```

#### Rate Limit
```json
{
  "error": "Muitas requisições",
  "message": "Muitas requisições deste IP, tente novamente em 15 minutos."
}
```

## 🔒 Rate Limiting

- **Limite**: 100 requisições por 15 minutos por IP
- **Headers de resposta**:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp de reset

## 📊 Exemplos de Uso

### JavaScript (Fetch)
```javascript
// Obter estatísticas do NFT
const response = await fetch('https://api.exemplo.com/api/nft/stats');
const data = await response.json();
console.log(data);

// Obter NFTs de um usuário
const userNFTs = await fetch('https://api.exemplo.com/api/nft/user/0x...');
const nfts = await userNFTs.json();
console.log(nfts);
```

### cURL
```bash
# Health check
curl -X GET https://api.exemplo.com/api/health

# Estatísticas do token
curl -X GET https://api.exemplo.com/api/token/stats

# Saldo de tokens
curl -X GET https://api.exemplo.com/api/token/balance/0x...
```

### Python (requests)
```python
import requests

# Obter overview do usuário
response = requests.get('https://api.exemplo.com/api/user/0x.../overview')
data = response.json()
print(data)
```

## 🔄 Webhooks (Futuro)

### Eventos Suportados
- `nft.minted`: NFT mintado
- `token.claimed`: Token reivindicado
- `whitelist.added`: Usuário adicionado à whitelist
- `contract.paused`: Contrato pausado

### Formato do Webhook
```json
{
  "event": "nft.minted",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "data": {
    "tokenId": "1",
    "owner": "0x...",
    "name": "Meu NFT"
  }
}
```

---

**Nota**: Esta documentação é atualizada regularmente. Para a versão mais recente, consulte o repositório do projeto.

