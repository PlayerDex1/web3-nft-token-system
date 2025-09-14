const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const goodbyeChannel = member.guild.channels.cache.find(
            channel => channel.name.includes('goodbye') || 
                      channel.name.includes('saida') ||
                      channel.name.includes('geral')
        );

        if (!goodbyeChannel) return;

        const goodbyeEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('👋 Usuário saiu do servidor')
            .setDescription(`${member.user.username} saiu do servidor.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '👤 Usuário', value: member.user.username, inline: true },
                { name: '🆔 ID', value: member.user.id, inline: true },
                { name: '📅 Conta criada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Total de membros', value: member.guild.memberCount.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Sistema de Saída' });

        try {
            await goodbyeChannel.send({ embeds: [goodbyeEmbed] });
        } catch (error) {
            console.error('Erro ao enviar mensagem de despedida:', error);
        }
    },
};