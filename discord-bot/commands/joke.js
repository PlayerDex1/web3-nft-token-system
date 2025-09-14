const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Conta uma piada aleatória'),
    
    async execute(interaction) {
        const jokes = [
            {
                setup: "Por que os pássaros voam para o sul no inverno?",
                punchline: "Porque é longe demais para ir andando! 😄"
            },
            {
                setup: "O que o pato disse para a pata?",
                punchline: "Vem quá! 🦆"
            },
            {
                setup: "Por que o livro de matemática estava triste?",
                punchline: "Porque tinha muitos problemas! 📚"
            },
            {
                setup: "O que é que a impressora falou para a outra impressora?",
                punchline: "Essa folha é sua ou é impressão minha? 🖨️"
            },
            {
                setup: "Por que o esqueleto não brigou com ninguém?",
                punchline: "Porque não tinha estômago para isso! 💀"
            },
            {
                setup: "O que é que o zero disse para o oito?",
                punchline: "Que cinto legal! 🔢"
            },
            {
                setup: "Por que a plantinha não consegue fazer amigos?",
                punchline: "Porque ela é muito enraizada! 🌱"
            },
            {
                setup: "O que é que o tomate foi fazer no banco?",
                punchline: "Foi tirar extrato! 🍅"
            },
            {
                setup: "Por que o gato não gosta de chuva?",
                punchline: "Porque ele não quer ficar encharcado! 🐱"
            },
            {
                setup: "O que é que a porta falou para a janela?",
                punchline: "Você está sempre aberta para conversa! 🚪"
            }
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        
        const jokeEmbed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('😄 Piada do Dia')
            .addFields(
                { name: '❓', value: randomJoke.setup, inline: false },
                { name: '💡', value: randomJoke.punchline, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [jokeEmbed] });
    },
};