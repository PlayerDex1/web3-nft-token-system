const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Mostra informações sobre o servidor'),
    
    async execute(interaction) {
        const guild = interaction.guild;
        
        const owner = await guild.fetchOwner();
        const channels = guild.channels.cache;
        const members = guild.members.cache;
        
        const textChannels = channels.filter(channel => channel.type === 0).size;
        const voiceChannels = channels.filter(channel => channel.type === 2).size;
        const categories = channels.filter(channel => channel.type === 4).size;
        
        const humans = members.filter(member => !member.user.bot).size;
        const bots = members.filter(member => member.user.bot).size;
        
        const verificationLevels = {
            0: 'Nenhuma',
            1: 'Baixa',
            2: 'Média',
            3: 'Alta',
            4: 'Muito Alta'
        };

        const serverEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`🏰 ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🆔 ID do Servidor', value: guild.id, inline: true },
                { name: '👑 Dono', value: owner.user.username, inline: true },
                { name: '📅 Criado em', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                { name: '👥 Membros', value: `**${guild.memberCount}** total\n👤 ${humans} humanos\n🤖 ${bots} bots`, inline: true },
                { name: '📺 Canais', value: `**${channels.size}** total\n💬 ${textChannels} texto\n🔊 ${voiceChannels} voz\n📁 ${categories} categorias`, inline: true },
                { name: '🎭 Cargos', value: `${guild.roles.cache.size}`, inline: true },
                { name: '🔒 Nível de Verificação', value: verificationLevels[guild.verificationLevel], inline: true },
                { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
                { name: '🎨 Stickers', value: `${guild.stickers.cache.size}`, inline: true },
                { name: '🌍 Região', value: guild.preferredLocale || 'Não definida', inline: true },
                { name: '📊 Boost', value: `Nível ${guild.premiumTier}\n${guild.premiumSubscriptionCount} boosts`, inline: true },
                { name: '🛡️ Recursos', value: guild.features.length > 0 ? guild.features.slice(0, 5).join(', ') : 'Nenhum', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        if (guild.bannerURL()) {
            serverEmbed.setImage(guild.bannerURL({ size: 512 }));
        }

        await interaction.reply({ embeds: [serverEmbed] });
    },
};