const Discord = require("discord.js"); // Exporta a dependência da Discord.js
const moment = require('moment'); // Exporta a dependência da moments
moment.locale('pt-BR'); // Define o idioma da moments como pt-br

module.exports = {
    name: "userinfo", // Nome principal do comando
    description: "Comando para mostrar as informações do usuário.", // Descrição do comando
    aliases: ["infouser"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Busca a informação de usuário

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member; // Busca a informações de membro

        const bagde = {
            'DISCORD_EMPLOYEE': emojis.BadgeEmployee,
            'DISCORD_PARTNER': emojis.BadgePartner,
            'HYPESQUAD_EVENTS': emojis.BadgeHypesquard,
            'BUGHUNTER_LEVEL_1': emojis.BadgeBughunter,
            'HOUSE_BRAVERY': emojis.BadgeBravery,
            'HOUSE_BRILLIANCE': emojis.BadgeBrilliance,
            'HOUSE_BALANCE': emojis.BadgeBalance,
            'EARLY_SUPPORTER': emojis.BadgeEarlySupporter,
            'BUGHUNTER_LEVEL_2': emojis.BadgeBughunterCanary,
            'VERIFIED_DEVELOPER': emojis.BadgeVerifiedBotDeveloper
        }; // Lista de insignias de usuários

        const status = {
            online: `${emojis.StatusOnline} Online`,
            idle: `${emojis.StatusIdle} Ausente`,
            dnd: `${emojis.StatusDnd} Não Pertube`,
            offline: `${emojis.StatusOffline} Offline`
        }; // Define a busca dos status do usuário

        const mapbagde = Object.entries(user.flags.serialize()).filter(f => f[1]).map(f => f[0]).map(f => bagde[f]).join(' '); // Mapeamento de insignias que os usuários tem
        const customStatus = member.presence.activities.filter(a => a.type === 'CUSTOM_STATUS'); // Verifica se o membro está com status
        const games = member.presence.activities.filter(a => a.type === 'PLAYING').map(a => a.name); // Verifica se o membro está jogando um jogo

        const embed = new Discord.MessageEmbed()
            .setTitle(`${mapbagde} ${user.username}`)
            .setColor(colors.default)
			.setFooter
            .setDescription(`${emojis.IconChannel} **INFORMAÇÕES DO USUÁRIO:**` +
                `\n> :bookmark: Usuário: \`${user.tag}\`` +
                `\n> :computer: ID do Discord: \`${user.id}\`` +
                `\n> :date: Conta criada há: \`${moment(user.createdAt).format("LL")}\`` +
                `\n> :watch: Status: ${status[user.presence.status]}` +
                `\n\n${emojis.IconSearch} **INFORMAÇÕES DO MEMBRO:**` +
                `\n> :star2: Entrou no servidor há: \`${moment(member.joinedAt).format("LL LTS")}\`` +
                `\n> 📜 Maior Cargo: <@&${member.roles.highest.id}>` +
                `\n> 🕵️ Apelido: ${member.nickname ? `\`${member.nickname}\`` : '``Sem apelido``'}` +
                `\n> 🏷️ Status Customizados: \`${customStatus.length === 0 ? 'Sem Status no Momento' : customStatus[0].state === null ? 'Sem Status no Momento' : customStatus[0].state}\`` +
                `\n> 🎮 Jogando: \`${games.length === 0 ? 'Nada no Momento' : games.join('\n')}\``)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048 })); // Define a embed com as informações do usuário

        message.channel.send(`${message.author}`, embed); // Envia a mensagem com as informações por embed
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações