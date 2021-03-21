const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Inicia a função de banco de dados realtime

module.exports = {
    name: "mute", // Nome principal do comando
    description: "Comando para os moderadores realizarem Mutes em membros do servidor.", // Descrição do comando
    aliases: ["mutar"], // Apelidos do comando
    category: "mod", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MUTE_MEMBERS"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "MANAGE_ROLES", "MANAGE_CHANNELS"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let membro = message.mentions.members.first() || message.guild.members.cache.get(args[0]); // Faz a busca do membro por menção ou id

        if (!membro) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa mencionar um membro para realizar o Mute!`); // Notifica o autor sobre a falta de menção
        }; // Verifica se o autor mencionou um membro

        if (membro.id == client.user.id) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, porque você está tentando me mutar? Espero que você não esteja tentando acabar comigo...`); // Notifica o autor sobre não poder mutar a Mizuhara
        }; // Verifica se o autor mencionou a Mizuhara

        if (membro.id == message.author.id) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode se **Auto-Mutar**! Que pessoa estranha...`); // Notifica o autor sobre não poder se mencionar no comando
        }; // Veirfica se o autor mencionou ele mesmo

        let role = message.guild.roles.cache.find(r => r.name === `Mutado`); // Faz a busca do cargo de mute no servidor

        if (!role) {
            message.guild.roles.create({ data: { name: 'Mutado', permissions: [] } }); // Caso não tenha, ele cria um cargo sem premissões
        }; // Verifica se o cargo existe no servidor

        if (message.guild.member(membro).roles.cache.has(role.id)) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode mutar o ${membro}, pois ele já está mutado no servidor! Use o comando \`${prefix}unmute\` para desmutar o membro!`); // Notifica o autor sobre o membro já está mutado
        }; // Verifica se o membro mencionado já está com o cargo de mute

        if (message.guild.me.roles.highest.position < role.position) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu não posso mutar o ${membro}, pois o cargo de mute é maior que o meu cargo! Mude a posição do cargo para baixo de mim e realize o comando novamente!`); // Notifica o autor sobre a poição dos cargos
        }; // Verifica se o cargo de mute é maior que o da Mizuhara

        message.channel.send(`${emojis.IconComments} **|** ${message.author}, descreva o **Motivo** para sua solicitação de mute abaixo:`).then(msg => {
            const question_reason = message.channel.createMessageCollector(x => x.author.id == message.author.id, { max: 1 })
                .on("collect", m_reason => {
                    let mute_reason = m_reason.content; // Busca o conteúdo da mensagem coletada
                    m_reason.delete(); // Deleta e mensagem coletada
                    msg.delete(); // Deleta a pergunta da Mizuhara

                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.default)
                        .setDescription(`${emojis.IconCallBlock} **|** Você está solicitando uma ação para o **Mute** do membro **${membro.user.username}**!\n\nPara aceitar a ação, aperte no ${emojis.IconCheckMark} para aceitar e no ${emojis.IconCross} para recusar a solicitação.`)
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
                                    message.guild.channels.cache.map((channel) => {
                                        if (!channel.permissionsFor(role).has("SEND_MESSAGES", false)) {
                                            channel.createOverwrite(role, {
                                                SEND_MESSAGES: false
                                            }); // Se não tiver configurado, ele muda as permissões do canal
                                        }; // Verifica se o canal já está configuradp
                                    }); // Faz a atualização de todos os canais

                                    membro.roles.add(role); // Realiza a adição do cargo de mute
                                } catch (error) {
                                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, ocorreu um erro ao realizar a adição do cargo, verifique se o cargo de **Mute** está acima do meu e caso o erro aconteça o mesmo erro, faça um reporte para os meus desenvolvedores sobre esse erro.`); // Caso ocorra um erro na adição do cargo, ele notifica o autor
                                }; // Faz o banimento do membro do servidor

                                const embedlog = new Discord.MessageEmbed()
                                    .setColor(colors.punish)
                                    .setDescription(`${emojis.IconCallBlock} **|** \`${membro.user.tag}\` foi mutado no servidor **${message.guild.name}**!\n**Motivo**: ${mute_reason}`)
                                    .setFooter(`• Moderador: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com as informações do mute

                                let channel = message.guild.channels.cache.get(channel_punishment); // Faz a busca do canal de punições do servidor

                                if (channel) {
                                    channel.send(`${membro}`, embedlog); // Envia a embed no canal de punições do servidor
                                } else {
                                    message.channel.send(`${membro}`, embedlog); // Envia a embed no canal atual caso não seja encontrado
                                }; // Faz a verificação do canal do servidor

                                message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, a sua solicitação de mute foi realizada com sucesso no servidor! Agradeço por ter me usado para punir esses membros de má conduta!`); // Envia a confimação do banimento do membro
                            }); // Cria um coletor com o evento de collect que e acionado

                        let collect_deny = (reaction, user) => reaction.emoji.id === "793179461880381460" && user.id === message.author.id; // Cria um coletor de emojis de negação
                        let deny = c.createReactionCollector(collect_deny)
                            .on("collect", m => {
                                c.delete(); // Deleta a embed de confimação

                                message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, a solicitação de mute do ${membro} foi recusada com sucesso! Espero que você tenha intimidado ele!`); // Notifica o autor sobre a recusão da punição
                            }); // Cria um coletor com o evento de collect que e acionado 
                    }); // Envia a embed mencionando o autor
                }); // Cria um evento de coleção de mensagem e inicia um evento
        }); // Envia a mensagem de pergunta do motivo do mute
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa