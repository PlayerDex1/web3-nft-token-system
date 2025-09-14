const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Mostra informações sobre um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para ver informações')
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        
        if (!member) {
            return await interaction.reply({ 
                content: '❌ Usuário não encontrado neste servidor!', 
                ephemeral: true 
            });
        }

        const statusEmojis = {
            online: '🟢',
            idle: '🟡',
            dnd: '🔴',
            offline: '⚫'
        };

        const status = statusEmojis[member.presence?.status] || '⚫';

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.toString())
            .join(', ') || 'Nenhum cargo';

        const permissions = member.permissions.toArray().slice(0, 10).join(', ') || 'Nenhuma permissão especial';

        const userEmbed = new EmbedBuilder()
            .setColor(member.displayHexColor || 0x0099FF)
            .setTitle(`👤 Informações de ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🆔 ID', value: user.id, inline: true },
                { name: '📛 Nome de Usuário', value: user.username, inline: true },
                { name: '🏷️ Apelido', value: member.nickname || 'Nenhum', inline: true },
                { name: '📅 Conta Criada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
                { name: '📥 Entrou no Servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
                { name: '🎭 Status', value: `${status} ${member.presence?.status || 'offline'}`, inline: true },
                { name: '🎨 Cores', value: member.displayHexColor || 'Padrão', inline: true },
                { name: '🤖 Bot', value: user.bot ? 'Sim' : 'Não', inline: true },
                { name: '🔒 Verificado', value: user.verified ? 'Sim' : 'Não', inline: true },
                { name: '👑 Cargos', value: roles.length > 1024 ? roles.substring(0, 1021) + '...' : roles, inline: false },
                { name: '🛡️ Permissões', value: permissions.length > 1024 ? permissions.substring(0, 1021) + '...' : permissions, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [userEmbed] });
    },
};