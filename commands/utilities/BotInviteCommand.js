const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "botinvite", // Nome principal do comando
    description: "Comando para mostrar o convite para adicionar a Mizuhara no seu Servidor.", // Descrição do comando
    aliases: ["invitebot", "mizuinvite"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        const embed = new Discord.MessageEmbed()
            .setAuthor(`• ${client.user.username} Convite!`, client.user.displayAvatarURL())
            .setDescription(`Caso você ache que sou muito importante para o seu dia, e deseja me adicionar no seu servidor, os Links de convite estão abaixo! Espero que tenha te ajudado. :heart:` +
            `\n\n${emojis.IconLink} **Convite**: [Clique Aqui](${config.invite})` +
            `\n\n${emojis.IconStreaming} **Website**: [www.mizuhara.tk](${config.website})` +
            `\n\n${emojis.IconHelp} **Servidor de Suporte**: [Ajudinha Amorosa](${config.support})`)
            .setColor(colors.default)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setTimestamp(); // Define a embed com os links de convite
        
        message.channel.send(`${message.author}`, embed); // Envia a mensagem com a embed no canal mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações