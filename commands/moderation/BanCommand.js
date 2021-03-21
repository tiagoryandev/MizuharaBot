const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Inicia a função de banco de dados realtime

module.exports = {
    name: "ban", // Nome principal do comando
    description: "Comando para moderadores realizarem banimentos de membros.", // Descrição do comando
    aliases: ["banir"], // Apelidos do comando
    category: "mod", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["BAN_MEMBERS"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "BAN_MEMBERS"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let membro = message.mentions.members.first() || message.guild.members.cache.get(args[0]); // Faz a busca do membro por menção ou id

        if (!membro) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa Mencionar ou usar o ID de um membro válido para realizar a punição`); // Notifica o autor sobre a falta dos argumentos
        }; // Verifica se o autor mencionou o membro

        if (membro.id == client.user.id) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode me punir, pois você não é digno disso!`); // Notifica o autor que não pode banir a Mizuhara
        }; // Verifica se a menção é a Mizuhara

        if (membro.id == message.author.id) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode se **Auto-Punir** nesse servidor!`); // Notifica o autor que não pode punir ele mesmo
        }; // Verifica se a menção é o autor

        if (!message.member.roles.highest > membro.roles.highest) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode punir esse membro, pois ele tem o cargo mais maior que o seu!`); // Notifica o autor sobre o cargo maior doque o dele
        }; // Verifica se o cargo do autor e maior que do mencionando

        if (!message.guild.me.roles.highest > membro.roles.highest) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu não posso punir o membro, pois ele tem o cargo maior que o meu!`); // Notifica o autor sobre o cargo maior que o da Mizuhara
        }; // Verifica se a Mizuhara tem um cargo maior que o do membro

        if (!membro.bannable) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode punir o membro, pois esse membro não é **Banivel**`); // Notifica o autor sobre o membro não ser banivel
        }; // Verifica se o membro é banivel no servidor

        message.channel.send(`${emojis.IconComments} **|** ${message.author}, qual será o **Motivo** da sua punição ao ${membro}?`).then(msg => {
            const question_reason = message.channel.createMessageCollector(x => x.author.id == message.author.id, { max: 1 })
                .on("collect", m_reason => {
                    let ban_reason = m_reason.content; // Busca o conteúdo da mensagem coletada
                    m_reason.delete(); // Deleta a mensagem coletada
                    msg.delete(); // Deleta a pergunta da Mizuhara

                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.default)
                        .setDescription(`${emojis.BanHammet} **|** Você está solicitando uma ação para o **Banimento** do membro **${membro.user.username}**!\n\nPara aceitar a ação, aperte no ${emojis.IconCheckMark} para aceitar e no ${emojis.IconCross} para recusar a solicitação.`)
                        .setFooter(`• Moderador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed de confimação da punição

                    message.channel.send(`${message.author}`, embed).then(c => {
                        c.react("793179460903501834").then(() => { }); // Reaji com o emoji de confimação
                        c.react("793179461880381460").then(() => { }); // Reaji com o emoji de negação

                        let collect_accept = (reaction, user) => reaction.emoji.id === "793179460903501834" && user.id === message.author.id; // Cria um coletor de emojis de confimação
                        let accept = c.createReactionCollector(collect_accept)
                            .on("collect", async m => {
                                c.delete(); // Deleta a embed de confimação

                                let channel_punishment = await database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).once("value").then(async function (db) {
                                    if (db.val() == null) {
                                        return message.channel.id; // Retorna o id do canal atual se for null
                                    } else {
                                        let canal = message.guild.channels.cache.get(db.val().channel); // Busca o id no banco de dados
                                        if (!canal) {
                                            database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).remove(); // Deleta o id do canal inesistente 
                                            return message.channel.id; // Retorna o id do canal atual
                                        } else {
                                            return db.val().channel; // Retorna o id do banco de dados caso o id seja de um canal de um servidor
                                        };
                                    }; // Faz a verifica do id do canal de punições do servidor
                                }); // Faz a busca do id do canal de punições

                                try {
                                    membro.ban({ reason: `${ban_reason}` }); // Realiza o banimento colocando o motivo que o autor enviou
                                } catch (error) {
                                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, ocorreu um erro ao realizar o banimento, verifique as minhas permissões e caso o erro aconteça o mesmo erro, faça um reporte para os meus desenvolvedores sobre esse erro.`); // Caso ocorra um erro no banimento, e notifica o autor sobre o erro
                                }; // Faz o banimento do membro do servidor

                                const embedlog = new Discord.MessageEmbed()
                                    .setColor(colors.punish)
                                    .setDescription(`${emojis.BanHammet} **|** \`${membro.user.tag}\` foi banido do servidor **${message.guild.name}**!\n**Motivo**: ${ban_reason}`)
                                    .setFooter(`• Moderador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com as informações do banimento

                                let channel = message.guild.channels.cache.get(channel_punishment); // Faz a busca do canal de punições do servidor

                                if (channel) {
                                    channel.send(embedlog); // Envia a embed no canal de punições do servidor
                                } else {
                                    message.channel.send(embedlog); // Envia a embed no canal atual caso não seja encontrado
                                }; // Faz a verificação do canal do servidor

                                message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, a sua solicitação de banimento foi realizada com sucesso no servidor! Agradeço por ter me usado para punir esses membros de má conduta!`); // Envia a confimação do banimento do membro
                            }); // Cria um coletor com o evento de collect que e acionado

                        let collect_deny = (reaction, user) => reaction.emoji.id === "793179461880381460" && user.id === message.author.id; // Cria um coletor de emojis de negação
                        let deny = c.createReactionCollector(collect_deny)
                            .on("collect", m => {
                                c.delete(); // Deleta a embed de confimação

                                message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, a solicitação de banimento do ${membro} foi recusada com sucesso! Espero que você tenha intimidado ele!`); // Notifica o autor sobre a recusão da punição
                            }); // Cria um coletor com o evento de collect que e acionado 
                    }); // Envia a embed mencionando o autor do comando
                }); // Cria um coletor de mensagem e coleta a mensagem do autor
        }); // Envia uma pergunta ao canal para o autor sobre o conteúdo
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa