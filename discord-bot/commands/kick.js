const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para expulsar')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo da expulsão')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') || 'Nenhum motivo fornecido';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({ 
                content: '❌ Usuário não encontrado neste servidor!', 
                ephemeral: true 
            });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return await interaction.reply({ 
                content: '❌ Você não pode expulsar este usuário!', 
                ephemeral: true 
            });
        }

        if (!member.kickable) {
            return await interaction.reply({ 
                content: '❌ Não posso expulsar este usuário!', 
                ephemeral: true 
            });
        }

        try {
            await member.kick(reason);

            const kickEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('👢 Usuário Expulso')
                .addFields(
                    { name: '👤 Usuário', value: `${user.username} (${user.id})`, inline: true },
                    { name: '👮 Moderador', value: interaction.user.username, inline: true },
                    { name: '📝 Motivo', value: reason, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação' });

            await interaction.reply({ embeds: [kickEmbed] });
        } catch (error) {
            console.error('Erro ao expulsar usuário:', error);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao expulsar o usuário!', 
                ephemeral: true 
            });
        }
    },
};