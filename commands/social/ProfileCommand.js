const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const jimp = require("jimp"); // Exporta a dependência do jimp
const numberFormatter = require("number-formatter"); // Exporta a dependência do number-formatter para formatção
const database = firebase.database(); // Exporta a função de banco de dados do firebase

module.exports = {
    name: "profile", // Nome principal do comando
    description: "Comando para mostrar o perfil de um usuário em imagem.", // Descrição do comando
    aliases: ["perfil"], // Apelidos do comando
    category: "social", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 10, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Faz a busca do usuário por menção, id ou o autor

        database.ref(`Social/${user.id}`).once("value").then(async function (db) {
            if (db.val() == null) {
                database.ref(`Social/${user.id}`).set({
                    tag: user.tag,
                    avatar: user.displayAvatarURL({ format: "png", size: 256 }),
                    sobremim: "Não definido.",
                    background: "https://i.pinimg.com/originals/0e/44/a9/0e44a9916e6fe6368a9f68774e5b64e2.jpg",
                    yen: 0,
                    rep: 0,
                    upvote: 0
                }); // Seta no banco de dados os dados do usuário

                message.channel.startTyping(); // Inicia uma string no canal

                let modelo = await jimp.read("./assets/profilemodel/blackmodel.png"); // Busca a imagem do modelo de perfil 
                let font = await jimp.loadFont("./assets/fonts/BenasNeue/benas_neue_43.fnt"); // Busca a fonte para o nomero de yens
                let desc = await jimp.loadFont("./assets/fonts/BenasNeue/benas_neue_20.fnt"); // Busca a fonte para a descriçã
                let mask = await jimp.read("./assets/profilemodel/mask.png"); // Busca a mascara de recorte
                let background = await jimp.read("https://i.pinimg.com/originals/0e/44/a9/0e44a9916e6fe6368a9f68774e5b64e2.jpg"); // Busca o fundo da imagem

                jimp.read(user.displayAvatarURL({ format: "png", size: 256 })).then(avatar => {
                    avatar.resize(169, 169); // Redimenciona o avatar 
                    mask.resize(169, 169); // Redimenciona a mascara
                    avatar.mask(mask); // Inseri a mascara no avatar
                    modelo.composite(avatar, 8.6, 8.6); // Adiciona o avatar no modelo
                    modelo.print(font, 319, 20, `¥${numberFormatter("#,##0.00", 0)}`); // Escreve a quantidade de yens do usuário
                    modelo.print(desc, 6, 396, `Não definido.`, 682); // Escreve a biografia do usuário
                    background.resize(700, 500); // Redimenciona o background
                    background.composite(modelo, 0, 0); // Adiciona o modelo no background
                    background.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                        message.channel.send(`${emojis.IconFigurines} **|** ${message.author}`, new Discord.MessageAttachment(buffer, "profile.png")); // Envia a imagem mencionando oa autor
                        message.channel.stopTyping(true); // Para a string no canal
                    }); // Envia a imagem no canal com o buff
                }); // Realiza a manupulação de imagem para o perfil
            } else {
                database.ref(`Social/${user.id}`).update({
                    tag: user.tag,
                    avatar: user.displayAvatarURL({ format: "png", size: 256 })
                }); // Faz a atualização dos dados como tag e avatar

                message.channel.startTyping(); // Inicia uma string no canal
                
                let modelo = await jimp.read("./assets/profilemodel/blackmodel.png"); // Busca o modelo de perfil
                let font = await jimp.loadFont("./assets/fonts/BenasNeue/benas_neue_43.fnt"); // Busca a fonte para a quantidade de yens
                let desc = await jimp.loadFont("./assets/fonts/BenasNeue/benas_neue_20.fnt"); // Busca a fonte para a biografia do usuário
                let mask = await jimp.read("./assets/profilemodel/mask.png"); // Busca a mascara de corte
                let background = await jimp.read(db.val().background); // Busca no banco de dados o background

                jimp.read(user.displayAvatarURL({ format: "png", size: 256 })).then(avatar => {
                    avatar.resize(169, 169); // Redimenciona o avatar
                    mask.resize(169, 169); // Redimenciona a mascara
                    avatar.mask(mask); // Corta o avatar com a mascara
                    modelo.composite(avatar, 8.6, 8.6); // Adiciona o avatar no modelo
                    modelo.print(font, 319, 20, `¥${numberFormatter("#,##0.00", db.val().yen)}`); // Escreve a quantidade de yens do usuário
                    modelo.print(desc, 6, 396, `${db.val().sobremim}`, 682); // Escreve a biografia do usuário
                    background.resize(700, 500); // Redimenciona o background
                    background.composite(modelo, 0, 0); // Adiciona o modelo no background
                    background.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                        message.channel.send(`${emojis.IconFigurines} **|** ${message.author}`, new Discord.MessageAttachment(buffer, "profile.png")); // Envia a imagem mencionando oa autor
                        message.channel.stopTyping(true); // Para a string no canal
                    }); // Envia a imagem no canal 
                }); // Faz a manipulação de imagem do perfil
            }; // Verifica se o usuário está no banco de dados
        }); // Faz a busca do usuário no banco de dados
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa