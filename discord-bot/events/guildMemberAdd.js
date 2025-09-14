const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const welcomeChannel = member.guild.channels.cache.find(
            channel => channel.name.includes('welcome') || 
                      channel.name.includes('boas-vindas') ||
                      channel.name.includes('geral')
        );

        if (!welcomeChannel) return;

        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🎉 Bem-vindo ao servidor!')
            .setDescription(`Olá ${member.user.username}! Seja bem-vindo(a) ao **${member.guild.name}**!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '👤 Usuário', value: member.user.username, inline: true },
                { name: '🆔 ID', value: member.user.id, inline: true },
                { name: '📅 Conta criada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Total de membros', value: member.guild.memberCount.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Sistema de Boas-vindas' });

        try {
            await welcomeChannel.send({ 
                content: `Olá ${member}! 👋`,
                embeds: [welcomeEmbed] 
            });
        } catch (error) {
            console.error('Erro ao enviar mensagem de boas-vindas:', error);
        }
    },
};