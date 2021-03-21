const Discord = require("discord.js"); // Exporta a dependência da Discord.js

module.exports = {
    name: "ping", // Nome principal do comando
    description: "Comando para mostrar a Latência da API da Mizuhara e do Servidor.", // Descrição do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    blacklist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        const m = await message.channel.send(`${emojis.IconWifi} **|** Você disse Ping?`).then(msg => msg.delete({timeout: 2000})); // Envia a mensagem e remove depois de 2 segundos
  
        const embed = new Discord.MessageEmbed()
            .setColor(colors.default)
            .setTitle(`${emojis.IconWifi} **|** Latência do Servidor`)
            .setDescription(`Latência do Servidor: **${m.createdTimestamp - message.createdTimestamp}ms**` +
            `\nLatência do API: **${Math.round(client.ws.ping)}ms**`)
            .setFooter(`• API: ${client.user.tag}`, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setTimestamp(); // Define a embed com as informações de ping
 
        setTimeout(() => {  message.channel.send(embed) }, 1000); // Atualiza a mensagem com a embed
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações