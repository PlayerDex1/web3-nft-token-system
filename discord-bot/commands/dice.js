const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Rola dados')
        .addIntegerOption(option =>
            option.setName('lados')
                .setDescription('Número de lados do dado (padrão: 6)')
                .setMinValue(2)
                .setMaxValue(100)
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de dados para rolar (padrão: 1)')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const sides = interaction.options.getInteger('lados') || 6;
        const quantity = interaction.options.getInteger('quantidade') || 1;
        
        const results = [];
        let total = 0;
        
        for (let i = 0; i < quantity; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            results.push(roll);
            total += roll;
        }
        
        const diceEmojis = {
            1: '⚀',
            2: '⚁',
            3: '⚂',
            4: '⚃',
            5: '⚄',
            6: '⚅'
        };
        
        const resultText = results.map(roll => {
            if (sides === 6 && roll <= 6) {
                return `${diceEmojis[roll]} (${roll})`;
            }
            return `🎲 ${roll}`;
        }).join(' | ');
        
        const diceEmbed = new EmbedBuilder()
            .setColor(0xFF6B6B)
            .setTitle('🎲 Resultado dos Dados')
            .addFields(
                { name: '📊 Configuração', value: `${quantity} dado(s) de ${sides} lados`, inline: true },
                { name: '🎯 Resultados', value: resultText, inline: false },
                { name: '➕ Total', value: quantity > 1 ? total.toString() : 'N/A', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Rolado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [diceEmbed] });
    },
};