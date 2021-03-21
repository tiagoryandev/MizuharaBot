const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "roleta", // Nome principal do comando
    description: "Comando para fazer a Roleta Russa.", // Descrição do comando
    aliases: ["roletarussa"], // Apelidos do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let random = Math.floor(Math.random() * (5 - 2) + 2); // Define um numero randomico

        if (random === 3) {
            let embed = new Discord.MessageEmbed()
                .setTitle("🔫 **|** ROLETA-RUSSA")
                .setDescription(`**${message.author.username}**, você **Morreu**! 💀`)
                .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                .setColor(colors.default); // Define a embed de morte

            return message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle("🔫 **|** ROLETA-RUSSA")
                .setDescription(`**${message.author.username}**, você **Sobreviveu**! ❤️`)
                .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                .setColor(colors.default); // Define a embed de sobrevivencia

            return message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
        }; // Verifica qual numero deu no random
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa