const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Cria uma votação no canal')
        .addStringOption(option =>
            option.setName('pergunta')
                .setDescription('Pergunta da votação')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('opcao1')
                .setDescription('Primeira opção')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('opcao2')
                .setDescription('Segunda opção')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('opcao3')
                .setDescription('Terceira opção (opcional)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('opcao4')
                .setDescription('Quarta opção (opcional)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('opcao5')
                .setDescription('Quinta opção (opcional)')
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const question = interaction.options.getString('pergunta');
        const options = [
            interaction.options.getString('opcao1'),
            interaction.options.getString('opcao2'),
            interaction.options.getString('opcao3'),
            interaction.options.getString('opcao4'),
            interaction.options.getString('opcao5')
        ].filter(option => option !== null);

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
        
        let pollDescription = '';
        for (let i = 0; i < options.length; i++) {
            pollDescription += `${emojis[i]} ${options[i]}\n`;
        }

        const pollEmbed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📊 Votação')
            .setDescription(`**${question}**\n\n${pollDescription}`)
            .setTimestamp()
            .setFooter({ text: `Criado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        const pollMessage = await interaction.reply({ 
            embeds: [pollEmbed],
            fetchReply: true 
        });

        // Adicionar reações
        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(emojis[i]);
        }
    },
};