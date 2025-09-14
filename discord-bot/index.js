const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Criar cliente do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ]
});

// Coleção de comandos
client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando carregado: ${command.data.name}`);
    } else {
        console.log(`⚠️  Comando em ${filePath} está faltando propriedades "data" ou "execute"`);
    }
}

// Carregar eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Evento carregado: ${event.name}`);
}

// Evento de interação de comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Comando não encontrado: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Erro ao executar comando ${interaction.commandName}:`, error);
        
        const errorMessage = {
            content: '❌ Ocorreu um erro ao executar este comando!',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Evento de mensagens
client.on('messageCreate', async message => {
    // Ignorar mensagens de bots
    if (message.author.bot) return;

    // Comando de prefixo (opcional)
    const prefix = process.env.PREFIX || '!';
    
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Comandos especiais de prefixo
        if (commandName === 'ping') {
            const sent = await message.reply('🏓 Pong!');
            const timeDiff = sent.createdTimestamp - message.createdTimestamp;
            await sent.edit(`🏓 Pong! Latência: ${timeDiff}ms | API: ${client.ws.ping}ms`);
        }

        if (commandName === 'help') {
            const helpEmbed = {
                color: 0x0099FF,
                title: '🤖 Comandos do Bot',
                description: 'Aqui estão todos os comandos disponíveis:',
                fields: [
                    {
                        name: '📊 Informações',
                        value: '`/ping` - Verificar latência\n`/userinfo` - Informações do usuário\n`/serverinfo` - Informações do servidor',
                        inline: true
                    },
                    {
                        name: '🎮 Entretenimento',
                        value: '`/8ball` - Pergunta mágica\n`/dice` - Rolar dados\n`/joke` - Piada aleatória\n`/meme` - Meme aleatório',
                        inline: true
                    },
                    {
                        name: '🛡️ Moderação',
                        value: '`/kick` - Expulsar usuário\n`/ban` - Banir usuário\n`/timeout` - Silenciar usuário\n`/clear` - Limpar mensagens',
                        inline: true
                    },
                    {
                        name: '🔧 Utilitários',
                        value: '`/weather` - Clima de uma cidade\n`/translate` - Traduzir texto\n`/avatar` - Avatar do usuário\n`/poll` - Criar votação',
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Bot criado com ❤️'
                }
            };

            await message.reply({ embeds: [helpEmbed] });
        }
    }
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);

// Tratamento de erros
process.on('unhandledRejection', error => {
    console.error('Erro não tratado:', error);
});

process.on('uncaughtException', error => {
    console.error('Exceção não capturada:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Desligando bot...');
    client.destroy();
    process.exit(0);
});

console.log('🚀 Bot iniciado! Aguardando login...');