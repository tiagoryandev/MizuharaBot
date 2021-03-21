const Discord = require("discord.js"); // Exporta a dependência da discord.js
const client_neko = require('nekos.life'); // Exporta a dependência da nekos life
const neko = new client_neko(); // Cria um cliente para fazer a requisição na api

module.exports = {
    name: "slap", // Nome principal do comando
    description: "Comando para lançar um tapa em um membro.", // Descrição do comando
    aliases: ["tapa"], // Apelidos do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let user = message.mentions.users.first() || client.users.cache.get(args[0]); // Busca o membro pela menção ou id

        if (!user) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa mencionar uma pessoa para você bater!`); // Notifica o autor sobre a falta de menção
        }; // Verifica se o autor colocou a menção

        if (user.id == client.user.id) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode me bater, seu machista!`); // Notifica ao autor que não pode mencionar a Mizuhara
        }; // Verifca se a menção é a Mizuhara

        let img = await neko.sfw.slap(); // Busca a imagem na api de imagens

        const embed = new Discord.MessageEmbed()
            .setColor(colors.default)
            .setDescription(`${message.author} lançou um tapa em ${user}!`)
            .setImage(img.url)
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Defien a embed com a imagem 

        message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o usuário
    }, // Executa pcódigo do comando
}; // Exporta o comando com todas as configurações e informaçõesa