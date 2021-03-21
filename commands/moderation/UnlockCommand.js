const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "unlock", // Nome principal do comando
    description: "Comando para os moderadores desbloquearem o envio de mensagens para o cargo Everyone.", // Descrição do comando
    aliases: ["desbloquear"], // Apelidos do comando
    category: "mod", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MANAGE_CHANNELS"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "MANAGE_CHANNELS"], // Permissões da Mizuhara para executar o comando
    cooldown: 10, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        if (!message.channel.permissionsFor(message.channel.guild.roles.everyone).has("SEND_MESSAGES", true)) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode desbloquear esse canal para o cargo **Everyone**, pois ele já está desbloqueado! Use o comando \`${prefix}lock\` para bloquear esse canal!`); // Notifica o autor que o canal já está desbloqueado
        }; // Verifica se o canal já está desbloqueado para o cargo de everyone
        try {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
                SEND_MESSAGES: true
            }); // Atualiza as permissões de envio de mensagens do cargo everyone no canal
        } catch (error) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, ocorreu um erro ao realizar o desbloqueio do canal, verifique as minhas permissões e tente novamente, caso ocorra o mesmo erro reporte para os meus desenvolvedores!`); // Caso ocorra um erro, ele notifica o autor
        }; // Faz a atualizações de permissões do canal

        message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, o desbloquei de mensagens no canal para o cargo **Everyone** foi realizado com sucesso! Caso queira bloquear, use o comando \`${prefix}lock\` no canal!`); // Notifica o autor que foi um sucesso o bloqueio do canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações