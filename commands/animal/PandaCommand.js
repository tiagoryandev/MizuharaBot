const fetch = require("node-fetch"); // Exporta a dependência do node-fetch
const Discord = require("discord.js"); // Exporta a dependência do discord.js

module.exports = {
    name: "panda", // Nome principal do comando
    description: "Comando para mostrar imagens de pandas.", // Descrição do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let data = await fetch(`https://some-random-api.ml/img/panda`).then(rep => rep.json()); // Faz a busca da api e envia em json

        message.channel.startTyping(); // Inicia uma string no canal

        const embed = new Discord.MessageEmbed()
            .setColor(colors.default)
            .setDescription(`Caso queira abaixar essa imagem, [Aperte Aqui!](${data.link})`)
            .setImage(data.link)
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com a imagem

        message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa