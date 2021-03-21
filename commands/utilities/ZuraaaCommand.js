const fetch = require("node-fetch"); // Exporta a dependência do node-fethh
const Discord = require("discord.js"); // Exporta a dependência da dicod.js
const moment = require("moment"); // Exporta a dependência da moments

module.exports = {
    name: "zuraaa", // Nome principal do comando
    description: "Comando para buscar informações e status de Aplicações no Zuraaa.", // Descrição do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[ID da Aplicação]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let argumentos = args[0]; // Pega o primeiro argumento da mensagem

        if (!argumentos) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa fornecer o **ID** da aplicação que você deseja ver!`); // Notifica o autor sobre a falta de argumentos
        }; // Verifica se o autor forneceu o id da aplicação

        let data = await fetch(`https://api.zuraaa.com/bots/${argumentos}`).then(data => data.json()); // Faz a busca do id fornecido pelo autor na api do zuraaa

        if (data.statusCode == 404) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu não encontrei nenhuma aplicação com o **ID** que você forneceu! Verifique se o **ID** está correto.`); // Notifica o autor que não foi encontrado a aplicação
        }; // verifica se foi encontrado a aplicação com o id

        const status = {
            online: `${emojis.StatusOnline} Online`,
            idle: `${emojis.StatusIdle} Ausente`,
            dnd: `${emojis.StatusDnd} Não Pertube`,
            offline: `${emojis.StatusOffline} Offline`
        }; // Define a busca dos status da aplicação

        let website; // Define o website como null
        if (data.details.website == "" || data.details.website == null) {
            website = "`Sem Website`"; // Se não tem, ele nao retorna o link
        } else {
            website = `[Aperte Aqui](${data.details.website})`; // Caso tenha, ele adiciona o link
        }; // Verifica se possui website

        let otherOwners; // Define outros dono como null
        if (data.details.otherOwners.length <= 0 || data.details.otherOwners == null) {
            otherOwners = "`Não possui outros Donos`"; // Caso não tenha, ele não faz o mapeamento
        } else {
            otherOwners = `<@${data.details.otherOwners.join(`>, <@`)}>`; // Faz o mapeamento dos donos
        }; // Verifica se possui subdonos do bot

        let support; // Define o suporte como null
        if (data.details.supportServer == "" || data.details.supportServer == null) {
            support = "`Não possui Servidor de Suporte`"; // Caso não tenha, ele notifica a falta do servidor
        } else {
            support = `[Suporte](https://discord.gg/${data.details.supportServer})`; // Caso tenha, ele coloca o link do sevidor
        }; // Faz a verifica de servidor de suporte

        const embed = new Discord.MessageEmbed()
            .setAuthor(`• Bot: ${data.username}#${data.discriminator}`, `https://cdn.discordapp.com/avatars/${data._id}/${data.avatar}.png?size=1024`)
            .setColor(colors.default)
            .setDescription(`${emojis.PublicCommunity} **| INFORMAÇÕES GERAIS**:` +
            `\n> :robot: **Aplicação**: \`${data.username}#${data.discriminator}\`` +
            `\n> ${emojis.IconUserID} **ID**: \`${data._id}\`` +
            `\n> ${emojis.OwnerServer} **Dono**: <@${data.owner}>` +
            `\n> :satellite: **Status**: ${status[data.status]}` +
            `\n> ${emojis.IconSlashCommands} **Prefixo**: \`${data.details.prefix}\`` +
            `\n> ${emojis.IconChannel} **Tags**: \`${data.details.tags.join("`, \`")}\`` +
            `\n> ${emojis.IconComments} **Descrição Curta**: ${data.details.shortDescription}` +
            `\n\n${emojis.IconSearch} **| INFORMAÇÕES EXTRAS**:` +
            `\n> :date: **Data de Envio**: ${moment(data.dates.sent).format("LL")}` +
            `\n> :pencil: **Quantidade de Votos**: \`${data.votes.current} Votos\`` +
            `\n> :bookmark: **Livraria**: \`${data.details.library}\`` +
            `\n> :computer: **Website**: ${website}` +
            `\n> ${emojis.IconHelp} **Servidor**: ${support}` +
            `\n> ${emojis.IconUsers} **Outros Donos**: ${otherOwners}` +
            `\n> ${emojis.IconToShare} **Adicione o Bot**: [Add Bot](https://www.zuraaa.com/bots/${data._id}/add)`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${data._id}/${data.avatar}.png?size=1024`)
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setTimestamp(); // Define a embed com as informações da aplicação

        message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa