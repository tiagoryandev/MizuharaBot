const fetch = require("node-fetch"); // Exporta a dependência do node-fecth
const Discord = require("discord.js"); // Exporta a dependênci da discord.js

module.exports = {
    name: "baguette", // Nome principal do comando
    description: "Comando de imagem mostrando você comendo um Pão Baguete.", // Descrição do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Busca o usuário por menção, id ou o autor

        let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }); // Pega o avatar do usuário 

        message.channel.startTyping(); // Inicia uma string no canal

        fetch(`https://nekobot.xyz/api/imagegen?type=baguette&url=${avatar}`)
            .then(res => res.json())
            .then(data => message.channel.send(`${message.author}`, new Discord.MessageAttachment(data.message, 'baguette.png'))); // Faz a requisição na api do comando usando o nodefetch

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa