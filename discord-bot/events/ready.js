const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ Bot logado como ${client.user.tag}!`);
        console.log(`🌐 Conectado em ${client.guilds.cache.size} servidor(es)`);
        console.log(`👥 Servindo ${client.users.cache.size} usuário(s)`);
        console.log(`📝 ${client.commands.size} comando(s) carregado(s)`);
        
        // Definir status do bot
        client.user.setPresence({
            activities: [{
                name: 'comandos | /help',
                type: ActivityType.Listening
            }],
            status: 'online'
        });

        // Log de servidores conectados
        client.guilds.cache.forEach(guild => {
            console.log(`📡 Servidor: ${guild.name} (${guild.id}) - ${guild.memberCount} membros`);
        });

        console.log('🚀 Bot está online e pronto para uso!');
    },
};