const Discord = require("discord.js"); // Exporta a dependência da discord.js
const numberFormatter = require("number-formatter"); // Exporta a dependência do number-formatter para formatção

module.exports = {
    name: "upvote", // Nome principal do comando
    description: "Comando para realizar o seu voto na Mizuhara.", // Descrição do comando
    aliases: ["votar"], // Apelidos do comando
    category: "social", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor(colors.default)
            .setDescription(`:pencil: **|** Caso você queira votar em mim, você pode ir no **Link** abaixo e realizar o seu voto! \n:yen: **|** E como agradecimento, você recebe quantia de \`¥${numberFormatter("#,##0.00", 1000)} Ienis\` na sua carteira!\n\n${emojis.IconLink} • [Vote Agora!](https://zuraaa.com/bots/694270851008167976/votar)`)
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setTimestamp(); // Define a embed com as informações
        
        message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa