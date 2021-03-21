const fetch = require("node-fetch"); // Exporta a dependência do node-fecth
const Discord = require("discord.js"); // Exporta a dependênci da discord.js

module.exports = {
    name: "clyde", // Nome principal do comando
    description: "Comando de imagem do Clyde enviando uma mensagem a sua escolha.", // Descrição do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Conteúdo]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let text = args.join(" "); // Define o texto que será o conteúdo

        if (!text) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever o **Conteúdo** da mensagem para o Clyde falar.`); // Notifica o autor que ele precisa escrever o conteúdo
        }; // Verifica se o autor colocou o primeiro argumento

        message.channel.startTyping(); // Inicia uma string no canal

        fetch(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`)
            .then(res => res.json())
            .then(data => message.channel.send(`${message.author}`, new Discord.MessageAttachment(data.message, 'clyde.png'))); // Faz a requisição na api do comando usando o nodefetch

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa