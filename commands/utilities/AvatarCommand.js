const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "avatar", // Nome principal do comando
    description: "Comando para mostrar o avatar de um usuário.", // Descrição do comando
    aliases: ["icon"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Busca o autor por menção, id ou o mesmo autor

        let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }); // Puxa o avatar do usuário mencionado

        let embed = new Discord.MessageEmbed()
            .setColor(colors.default) 
            .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })) 
            .setDescription(`Caso queira baixar a foto, aperte [aqui](${avatar})`)
            .setImage(avatar)
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com as informações do avatar do usuário
        
        await message.channel.send(`${message.author}`, embed); // Envia a embed no canal mencionado o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações