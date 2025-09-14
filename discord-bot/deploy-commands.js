const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Carregar comandos
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Comando carregado: ${command.data.name}`);
    } else {
        console.log(`⚠️  Comando em ${filePath} está faltando propriedades "data" ou "execute"`);
    }
}

// Configurar REST
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy dos comandos
(async () => {
    try {
        console.log(`🚀 Iniciando deploy de ${commands.length} comando(s)...`);

        // Deploy global (demora até 1 hora para propagar)
        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_TOKEN.split('.')[0]),
            { body: commands }
        );

        console.log(`✅ Deploy concluído! ${data.length} comando(s) registrado(s) globalmente.`);
        
        // Deploy para servidor específico (mais rápido)
        if (process.env.GUILD_ID) {
            const guildData = await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_TOKEN.split('.')[0], process.env.GUILD_ID),
                { body: commands }
            );
            
            console.log(`✅ Deploy para servidor concluído! ${guildData.length} comando(s) registrado(s) no servidor.`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao fazer deploy dos comandos:', error);
    }
})();