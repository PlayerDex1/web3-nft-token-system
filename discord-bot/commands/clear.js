const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa mensagens do canal')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Número de mensagens para deletar (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Deletar mensagens apenas de um usuário específico')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    
    async execute(interaction) {
        const amount = interaction.options.getInteger('quantidade');
        const targetUser = interaction.options.getUser('usuario');

        if (amount < 1 || amount > 100) {
            return await interaction.reply({ 
                content: '❌ A quantidade deve estar entre 1 e 100!', 
                ephemeral: true 
            });
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            let messagesToDelete = messages;

            if (targetUser) {
                messagesToDelete = messages.filter(msg => msg.author.id === targetUser.id);
            }

            // Filtrar mensagens muito antigas (14 dias)
            const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
            messagesToDelete = messagesToDelete.filter(msg => msg.createdTimestamp > twoWeeksAgo);

            if (messagesToDelete.size === 0) {
                return await interaction.reply({ 
                    content: '❌ Nenhuma mensagem encontrada para deletar!', 
                    ephemeral: true 
                });
            }

            await interaction.channel.bulkDelete(messagesToDelete);

            const clearEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🧹 Mensagens Deletadas')
                .addFields(
                    { name: '📊 Quantidade', value: messagesToDelete.size.toString(), inline: true },
                    { name: '👤 Filtro', value: targetUser ? `Apenas ${targetUser.username}` : 'Todas as mensagens', inline: true },
                    { name: '👮 Moderador', value: interaction.user.username, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação' });

            const reply = await interaction.reply({ 
                embeds: [clearEmbed],
                fetchReply: true 
            });

            // Deletar a mensagem de confirmação após 5 segundos
            setTimeout(() => {
                reply.delete().catch(console.error);
            }, 5000);

        } catch (error) {
            console.error('Erro ao limpar mensagens:', error);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao limpar as mensagens!', 
                ephemeral: true 
            });
        }
    },
};