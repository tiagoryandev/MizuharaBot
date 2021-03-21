const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "help", // Nome principal do comando
    description: "Comando de ajuda para mostrar todos os meus comandos.", // Descrição do comando
    aliases: ["ajuda", "commands", "comandos"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Comando]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        const { commands } = message.client; // Busca a coleção de comandos da Mizuhara
        const data = []; // Cria um array para armazenar os comandos

        if (!args.length) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Painel de Comandos`, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                .setColor(colors.default)
                .setDescription(`Abaixo está todos os meus comandos:` +
                    `\n\n${emojis.BadgeEarlySupporter} **| COMANDOS DE DIVERSÃO - [${commands.filter(command => command.category == "fun").size}]**\n\`${commands.filter(command => command.category == "fun").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n${emojis.BanHammet} **| COMANDOS DE MODERAÇÃO - [${commands.filter(command => command.category == "mod").size}]**\n\`${commands.filter(command => command.category == "mod").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n${emojis.IconSearch} **| COMANDOS DE ULTILIDADES - [${commands.filter(command => command.category == "utils").size}]**\n\`${commands.filter(command => command.category == "utils").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n${emojis.IconConfig} **| COMANDOS DE CONFIGURAÇÕES - [${commands.filter(command => command.category == "config").size}]**\n\`${commands.filter(command => command.category == "config").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n${emojis.IconFigurines} **| COMANDOS DE IMAGENS - [${commands.filter(command => command.category == "image").size}]**\n\`${commands.filter(command => command.category == "image").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n:yen: **| COMANDOS DE SOCIAL - [${commands.filter(command => command.category == "social").size}]**\n\`${commands.filter(command => command.category == "social").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n${emojis.Minecraft} **| COMANDOS DE MINECRAFT - [${commands.filter(command => command.category == "mc").size}]**\n\`${commands.filter(command => command.category == "mc").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n${emojis.IconChannelNSFW} **| COMANDOS DE NSFW - [${commands.filter(command => command.category == "nsfw").size}]**\n\`${commands.filter(command => command.category == "nsfw").map(command => command.name).join('\`, \`')}\`` +
                    `\n\n${emojis.BadgeVerifiedBotDeveloper} **| COMANDOS DE DESENVOLVIMENTO E SUPORTE - [${commands.filter(command => command.category == "dev").size}]**\n\`${commands.filter(command => command.category == "dev").map(command => command.name).join('\`, \`')}\`` +
                    `\n\nUse o comando \`${prefix}help [Comando]\` para ver as informações detalhados de cada comando!`)
                .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com todos os comandos amostra

            return message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
        }; // Caso não exista argumentos na mensagem, ele manda a lista de comandos

        const name = args[0].toLowerCase(); // Pega o primeiro argumento como comando
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name)); // Busca o comando na coleção de comandos da Mizuhara

        if (!command) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, o comando que você solicitou não existe, verifique os argumentos da mensagem!`); // Notifica o autor sobre o comando não existir
        }; // Caso não tenha o comando, ele notifica o autor

        data.push(`${emojis.IconUnread} **Nome:** \`${command.name}\``); // Adiciona o array o nome do comando

        if (command.aliases) data.push(`${emojis.IconComments} **Apelidos:** \`${command.aliases.join('\`, \`')}\``); // Caso tenha apelidos, ele adiciona o array
        if (command.description) data.push(`${emojis.IconChannelFixed} **Descrição:** ${command.description}`); // Caso tenha descrição, ele adiciona o array
        if (command.usage) data.push(`${emojis.IconConfig} **Modo de Uso:** \`${prefix}${command.name} ${command.usage}\``); // Caso tenha modo de uso, ele adiciona no array
        data.push(`:alarm_clock:  **Cooldown:** \`${command.cooldown || 3} segundo(s)\``); // Adiciona no array o cooldown do comando

        const embedzin = new Discord.MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor(colors.default)
            .setTitle(`${emojis.IconSlashCommands} **|** Painel de Ajuda da Mizuhara`)
            .setDescription(data, { split: true })
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com as informações do comando

        message.channel.send(`${message.author}`, embedzin); // Envia a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa