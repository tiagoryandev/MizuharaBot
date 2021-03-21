const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Puxa a função de banco de dados 

module.exports = {
    name: "autorole", // Nome principal do comando
    description: "Comando para definir um cargo para adição automatica aos novos membros do seu servidor.", // Descrição do comando
    category: "config", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MANAGE_ROLES"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "MANAGE_ROLES"], // Permissões da Mizuhara para executar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let role_ouder = await database.ref(`Servidores/${message.guild.id}/Config/AutoRole`).once("value").then(async function (db) {
            if (db.val() == null) {
                return `\`Não definido.\``; // Caso não tenha cargo configurado, ele não retorna o id
            } else {
                let role = message.guild.roles.cache.get(db.val().role); // Busca o id do cargo no servidor
                if (!role) {
                    database.ref(`Servidores/${message.guild.id}/Config/AutoRole`).remove(); // Caso não tenha, ele remove o id do banco de dados
                    return `\`Não definido.\``; // Retorna a mensagem de nenhum cargo configurado
                } else {
                    return `<@&${db.val().role}>`; // Retorna o cargo
                }; // Verificase o cargo está no servidor
            }; // Verifica se existe um cargo no banco de dados
        }); // Faz a busca no banco de dados nos modulos de autorole

        const embedmenu = new Discord.MessageEmbed()
            .setAuthor(`• Modulo AutoRole`, message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor(colors.default)
            .setDescription(`Abaixo está o cargo para o **Modulo de AutoRole**.\n\n${emojis.IconChannelFixed} **Cargo**: ${role_ouder}\n\nAperte no ${emojis.IconConfig} para mudar o cargo e ${emojis.BulkDelete} para resetar.`)
            .setFooter(`• Gerente: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })); // Define a embed com as configurações do autorole

        message.channel.send(`${message.author}`, embedmenu).then(msg => {
            msg.react("790578673647616000").then(() => { }); // Reaji com o emoji de configuração
            msg.react("790578674075959296").then(() => { }); // Reaji com o emoji de reset

            let accept = (reaction, user) => reaction.emoji.id === "790578673647616000" && user.id === message.author.id; // Filtra as reações com apenas a do autor
            let accept_collect = msg.createReactionCollector(accept)
                .on("collect", c => {
                    msg.delete(); // deleta a mensagem de pergunta

                    message.channel.send(`${emojis.IconConfig} **|** ${message.author}, mencione um cargo abaixo para ser adicionado no **AutoRole**:`).then(msg1 => {
                        const question_role = message.channel.createMessageCollector(x => x.author.id == message.author.id, { max: 1 }) // Define um coletor de mensagens
                            .on("collect", roleacc => {
                                let role_autorole = roleacc; // Pega a mensagem coletada
                                roleacc.delete(); // Deleta a mensagem coletada
                                msg1.delete(); // Deleta a pergunta da Mizuhara

                                let role = role_autorole.mentions.roles.first(); // Busca o cargo que foi coletado

                                if (!role) {
                                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, o cargo que você enviou não foi encontrado no servidor.`); // Notifica o autor sobre a falta dos argumentos coletados
                                }; // Caso não seja encontrado o cargo coletado, envia o notificação

                                if (message.guild.me.roles.highest.position < role.position) {
                                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu não posso adicionar o cargo que você enviou, pois esse cargo é maior que o meu!`); // Notifica o autor sobre o cargo ser maior que o da Mizuhara
                                }; // Verifica se o cargo mencionado é maior que o cargo da Mizuhara

                                database.ref(`Servidores/${message.guild.id}/Config/AutoRole`).once("value").then(async function (db) {
                                    if (db.val() == null) {
                                        database.ref(`Servidores/${message.guild.id}/Config/AutoRole`).set({
                                            role: role_autorole.mentions.roles.first().id
                                        }); // Adiciona o cargo mencionado no banco de dados

                                        return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você adicionou o cargo para o **AutoRole** no seu servidor!`); // Notifica o autor sobre a adição do cargo no modulo
                                    } else {
                                        database.ref(`Servidores/${message.guild.id}/Config/AutoRole`).update({
                                            role: role_autorole.mentions.roles.first().id
                                        }); // Atualiza o cargo de autorole no banco de dados

                                        return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você mudou o cargo de **AutoRole** no seu servidor!`); // Notifica o autor sobre a atualização do cargo no modulo
                                    }; // Verifica se existe um cargo no modulo
                                }); // Faz a busca no banco de dados no modulode autorole do servidor
                            }); // Quando for coletado, aciona o evento
                    }); // Envia a pergunta para o autor
                }); // Quando coletado, abre um evento
            let deny = (reaction, user) => reaction.emoji.id === "790578674075959296" && user.id === message.author.id; // Filtar as reações com apenas do autor
            let deny_collect = msg.createReactionCollector(deny)
                .on("collect", c => {
                    msg.delete(); // deleta a mensagem de pergunta

                    database.ref(`Servidores/${message.guild.id}/Config/AutoRole`).once("value").then(async function (db) {
                        if (db.val() == null) {
                            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu não posso resetar o modulo de **AutoRole**, pois o modulo não foi ativado nesse servidor!`); // Notifica o autor sobre não ter cargo setado no banco de dados
                        } else {
                            database.ref(`Servidores/${message.guild.id}/Config/AutoRole`).remove(); // Deleta o cargo do banco de dados

                            return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você resetou o modulo de **AutoRole** com sucesso! Agradeço por ter usado minhas funções.`); // Notifica o autor sobre o cargo deletado
                        }; // Verifica se existe um cargo setado
                    }); // Faz a busca no banco de dados do prefixo
                }); // Quando coletado, abre um evento
        }); // Envia a embed mencionando o autor e cria um evento
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa