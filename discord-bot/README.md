# 🤖 Bot de Discord Completo

Um bot de Discord moderno e completo com comandos de moderação, entretenimento e utilidades.

## ✨ Funcionalidades

### 📊 Comandos de Informação
- `/ping` - Verifica a latência do bot
- `/userinfo` - Informações detalhadas de um usuário
- `/serverinfo` - Informações do servidor

### 🎮 Comandos de Entretenimento
- `/8ball` - Bola mágica 8 para perguntas
- `/dice` - Rola dados personalizáveis
- `/joke` - Conta piadas aleatórias
- `/avatar` - Mostra avatar de usuários

### 🛡️ Comandos de Moderação
- `/kick` - Expulsa usuários do servidor
- `/ban` - Bane usuários do servidor
- `/timeout` - Silencia usuários temporariamente
- `/clear` - Limpa mensagens do canal

### 🔧 Comandos Utilitários
- `/poll` - Cria votações interativas
- Comandos de prefixo: `!ping`, `!help`

### 🎉 Eventos Automáticos
- Mensagens de boas-vindas para novos membros
- Mensagens de despedida para membros que saem
- Status dinâmico do bot

## 🚀 Instalação e Configuração

### 1. Pré-requisitos
- Node.js 16+ instalado
- Conta Discord com bot criado
- Permissões adequadas no servidor

### 2. Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### 3. Configuração do Bot no Discord

1. **Criar Aplicação:**
   - Acesse [Discord Developer Portal](https://discord.com/developers/applications)
   - Clique em "New Application"
   - Dê um nome ao seu bot

2. **Criar Bot:**
   - Vá para a aba "Bot"
   - Clique em "Add Bot"
   - Copie o token e cole no arquivo `.env`

3. **Configurar Permissões:**
   - Vá para a aba "OAuth2" > "URL Generator"
   - Selecione "bot" e "applications.commands"
   - Escolha as permissões necessárias:
     - Send Messages
     - Use Slash Commands
     - Manage Messages
     - Kick Members
     - Ban Members
     - Moderate Members
     - Read Message History
     - View Channels

4. **Convidar Bot:**
   - Use a URL gerada para convidar o bot
   - Ou use: `https://discord.com/api/oauth2/authorize?client_id=SEU_CLIENT_ID&permissions=8&scope=bot%20applications.commands`

### 4. Executar o Bot

```bash
# Iniciar bot (registra comandos e inicia)
npm start

# Modo desenvolvimento (reinicia automaticamente)
npm run dev

# Apenas registrar comandos
npm run deploy

# Apenas iniciar bot
npm run bot
```

## 📋 Comandos Disponíveis

### Informações
| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/ping` | Latência do bot | `/ping` |
| `/userinfo` | Info do usuário | `/userinfo @usuario` |
| `/serverinfo` | Info do servidor | `/serverinfo` |

### Entretenimento
| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/8ball` | Pergunta mágica | `/8ball pergunta` |
| `/dice` | Rolar dados | `/dice lados:6 quantidade:2` |
| `/joke` | Piada aleatória | `/joke` |
| `/avatar` | Avatar do usuário | `/avatar @usuario` |

### Moderação
| Comando | Descrição | Uso | Permissão |
|---------|-----------|-----|-----------|
| `/kick` | Expulsar usuário | `/kick @usuario motivo` | Kick Members |
| `/ban` | Banir usuário | `/ban @usuario motivo dias:0` | Ban Members |
| `/timeout` | Silenciar usuário | `/timeout @usuario minutos:60` | Moderate Members |
| `/clear` | Limpar mensagens | `/clear quantidade:10 @usuario` | Manage Messages |

### Utilitários
| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/poll` | Criar votação | `/poll pergunta opcao1 opcao2` |

## ⚙️ Configuração Avançada

### Variáveis de Ambiente (.env)
```env
# Token do bot (obrigatório)
DISCORD_TOKEN=seu_token_aqui

# ID do servidor (opcional, para comandos mais rápidos)
GUILD_ID=seu_guild_id_aqui

# Prefixo para comandos de texto
PREFIX=!

# Configurações do bot
BOT_NAME=MeuBot
BOT_VERSION=1.0.0
```

### Personalização

1. **Adicionar Novos Comandos:**
   - Crie arquivo em `commands/nome.js`
   - Use o template dos comandos existentes
   - Execute `npm run deploy` para registrar

2. **Modificar Eventos:**
   - Edite arquivos em `events/`
   - Reinicie o bot para aplicar mudanças

3. **Personalizar Mensagens:**
   - Edite os embeds nos comandos
   - Modifique cores, textos e emojis

## 🛠️ Estrutura do Projeto

```
discord-bot/
├── commands/           # Comandos slash
│   ├── ping.js
│   ├── userinfo.js
│   ├── 8ball.js
│   └── ...
├── events/             # Eventos do bot
│   ├── ready.js
│   ├── guildMemberAdd.js
│   └── ...
├── utils/              # Utilitários
├── config/             # Configurações
├── index.js            # Arquivo principal
├── start.js            # Script de inicialização
├── deploy-commands.js  # Registro de comandos
├── package.json
└── README.md
```

## 🔧 Solução de Problemas

### Bot não responde
- Verifique se o token está correto
- Confirme se o bot tem permissões necessárias
- Verifique se os comandos foram registrados

### Comandos não aparecem
- Execute `npm run deploy`
- Aguarde alguns minutos para propagação global
- Verifique se o bot tem permissão "Use Slash Commands"

### Erros de permissão
- Verifique as permissões do bot no servidor
- Confirme se o bot tem os cargos necessários
- Verifique se o usuário tem permissões para usar comandos

## 📝 Logs

O bot registra informações importantes no console:
- ✅ Comandos carregados
- 🌐 Servidores conectados
- 👥 Usuários servidos
- 🚀 Status de inicialização

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme as configurações
3. Verifique a documentação do Discord.js
4. Abra uma issue no GitHub

---

**Desenvolvido com ❤️ para a comunidade Discord**