const Discord = require("discord.js"); // Exporta a dependência da discord.js
const jimp = require("jimp"); // Exporta a dependência do jimp para manipulação de imagem

module.exports = {
    name: "fbi", // Nome principal do comando
    description: "Comando para fazer uma licença da FBI para você.", // Descrição do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Faz a busca do autor por menção, id ou o proprio autor
        
        let font = await jimp.loadFont(jimp.FONT_SANS_16_BLACK); // Exporta a fonte padrão do jimp
        let fundo = await jimp.read("./assets/images/fbimodel.png"); // Exporta a imagem de modelo da licença
        
        message.channel.startTyping(); // Inicia uma string no canal

        jimp.read(user.displayAvatarURL({format: "png"})).then(async (avatar) => {
            avatar.resize(84, 100); // Redimenciona o avatar
            fundo.print(font, 143, 135, user.username); // Escreve na imagem o nome do usuário
            fundo.composite(avatar, 225, 31); // Adiciona o avatar no fundo
            fundo.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                message.channel.send(`${message.author}`, new Discord.MessageAttachment(buffer, "fbi.png")); // Envia a imagem no canal mencionando o autor
            }); // Inicia o processo d buff da imagem
        }); // Faz a minipulção de imagem com o jimp
        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa