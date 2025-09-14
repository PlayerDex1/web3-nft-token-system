const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Silencia um usuário por um tempo determinado')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para silenciar')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('minutos')
                .setDescription('Minutos para silenciar (1-10080)')
                .setMinValue(1)
                .setMaxValue(10080)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do silenciamento')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const minutes = interaction.options.getInteger('minutos');
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
                content: '❌ Você não pode silenciar este usuário!', 
                ephemeral: true 
            });
        }

        if (!member.moderatable) {
            return await interaction.reply({ 
                content: '❌ Não posso silenciar este usuário!', 
                ephemeral: true 
            });
        }

        const timeoutDuration = minutes * 60 * 1000; // Converter para milissegundos

        try {
            await member.timeout(timeoutDuration, reason);

            const timeoutEmbed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('🔇 Usuário Silenciado')
                .addFields(
                    { name: '👤 Usuário', value: `${user.username} (${user.id})`, inline: true },
                    { name: '👮 Moderador', value: interaction.user.username, inline: true },
                    { name: '⏰ Duração', value: `${minutes} minutos`, inline: true },
                    { name: '📝 Motivo', value: reason, inline: false },
                    { name: '🕐 Expira em', value: `<t:${Math.floor((Date.now() + timeoutDuration) / 1000)}:F>`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação' });

            await interaction.reply({ embeds: [timeoutEmbed] });
        } catch (error) {
            console.error('Erro ao silenciar usuário:', error);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao silenciar o usuário!', 
                ephemeral: true 
            });
        }
    },
};