const Discord = require("discord.js"); // Exporta a dependência da discord.js
const moment = require("moment"); // Exporta a dependência do moment
moment.locale('pt-BR'); // Define o idioma para pt-br

module.exports = {
    name: "serverinfo", // Nome principal do comando
    description: "Comando para mostrar as informações do seu servidor.", // Descrição do comando
    aliases: ["infoserver"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        const verificationLevels = {
            NONE: 'Nenhuma',
            LOW: 'Baixa',
            MEDIUM: 'Media',
            HIGH: 'Alta',
            VERY_HIGH: 'Muito Alta'
        }; // Define o nivel de verificação do seu servidor

        const filterLevels = {
            DISABLED: 'Desativada',
            MEMBERS_WITHOUT_ROLES: 'Analizar Midia de Membros sem Cargos',
            ALL_MEMBERS: 'Analizar todos os Membros'
        }; // Define o filtro de verificação de midia

        let onlines = `${message.guild.members.cache.filter(member => member.user.presence.status === "online").size}`; // Filtra os membros que estão online
        let idles = `${message.guild.members.cache.filter(member => member.user.presence.status === "idle").size}`; // Filtra os membros que estão ausentes
        let dnds = `${message.guild.members.cache.filter(member => member.user.presence.status === "dnd").size}`; // Filtra os membros que estão não pertube
        let offlines = `${message.guild.members.cache.filter(member => member.user.presence.status === "offline").size}`; // Filtra os membros que estão offline

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor(colors.default)
            .setThumbnail(message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 }))
            .setImage(`https://cdn.discordapp.com/splashes/${message.guild.id}/${message.guild.splash}.png?size=2048`)
            .setDescription(`${emojis.PublicCommunity} **|** **INFOMAÇÕES GERAIS**:` +
            `\n> :computer: ID do Discord: \`${message.guild.id}\`` +
            `\n> :file_cabinet: Shard ID: \`${message.guild.shardID}\`` +
            `\n> ${emojis.OwnerServer} Dono: \`${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}/${message.guild.owner.user.id}\`` +
            `\n> :date: Data de Criação: \`${moment(message.guild.createdAt).format("LL")}\`` +
            `\n> :busts_in_silhouette: Membros Totais: \`${message.guild.memberCount}\`` +
            `\n> :books: Canais Totais: \`${message.guild.channels.cache.size}\`` +
            `\n> :label: Cargos Totais: \`${message.guild.roles.cache.size}\`` +
            `\n> :grinning: Emojis Totais: \`${message.guild.emojis.cache.size}\`` +
            `\n> ${emojis.StatusOnline} Onlines: \`${onlines}\`` +
            `\n> ${emojis.StatusIdle} Ausentes: \`${idles}\`` +
            `\n> ${emojis.StatusDnd} Não Pertube: \`${dnds}\`` +
            `\n> ${emojis.StatusOffline} Offline/Invisíveis: \`${offlines}\`` +
            `\n\n${emojis.ServerDiscovery} **|** **INFORMAÇÕES ADICIONAIS**:` +
            `\n> :shield: Nivel de Verificação: \`${verificationLevels[message.guild.verificationLevel]}\`` +
            `\n> :microscope: Analizador de Midia: \`${filterLevels[message.guild.explicitContentFilter]}\`` +
            `\n> :rocket: Impulsos: \`${message.guild.premiumSubscriptionCount} Impulsos\`` +
            `\n> ${emojis.BoostServer} Nivel Booster: \`${message.guild.premiumTier ? `Nivel ${message.guild.premiumTier}` : 'Nivel 0'}\`` +
            `\n> :calendar_spiral: Entrou no Sevidor: \`${moment(message.member.joinedAt).format("LL")}\``); // Define a embed com as informações do servidor

        message.channel.send(`${message.author}`, embed); // Envia a mensagem com a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações