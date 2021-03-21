const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Puxa a função de banco de dados

module.exports = {
    name: "sobremim", // Nome principal do comando
    description: "Comando para alterar a sua biografia no seu perfil.", // Descrição do comando
    category: "social", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Conteúdo]", // Modo de uso para usar o comando
    cooldown: 10, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let bio = args.join(" "); // Pega todos os argumentos depois do comando

        if (!bio) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever algo para adiciona na descrição do seu perfil! Que seja no maximo 300 letras!`); // Notifica o autor sobre a falta de argumentos
        }; // Verifica se o autor adicionou os argumentos depois do comando

        if (bio.length > 300) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, a sua descrição passou de **300 letras**, tente encurtar ela!`); // Notifica o autor sobre a quantidade de argumentos passarem de 300 letras
        }; // Verifica se o conteúdo da mensagem passa de 300 letras
    
        database.ref(`Social/${message.author.id}`).once("value").then(async function(db) {
            if (db.val() == null) {
                database.ref(`Social/${message.author.id}`).set({
                    tag: message.author.tag,
                    avatar: message.author.displayAvatarURL({ format: "png", size: 256 }),
                    sobremim: bio,
                    background: "https://i.pinimg.com/originals/0e/44/a9/0e44a9916e6fe6368a9f68774e5b64e2.jpg",
                    yen: 0,
                    rep: 0,
                    upvote: 0
                }); // Seta no banco de dados os dados do usuário

                return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você alterou a sua descrição no seu perfil com sucesso! Use o comando \`${prefix}profile\` para ver o seu perfil!`); // Notifica o autor sobre a alteração de descrição
            } else {
                database.ref(`Social/${message.author.id}`).update({
                    tag: message.author.tag,
                    avatar: message.author.displayAvatarURL({ format: "png", size: 256 }),
                    sobremim: bio
                }); // Atualiza no banco de dados os dados do usuário

                return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você alterou a sua descrição no seu perfil com sucesso! Use o comando \`${prefix}profile\` para ver o seu perfil!`); // Notifica o autor sobre a alteração de descrição
            }; // Verifica se o autor está no banco de dados
        }); // Faz a busca no banco de dados, os dados do autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa