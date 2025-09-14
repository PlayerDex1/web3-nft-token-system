const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para banir')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('dias')
                .setDescription('Dias para deletar mensagens (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') || 'Nenhum motivo fornecido';
        const deleteDays = interaction.options.getInteger('dias') || 0;
        const member = interaction.guild.members.cache.get(user.id);

        if (member) {
            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return await interaction.reply({ 
                    content: '❌ Você não pode banir este usuário!', 
                    ephemeral: true 
                });
            }

            if (!member.bannable) {
                return await interaction.reply({ 
                    content: '❌ Não posso banir este usuário!', 
                    ephemeral: true 
                });
            }
        }

        try {
            await interaction.guild.members.ban(user, { 
                reason: reason,
                deleteMessageDays: deleteDays
            });

            const banEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🔨 Usuário Banido')
                .addFields(
                    { name: '👤 Usuário', value: `${user.username} (${user.id})`, inline: true },
                    { name: '👮 Moderador', value: interaction.user.username, inline: true },
                    { name: '📝 Motivo', value: reason, inline: false },
                    { name: '🗑️ Mensagens Deletadas', value: `${deleteDays} dias`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação' });

            await interaction.reply({ embeds: [banEmbed] });
        } catch (error) {
            console.error('Erro ao banir usuário:', error);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao banir o usuário!', 
                ephemeral: true 
            });
        }
    },
};