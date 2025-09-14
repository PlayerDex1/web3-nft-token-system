# 🤖 Instruções de Configuração do Bot Discord

## ⚠️ IMPORTANTE: Token Necessário

O valor que você forneceu (`2d6bd4aa99ad4426a151d30ac2110b2204e9a69686d9e95555530ab33ee49b0a`) parece ser uma **chave pública** ou **client ID**, mas precisamos do **token do bot**.

## 🔑 Como Obter o Token do Bot

### 1. Acesse o Discord Developer Portal
- Vá para [https://discord.com/developers/applications](https://discord.com/developers/applications)
- Faça login com sua conta Discord

### 2. Crie uma Nova Aplicação (se ainda não tiver)
- Clique em "New Application"
- Dê um nome para seu bot (ex: "Meu Bot Incrível")
- Clique em "Create"

### 3. Obtenha o Token do Bot
- Na sua aplicação, vá para a aba **"Bot"** (no menu lateral)
- Clique em **"Add Bot"** (se ainda não tiver criado)
- Na seção **"Token"**, clique em **"Copy"**
- ⚠️ **NUNCA COMPARTILHE ESTE TOKEN!** Ele é secreto!

### 4. Configure as Permissões do Bot
- Na aba **"OAuth2"** > **"URL Generator"**
- Marque **"bot"** e **"applications.commands"**
- Nas permissões do bot, selecione:
  - ✅ Send Messages
  - ✅ Use Slash Commands
  - ✅ Manage Messages
  - ✅ Kick Members
  - ✅ Ban Members
  - ✅ Moderate Members
  - ✅ Read Message History
  - ✅ View Channels
  - ✅ Read Message History
  - ✅ Add Reactions

### 5. Convide o Bot para seu Servidor
- Copie a URL gerada
- Cole no navegador e autorize o bot
- Selecione o servidor onde quer adicionar o bot

## 🔧 Configuração do Projeto

### 1. Atualize o arquivo .env
```env
# Substitua pelo TOKEN REAL do bot (não a chave pública)
DISCORD_TOKEN=SEU_TOKEN_REAL_AQUI

# ID do servidor (opcional, mas recomendado)
GUILD_ID=1394048568326619278

# Outras configurações
PREFIX=!
BOT_NAME=MeuBot
BOT_VERSION=1.0.0
```

### 2. Execute o Bot
```bash
# Registrar comandos e iniciar bot
npm start

# Ou apenas registrar comandos
npm run deploy

# Modo desenvolvimento (reinicia automaticamente)
npm run dev
```

## 🎯 Comandos Disponíveis

Após configurar corretamente, você terá acesso a:

### 📊 Informações
- `/ping` - Latência do bot
- `/userinfo` - Info de usuários
- `/serverinfo` - Info do servidor

### 🎮 Entretenimento
- `/8ball` - Bola mágica
- `/dice` - Rolar dados
- `/joke` - Piadas
- `/avatar` - Avatar de usuários

### 🛡️ Moderação
- `/kick` - Expulsar usuários
- `/ban` - Banir usuários
- `/timeout` - Silenciar usuários
- `/clear` - Limpar mensagens

### 🔧 Utilitários
- `/poll` - Criar votações

## 🚨 Solução de Problemas

### Erro 401: Unauthorized
- ❌ Token incorreto ou inválido
- ✅ Verifique se copiou o token correto da aba "Bot"

### Bot não responde
- ❌ Bot não foi convidado para o servidor
- ✅ Use a URL do OAuth2 para convidar o bot

### Comandos não aparecem
- ❌ Comandos não foram registrados
- ✅ Execute `npm run deploy` primeiro

### Erro de permissões
- ❌ Bot não tem permissões necessárias
- ✅ Reconvide o bot com as permissões corretas

## 📋 Checklist de Configuração

- [ ] ✅ Aplicação criada no Discord Developer Portal
- [ ] ✅ Bot criado e token copiado
- [ ] ✅ Token atualizado no arquivo .env
- [ ] ✅ Bot convidado para o servidor com permissões
- [ ] ✅ Comandos registrados (`npm run deploy`)
- [ ] ✅ Bot iniciado (`npm start`)

## 🎉 Próximos Passos

1. **Configure o token correto**
2. **Execute `npm run deploy`** para registrar comandos
3. **Execute `npm start`** para iniciar o bot
4. **Teste os comandos** no Discord
5. **Personalize** conforme necessário

---

**Precisa de ajuda?** Verifique se seguiu todos os passos acima!