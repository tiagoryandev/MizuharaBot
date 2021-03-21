const Discord = require('discord.js'); // Exporta a dependência da discord.js
const fetch = require("node-fetch"); // Exporta a dependência do node-fetch

module.exports = {
    name: "faketweet", // Nome principal do comando
    description: "Comando para fazer falsos tweets no Twitter.", // Descrição do comando
    aliases: ["tweetfalso"], // Apelidos do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Nome de Usuário] [Conteúdo]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let user = args[0]; // Define o nome do usuário do twitter

        let text = args.slice(1).join(" "); // Define o texto que será o conteúdo

        if (!user) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever o **Nome** do usuário que você deseja fazer o tweet.`); // Notifica o autor que ele precisa escrever o nome
        }; // Verifica se o autor colocou o primeiro argumento

        if (user.startsWith("@")) {
            user = args[0].slice(1); // Define o args depois do @
        }; // Se o só @, ele irá filtra esse conteúdo

        if (!text) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever o **Conteúdo** para fazer o tweet.`); // Notifica o autor sobre a falta de argumentos
        }; // Verifica se o autor colocou o conteúdo na mensagem

        message.channel.startTyping(); // Inicia uma string no canal

        fetch(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${encodeURIComponent(text)}`)
            .then(res => res.json())
            .then(data => message.channel.send(`${message.author}`, new Discord.MessageAttachment(data.message, 'faketweet.png'))); // Faz a requisição na api do comando usando o nodefetch

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa