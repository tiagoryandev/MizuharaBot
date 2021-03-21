const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Puxa a função de banco de dados firebase realtime

module.exports = {
    name: "setprefix", // Nome principal do comando
    description: "Comando para mudar o meu prefixo no seu servidor.", // Descrição do comando
    aliases: ["setprefixo"], // Apelidos do comando
    category: "config", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MANAGE_GUILD"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Prefixo]", // Modo de uso para usar o comando
    cooldown: 10, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        if (!args[0]) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever o conteúdo para o prefixo no seus servidor!`); // Notifica o autor sobre a falta de argumentos
        }; // Verifica se o autor colocou os argumentos na mensagem

        database.ref(`Servidores/${message.guild.id}/Config/Prefix`).once("value").then(async function (db) {
            if (db.val() == null) {
                database.ref(`Servidores/${message.guild.id}/Config/Prefix`).set({
                    prefix: args[0]
                }); // Seta o prefixo se for null o valor atual

                return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você mudou o prefixo do servidor com sucesso! O prefixo do servidor agora será \`${args[0]}\`.`); // Notifica o autor sobre o prefixo atualizado
            } else {
                database.ref(`Servidores/${message.guild.id}/Config/Prefix`).update({
                    prefix: args[0]
                }); // Atualiza o prefixo se já existe o valor de prefixo

                return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você mudou o prefixo do servidor com sucesso! O prefixo do servidor agora será \`${args[0]}\`.`); // Notifica o autor sobre o prefixo atualizado
            }; // Verifica se exite um prefixo no banco de dados
        }); // Faz a busca no banco de dados
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa