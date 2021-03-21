const Discord = require('discord.js'); // Exporta a dependência da discord.js
const jimp = require("jimp"); // Exporta a dependência do jimp

module.exports = {
    name: "laranjo", // Nome principal do comando
    description: "Comando de imagem com frase do Laranjo.", // Descrição do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Conteúdo]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        if (message.content.split(' ').slice(1).join(' ').length < 1) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever uma fraze ou palavra de no maximo **50 letras**!`); // Notifica o autor que faltou os argumentos
        } else {
            if (message.content.split(' ').slice(1).join(' ').length > 50) {
                return message.channel.send(`${emojis.IconCross} **|** ${message.author}, o limite maximo de **50 letras** na sua frase!`); // Notifica ao autor que a frase é muito grande
            } else {
                var authorMessage = message; // Pega a mensagem do autor
                
                message.channel.startTyping(); // Inicia uma string no canal
                
                jimp.read(`https://media.discordapp.net/attachments/689750456695914586/691077705071984710/295364123043211.png?width=540&height=482`, function (err, image) {
                    jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(function (font) {
                        image.print(font, 23, 310, authorMessage.content.split(' ').slice(1).join(' '), 320); // Escreve a frase no laranjo
                        image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                            message.channel.send(`${message.author}`, new Discord.MessageAttachment(buffer, 'laranjo.png')); // Envia a imagem mencionando oa autor
                            message.channel.stopTyping(true); // Para a string no canal
                        }); // Envia a imagem no canal 
                    }); // Escreve o conteúdo na imagem
                }); // Faz a busca da imagem
            }; // Verifica se os argumentos passam do limite
        }; // Verifica se o autor colocou os argumentos
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa