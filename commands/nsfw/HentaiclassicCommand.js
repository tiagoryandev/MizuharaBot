const Discord = require("discord.js"); // Exporta a dependência da discord.js
const client_neko = require('nekos.life'); // Exporta a dependência da nekos life
const neko = new client_neko(); // Cria um cliente para fazer a requisição na api

module.exports = {
    name: "hentaiclassic", // Nome principal do comando
    description: "Comando de imagem de conteúdo +18.", // Descrição do comando
    category: "nsfw", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    nsfw: true, // Apenas para comandos que são usados em canais de NSFW
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let data = await neko.nsfw.classic(); // Faz a busca na api com o conteúdo

        const embed = new Discord.MessageEmbed()
            .setColor(colors.default)
            .setImage(data.url)
            .setFooter(`• Punheteiro: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com a imagem

        message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa