const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Verifica a latência do bot e da API do Discord'),
    
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: '🏓 Calculando latência...', 
            fetchReply: true 
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        const pingEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '📡 Latência do Bot', value: `${latency}ms`, inline: true },
                { name: '🌐 Latência da API', value: `${apiLatency}ms`, inline: true },
                { name: '💓 Status', value: apiLatency < 100 ? '🟢 Excelente' : apiLatency < 200 ? '🟡 Bom' : '🔴 Lento', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Bot de Discord' });
        
        await interaction.editReply({ 
            content: '',
            embeds: [pingEmbed] 
        });
    },
};