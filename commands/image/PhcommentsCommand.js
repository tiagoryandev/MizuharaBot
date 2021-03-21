const Discord = require('discord.js'); // Exporta a dependência da discord.js
const fetch = require("node-fetch"); // Exporta a dependência do node-fetch

module.exports = {
    name: "phcomments", // Nome principal do comando
    description: "Comando para imagem de comentários do PornHub coom a sua foto, username e descrição.", // Descrição do comando
    aliases: ["phcomentarios"], // Apelidos do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Conteúdo]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let user = message.mentions.users.first(); // Busca o usuário na mensagem

        let text; // Define o texto como nulo

        if (user) {
            text = args.slice(1).join(' '); // Define os argumentos depois da menção
        } else {
            user = message.author; // Se não tiver menção ou id, o user é o autor
            text = args.join(' '); // Define os argumentos da mensagem        
        }; // Verifica se o autor mencionou um membro

        message.channel.startTyping(); // Inicia uma string no canal

        fetch(`https://nekobot.xyz/api/imagegen?type=phcomment&image=${user.displayAvatarURL()}&text=${encodeURIComponent(text)}&username=${user.username}`)
            .then(res => res.json())
            .then(data => message.channel.send(`${message.author}`, new Discord.MessageAttachment(data.message, 'phcomments.png'))); // Faz a requisição na api do comando usando o nodefetch

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa