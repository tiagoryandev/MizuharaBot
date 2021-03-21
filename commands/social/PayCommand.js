const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Puxa a função de banco de dados do firebase
const numberFormatter = require("number-formatter"); // Exporta a dependência do number-formatter para formatção

module.exports = {
    name: "pay", // Nome principal do comando
    description: "Comando para realizar pagamentos entre usuário com Yens.", // Descrição do comando
    aliases: ["pagar"], // Apelidos do comando
    category: "social", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Usuário] [Valor]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]); // Faz a busca do usuário pela menção ou id

        if (!user) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa mencionar um membro **Válido** para realizar a transação de **Yens**!`); // Notifica o autor sobre a falta da menção
        }; // Verifica se existe o autor mencionou um usuário valido

        if (user.id == message.author.id) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode fazer uma transação para você mesmo! Mencione outra pessoa para realizar a transação!`); // Notifica o autor sobre não poder se mencionar
        }; // Verifica se o autor se mencionou no comando

        if (user.id == client.user.id) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode fazer uma transação destinada a mim! Já sou rica de amor.`); // Notifica o autor sobre não poder mencionar a Mizuhara
        }; // Verifica se o autor mencionou a mizuhara

        let valor = args[1]; // Pega o segundo argumento da mensagem como o valor

        if (isNaN(valor)) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, o valor que você forneceu para a transação não é válido! Envie um numero maior de **¥${numberFormatter("#,##0.00", 0)}** para realizar a transação!`); // Notifica o autor sobre o valor não ser um numero
        }; // Verifica se o valor é um numero 

        if (valor <= 0) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, o valor que você forneceu é menor que **¥${numberFormatter("#,##0.00", 1)}**, coloque um valor maior!`); // Notifica o autor sobre o valor se menor que 0
        }; // Verifica se o valor e menor que 0

        database.ref(`Social/${message.author.id}`).once("value").then(async function (db) {
            if (db.val() == null) {
                database.ref(`Social/${message.author.id}`).set({
                    tag: message.author.tag,
                    avatar: message.author.displayAvatarURL({ format: "png", size: 256 }),
                    sobremim: "Não definido.",
                    background: "https://i.pinimg.com/originals/0e/44/a9/0e44a9916e6fe6368a9f68774e5b64e2.jpg",
                    yen: 0,
                    rep: 0,
                    upvote: 0
                }); // Seta no banco de dados os dados do usuário

                return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode realizar a transação, pois você não tem **¥${numberFormatter("#,##0.00", parseInt(valor))} Yens**!`); // Notifica o autor sobre a falta de yens
            } else {
                if (db.val().yen < valor) {
                    let rest = parseInt(valor) - db.val().yen; // Faz a divisão do yen restante

                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode realizar a transação, pois você não tem **¥${numberFormatter("#,##0.00", parseInt(valor))} Yens**! Junte **¥${numberFormatter("#,##0.00", rest)} Yens** para realizar a transação`); // Notifica o autor sobre não possuir yens para realizar a transação
                }; // Verifica se o autor tem yen para realizar a transação

                return message.channel.send(`:yen: **|** ${message.author}, você está está solicitando uma transação de **¥${numberFormatter("#,##0.00", valor)} Yens** para o ${user}!\n💸 **|** Para aceitar a transação, você precisam clicar no ✅ para aceitar.`).then(msg => {
                    msg.react("✅"); // Reaji com o emoji de confimação

                    let collect_autor = (reaction, reactor) => reaction.emoji.name === "✅" && reactor.id === message.author.id; // Cria um coletor de emojis de confimação do autor
                    let accept_autor = msg.createReactionCollector(collect_autor)
                        .on("collect", r => {
                            msg.delete(); // Deleta a mensagem de pergunta

                            message.channel.send(`:yen: **|** ${user}, o ${message.author} aceitou a solicitação para uma transação a você de **¥${numberFormatter("#,##0.00", valor)} Yens**!\n💸 **|** Para aceitar a transação, você precisam clicar no ✅ para aceitar.`).then(c => {
                                c.react("✅"); // Reaji com o emoji de confimação

                                let collect_user = (reaction, reactor) => reaction.emoji.name === "✅" && reactor.id === user.id; // Cria um coletor de emojis de confimação do usuário
                                let accept_user = c.createReactionCollector(collect_user)
                                    .on("collect", rr => {
                                        c.delete(); // Deleta a mensagem de pergunta

                                        database.ref(`Social/${user.id}`).once("value").then(async function (data) {
                                            if (data.val() == null) {
                                                database.ref(`Social/${user.id}`).set({
                                                    tag: user.tag,
                                                    avatar: user.displayAvatarURL({ format: "png", size: 256 }),
                                                    sobremim: "Não definido.",
                                                    background: "https://i.pinimg.com/originals/0e/44/a9/0e44a9916e6fe6368a9f68774e5b64e2.jpg",
                                                    yen: parseInt(valor),
                                                    rep: 0,
                                                    upvote: 0
                                                }); // Faz a setagem dos dados do usuário mencionado

                                                database.ref(`Social/${message.author.id}`).update({
                                                    tag: message.author.tag,
                                                    avatar: message.author.displayAvatarURL({ format: "png", size: 256 }),
                                                    yen: db.val().yen - parseInt(valor)
                                                }); // Faz a atualização do autor

                                                return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, a sua transação foi realizada com sucesso! ${user} recebeu **¥${numberFormatter("#,##0.00", valor)} Yens** na carteira dele!`); // Notifica o autor sobre a transação feita com sucesso
                                            } else {
                                                database.ref(`Social/${user.id}`).update({
                                                    tag: user.tag,
                                                    avatar: user.displayAvatarURL({ format: "png", size: 256 }),
                                                    yen: data.val().yen + parseInt(valor)
                                                }); // Faz a atualização dos dados do usuário mencionado

                                                database.ref(`Social/${message.author.id}`).update({
                                                    tag: message.author.tag,
                                                    avatar: message.author.displayAvatarURL({ format: "png", size: 256 }),
                                                    yen: db.val().yen - parseInt(valor)
                                                }); // Faz a atualização do autor

                                                return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, a sua transação foi realizada com sucesso! ${user} recebeu **¥${numberFormatter("#,##0.00", valor)} Yens** na carteira dele!`); // Notifica o autor sobre a transação feita com sucesso
                                            };
                                        }); // Faz a busca do usuário no banco de dados
                                    }); // Crua um evento de coleção de reações
                            }); // Faz a pergunta ao usuário mencionado se ele aceita a transação
                        }); // Cria um coletor e aciona o evento
                }); // Envia a mensagem para a confirmação da transação
            }; // Verifica se o autor está no banco de dados
        }); // Faz a busca no banco de dados o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa