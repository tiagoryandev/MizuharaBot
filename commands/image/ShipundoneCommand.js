const Discord = require("discord.js"); // Exporta a dependência da discord.js
const fetch = require("node-fetch"); // Exporta a dependência do node-fetch

module.exports = {
    name: "shipundone", // Nome principal do comando
    description: "Comando para mostrar você distraido com outro usuário.", // Descrição do comando
    aliases: ["namoradodistraido"], // Apelidos do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        const autor = message.author; // Pega o autor da mensagem
        const mention = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Pega o usuário por menção, id ou o autor

        let avatar_author = autor.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }); // Pega o avatar do autor
        let avatar_user = mention.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }); // Pega o avatar do usuário mencionado

        message.channel.startTyping(); // Inicia uma string no canal

        fetch(`https://nekobot.xyz/api/imagegen?type=ship&user1=${avatar_user}&user2=${avatar_author}`)
            .then(res => res.json())
            .then(data => message.channel.send(`${message.author}`, new Discord.MessageAttachment(data.message, 'shipundone.png'))); // Faz a requisição na api do comando usando o nodefetch

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa