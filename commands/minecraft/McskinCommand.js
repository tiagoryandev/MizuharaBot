const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "mcskin", // Nome principal do comando
    description: "Comando para prequisar um skin do minecraft a sua escolha.", // Descrição do comando
    aliases: ["mcskinminecraft"], // Apelidos do comandos
    category: "mc", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Nome da Skin]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        if (!args[0]) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, escreva o nome da sua skin que você deseja pesquisar!`); // Notifica ao autor que ele não colocou os argumentos
        }; // Verifica se o autor colocou o nome da skin

        let embed = new Discord.MessageEmbed()
            .setDescription(`${emojis.IconLink} **|** Caso queira abaixar a **Skin**, [Aperte Aqui](https://mc-heads.net/skin/${args[0]})!`)
            .setImage(`https://mc-heads.net/skin/${args[0]}`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor(colors.default); // Define a embed com as informações em embed

        message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa