const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Mostra o avatar de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para mostrar o avatar')
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        
        const avatarEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`🖼️ Avatar de ${user.username}`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '🔗 Links', value: `[PNG](${user.displayAvatarURL({ extension: 'png', size: 512 })}) | [JPG](${user.displayAvatarURL({ extension: 'jpg', size: 512 })}) | [WEBP](${user.displayAvatarURL({ extension: 'webp', size: 512 })})`, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};