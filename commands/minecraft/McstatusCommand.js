const Discord = require("discord.js"); // Faz a exportação da dependência da discord.js
const fetch = require("node-fetch"); // Faz a exportação da dependência do node-fetch

module.exports = {
    name: "mcstatus", // Nome principal do comando
    description: "Comando para ver os status de um servidor no minecraft.", // Descrição do comando
    aliases: ["mcserverstatus"], // Apelidos do comando
    category: "mc", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servido
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[IP do Servidor]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let server = args[0]; // Pega o primeiro argumento do comando

        if (!server) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa colocar o **IP**s do servidor que você deseja ver!`); // Notifica o autor que não colocou os argumentos
        }; // Verifica se o autor colocou o argumento

        fetch(`https://api.mcsrvstat.us/2/${server}`)
            .then(res => res.json())
            .then(body => {
                if (body.debug.ping == false || body.ip == "") {
                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, o servidor que você solicitou não foi encontrado!`);
                } else {
                    let status; // Define os status para mostrar o servidor

                    if (body.online == true) {
                        status = `${emojis.StatusOnline} Online`
                    } else {
                        status = `${emojis.StatusOffline} Offline`;
                    }; // Verifica os status do servidor

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`${args[0]}`)
                        .setColor(colors.default)
                        .setDescription(`${emojis.PublicCommunity} **| INFORMAÇÕES DO SERVIDOR**:` +
                            `\n> :desktop: **Nome**: \`${body.hostname}\`` +
                            `\n> :electric_plug: **IP**: \`${body.ip}\`` +
                            `\n> :door: **Porta**: \`${body.port}\`` +
                            `\n> :satellite: **Status**: ${status}` +
                            `\n> :game_die: **Versão**: \`${body.version}\`` +
                            `\n> :busts_in_silhouette: **Jogadores**: \`[ ${body.players.online} / ${body.players.max} ]\``)
                        .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                        .setImage("http://status.mclive.eu/Server/" + body.ip + "/" + body.port + "/banner.png")
                        .setTimestamp(); // Define a embed com as informações do servidor

                    return message.channel.send(`${message.author}`, embed); // Envia a mensagem mencionando o autor
                }; // Verifica se foi encontrado o servidor
            }); // Busca do body do site com as informações em json sobre o servidor na api
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações