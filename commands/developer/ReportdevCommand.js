const Discord = require("discord.js"); // Exporta a dependência da discord.js
const fetch = require("node-fetch"); // Exporta a dependência do node-fetch

module.exports = {
    name: "reportdev", // Nome principal do comando
    description: "Comando para realizar reportes para os meus Desenvolvedores.", // Descrição do comando
    aliases: ["devreport"], // Apelidos do comando
    category: "dev", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 15, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        message.channel.send(`${emojis.IconBoxUpdate} **|** ${message.author}, envie uma **Descrição** do seu reporte para os meus desenvolvedores, o maximo é **500 letras**.`).then(msg => {
            const question_report = message.channel.createMessageCollector(x => x.author.id == message.author.id, { max: 1 })
                .on("collect", report => {
                    let reportcontent = report.content; // Pega o conteúdo da mensagem coletada do autor

                    if (reportcontent.length > 500) {
                        report.delete(); // Deleta a mensagem coletada
                        msg.delete(); // Deleta a pergunta da Mizuhara

                        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você colocou uma descrição que passou de 500 letras no seu reporte, tente encurtar a sua descrição.`); // Notifica o autor sobre o limite de letras
                    } else {
                        report.delete(); // Deleta a mensagem coletada
                        msg.delete(); // Deleta a pergunta da Mizuhara

                        const embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                            .setColor(colors.default)
                            .setDescription(`Você solicitou um reporte para os meus Desenvolvedores.\n\nPara enviar seu reporte, aperte no ${emojis.IconCheckMark} para enviar.`)
                            .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed de confirmação parar o envio do reporte

                        message.channel.send(`${message.author}`, embed).then(c => {
                            c.react("793179460903501834").then(() => { }); // Adiciona a reação de confirmação na mensagem

                            let collect = (reaction, user) => reaction.emoji.id === "793179460903501834" && user.id === message.author.id; // Filtra as reações na mensagem
                            let accept = c.createReactionCollector(collect)
                                .on("collect", async m => {
                                    c.delete(); // Deleta a embed de confirmação

                                    const embedreport = new Discord.MessageEmbed()
                                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                                        .setColor(colors.default)
                                        .setDescription(`${emojis.PublicCommunity} **|** Um reporte chegou no meu correio:\n\`\`\`${reportcontent}\`\`\``)
                                        .setFooter(`• Autor do Reporte. ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed para enviar o webhook

                                    const whurl = `https://discord.com/api/webhooks/${process.env.WEBHOOK_POSTBOX_ID}/${process.env.WEBHOOK_POSTBOX_TOKEN}`; // Define url do webhook
                                    fetch(whurl + "?wait=true",
                                        {
                                            "method": "POST",
                                            "headers": { "content-type": "application/json" },
                                            "body": JSON.stringify({
                                                embeds: [embedreport]
                                            })
                                        }); // Faz a requisição do url de webhook fazendo ele envia a mensagem
                                    
                                    message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, o seu reporte foi enviado com sucesso!`); // Notifica o autor que o reporte foi enviado
                                }); // Cria um evento de coleção de reação e quando for coletado, ele aciona o evento
                        }); // Envia a embed mencionando o usuário e cria um evento nela
                    }; // Verifica o conteúdo passa de 500 letras
                }); // Cria um evento de coleção na mensagem
        }); // Envia a pergunta e cria um evento nessa mensagem 
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa