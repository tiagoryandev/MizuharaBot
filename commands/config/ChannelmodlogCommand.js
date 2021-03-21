const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Puxa a função de banco de dados 

module.exports = {
    name: "channelmodlog", // Nome principal do comando
    description: "Canal para configurar um canal para os Logs de Punições no seu Servidor.", // Descrição do comando
    category: "config", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MANAGE_GUILD"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"], // Permissões da Mizuhara para executar o comando
    cooldown: 10, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let channel_ouder = await database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).once("value").then(async function (db) {
            if (db.val() == null) {
                return `\`Não definido.\``; // Caso não tenha canal configurado, ele não retorna o id
            } else {
                let channel = message.guild.channels.cache.get(db.val().channel); // Busca o id do canal no servidor
                if (!channel) {
                    database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).remove(); // Caso não tenha, ele remove o id do banco de dados
                    return `\`Não definido.\``; // Retorna a mensagem de nenhum canal configurado
                } else {
                    return `<#${db.val().channel}>`; // Retorna o canal
                }; // Verificase o canal está no servidor
            }; // Verifica se existe o canal no banco de dados
        }); // Faz a busca no banco de dados nos modulos de channel mod log

        const embedmenu = new Discord.MessageEmbed()
            .setAuthor(`• Logs de Moderação`, message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor(colors.punish)
            .setDescription(`Abaixo está o canal para os **ModLogs**.\n\n${emojis.IconChannel} **Canal**: ${channel_ouder}\n\nAperte no ${emojis.IconConfig} para mudar o canal e ${emojis.BulkDelete} para resetar.`)
            .setFooter(`• Gerente: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com as configurações do modlogs

        message.channel.send(`${message.author}`, embedmenu).then(msg => {
            msg.react("790578673647616000").then(() => { }); // Reaji com o emoji de configuração
            msg.react("790578674075959296").then(() => { }); // Reaji com o emoji de reset

            let accept = (reaction, user) => reaction.emoji.id === "790578673647616000" && user.id === message.author.id; // Filtra as reações com apenas a do autor
            let accept_collect = msg.createReactionCollector(accept)
                .on("collect", c => {
                    msg.delete(); // deleta a mensagem de pergunta

                    message.channel.send(`${emojis.IconConfig} **|** ${message.author}, mencione um cargo abaixo para ser adicionado no **AutoRole**:`).then(msg1 => {
                        const question_channel = message.channel.createMessageCollector(x => x.author.id == message.author.id, { max: 1 }) // Define um coletor de mensagens
                            .on("collect", channelclr => {
                                let channel_mention = channelclr; // Pega a mensagem coletada
                                channelclr.delete(); // Deleta a mensagem coletada
                                msg1.delete(); // Deleta a pergunta da Mizuhara

                                let channel_m = channel_mention.mentions.channels.first(); // Busca o cargo que foi coletado

                                if (!channel_m) {
                                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, o canal que você enviou não foi encontrado no servidor.`); // Notifica o autor sobre a falta dos argumentos coletados
                                }; // Caso não seja encontrado o canal coletado, envia o notificação

                                database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).once("value").then(async function (db) {
                                    if (db.val() == null) {
                                        database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).set({
                                            channel: channel_m.id
                                        }); // Adiciona o canal mencionado no banco de dados

                                        return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você adicionou o canal para o **ModLogs** no seu servidor!`); // Notifica o autor sobre a adição do canal no modulo
                                    } else {
                                        database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).update({
                                            channel: channel_m.id
                                        }); // Atualiza o canal de modlog no banco de dados

                                        return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você adicionou o canal para o **ModLogs** no seu servidor!`); // Notifica o autor sobre a atualização do canal no modulo
                                    }; // Verifica se existe um canal de modlog
                                }); // Faz a busca no banco de dados no canal de modlog do servidor
                            }); // Quando for coletado, aciona o evento
                    }); // Envia a pergunta para o autor
                }); // Quando coletado, abre um evento
            let deny = (reaction, user) => reaction.emoji.id === "790578674075959296" && user.id === message.author.id; // Filtar as reações com apenas do autor
            let deny_collect = msg.createReactionCollector(deny)
                .on("collect", c => {
                    msg.delete(); // deleta a mensagem de pergunta

                    database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).once("value").then(async function (db) {
                        if (db.val() == null) {
                            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu não posso resetar o canal para **ModLogs**, pois o modulo não foi ativado nesse servidor!`); // Notifica o autor sobre não ter canal setado no banco de dados
                        } else {
                            database.ref(`Servidores/${message.guild.id}/Config/ChannelModLog`).remove(); // Deleta o cargo do banco de dados

                            return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você resetou o modulo de **ModLog** com sucesso! Agradeço por ter usado minhas funções.`); // Notifica o autor sobre o canal deletado
                        }; // Verifica se existe um canal setado
                    }); // Faz a busca no banco de dados do prefixo
                }); // Quando coletado, abre um evento
        }); // Envia a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa