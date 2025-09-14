const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Faz uma pergunta para a bola mágica 8')
        .addStringOption(option =>
            option.setName('pergunta')
                .setDescription('Sua pergunta para a bola mágica')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const question = interaction.options.getString('pergunta');
        
        const responses = [
            '🎯 Sim, definitivamente!',
            '✅ É certo que sim!',
            '👍 Sem dúvida!',
            '🟢 Sim!',
            '👌 Pode contar com isso!',
            '🔮 Conforme eu vejo, sim!',
            '✨ Muito provável!',
            '🌟 Perspectiva boa!',
            '🎉 Sim!',
            '💫 Os sinais apontam para sim!',
            '🤔 Resposta nebulosa, tente novamente!',
            '❓ Pergunte novamente mais tarde!',
            '🔄 Melhor não te dizer agora!',
            '⏰ Não posso prever agora!',
            '🔮 Concentre-se e pergunte novamente!',
            '❌ Não conte com isso!',
            '🚫 Minha resposta é não!',
            '👎 Minhas fontes dizem não!',
            '🔴 Perspectiva não muito boa!',
            '💔 Muito duvidoso!'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const ballEmbed = new EmbedBuilder()
            .setColor(0x800080)
            .setTitle('🎱 Bola Mágica 8')
            .addFields(
                { name: '❓ Pergunta', value: question, inline: false },
                { name: '🔮 Resposta', value: randomResponse, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `Perguntado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [ballEmbed] });
    },
};