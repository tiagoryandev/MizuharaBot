const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const numberFormatter = require("number-formatter"); // Exporta a dependência do number-formatter para formatção
const database = firebase.database(); // Puxa a função de banco de dados do firebase

module.exports = {
    name: "yen", // Nome principal do comando
    description: "Comando para mostrar a quantidade de Ienis da sua carteira ou dos outros usuários.", // Descrição do comando
    aliases: ["ieni"], // Apelidos do comando
    category: "social", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Faz a busca do usuário pela menção, id ou o autor

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
                }); // Caso o usuário não esteja no banco de dados, ele irá setar o usuário

                return message.channel.send(`:yen: **|** ${user}, você tem uma quantia de **¥${numberFormatter("#,##0.00", 0)} Ienis** na sua carteira!`); // Envia a mensagem mostrando a quantidade de yen do usuário
            } else {
                database.ref(`Social/${user.id}`).update({
                    tag: user.tag,
                    avatar: user.displayAvatarURL({ format: "png", size: 256 })
                }); // Se não, ele atualiza apenas a tag do usuário

                return message.channel.send(`:yen: **|** ${user}, você tem uma quantia de **¥${numberFormatter("#,##0.00", db.val().yen)} Ienis** na sua carteira!`); // Envia a mensagem mostrando a quantidade de yen do usuário
            }; // Verifica se o usuário está no banco de dados
        }); // Faz a busca no banco de dados a lista de usuários no social
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa