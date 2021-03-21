const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "servericon", // Nome principal do comando
    description: "Comando para mostrar a imagem do servidor.", // Descrição do comando
    aliases: ["iconserver"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let icon = message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 }); // Pega o link da imagem do servidor

        const embed = new Discord.MessageEmbed()
            .setColor(colors.default)
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 }))
            .setDescription(`Para ver o link da logo desse servidor, [Aperte Aqui](${icon})!`)
            .setImage(icon)
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setTimestamp(); // Define a embed com o icone do servidor

        message.channel.send(`${message.author}`, embed); // Envia a mensagem mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações