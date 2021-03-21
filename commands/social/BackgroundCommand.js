const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Puxa a função de banco de dados do firebase
const numberFormatter = require("number-formatter"); // Exporta a dependência do number-formatter para formatção
const background = require("../../json/background.json"); // Pega o arquivo de links para background

module.exports = {
    name: "background", // Nome principal do comando
    description: "Comando para comprar Planos de Fundo para o seu perfil.", // Descrição do comando
    category: "social", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let rand = Math.floor(Math.random() * background.backgounds.length); // Faz uma seleção randomica no array de temas
        let tema = background.backgounds[rand]; // Pega as informações no array selecionado

        const embed = new Discord.MessageEmbed()
            .setColor(colors.default)
            .setDescription(`Você pode comprar esse **Tema de Fundo** para o seu perfil por:` +
                `\n:yen: **| Valor**: \`¥${numberFormatter("#,##0.00", tema.value)}\`` +
                `\n\nPara aceitar, clique no 🛍️ para realizar o pagamento!`)
            .setImage(tema.url)
            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setTimestamp(); // Define a embed com as informações

        message.channel.send(`${message.author}`, embed).then(msg => {
            msg.react("🛍️"); // Adiciona a reação na embed

            let collect_accept = (reaction, user) => reaction.emoji.name === "🛍️" && user.id === message.author.id; // Cria um coletor de emojis de confimação
            let accept = msg.createReactionCollector(collect_accept)
                .on("collect", c => {
                    msg.delete(); // Deleta a embed com o produto

                    database.ref(`Social/${message.author.id}`).once("value").then(async function(db) {
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

                            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode comprar esse plano de fundo, pois você não possui **¥${numberFormatter("#,##0.00", tema.value)}** na sua carteira!`); // Notifica o autor sobre a falta de yens
                        } else {
                            if (db.val().yen < tema.value) {
                                database.ref(`Social/${message.author.id}`).update({
                                    tag: message.author.tag,
                                    avatar: message.author.displayAvatarURL({ format: "png", size: 256 })
                                }); // Faz a atualização dos dados como tag e avatar
                                
                                let rest = tema.value - db.val().yen; // Define a quantidade de yens que faltam para comprar o background

                                return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode comprar esse plano de fundo, pois você não possui **¥${numberFormatter("#,##0.00", tema.value)}** na sua carteira! Junte mais **¥${numberFormatter("#,##0.00", rest)}** para poder comprar!`); // Notifica o autor sobre a falta de yens
                            } else {
                                database.ref(`Social/${message.author.id}`).update({
                                    tag: message.author.tag,
                                    avatar: message.author.displayAvatarURL({ format: "png", size: 256 }),
                                    yen: db.val().yen - tema.value,
                                    background: tema.url
                                }); // Faz a atualização dos dados como yen, background, tag e avatar

                                return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, a sua compra foi efetuada com sucesso! Uso o comando \`${prefix}profile\` para ver o seu perfil com o novo plano de fundo!`); // Notifica o autor sobre a compra efetuada com sucesso
                            }; // Verifica se o autor se ele tem yen para comprar
                        }; // Verifica se o autor está no banco de dados
                    }); // Faz a busca no banco de dados os dados do autor
                }); // Cria um evento de colector e coleta a reação
        }); // Envia a mensagem mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa