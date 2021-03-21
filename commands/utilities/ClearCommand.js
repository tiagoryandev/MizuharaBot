const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "clear", // Nome principal do comando
    description: "Comando para realizar limpeza no canal.", // Descrição do comando
    aliases: ["limpar"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MANAGE_MESSAGES"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "MANAGE_MESSAGES"], // Permissões da Mizuhara para executar o comando
    usage: "[Quantidade]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        const deleteCount = parseInt(args[0], 10); // Define a quantidade das mensagens que seram removidas no canal

        if (!deleteCount || deleteCount < 1 || deleteCount > 99) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa colocar um valor de **1** a **99** mensagens para realizar a limpeza`); // Notifica o autor que não possui nenhum argumentos
        }; // Verifica se possui argumentos na mensagem

        const fetched = await message.channel.messages.fetch({ limit: deleteCount + 1 }); // Busca as mensagens no canal

        try {
            message.channel.bulkDelete(fetched); // Realiza a limpeza no canal
        } catch (error) {
            return message.channel.send(`${emojis.errocommand} **|** ${message.author}, ocorreu um erro ao realizar a limpeza no canal.`); // Notifica o autor que ocorreu um erro ao fazer a limpeza
        }; // Faz a execução da limpeza

        message.channel.send(`${emojis.BulkDelete} **|** ${message.author}, você fez a limpeza de **${args[0]}** mensagens nesse canal.`).then(msg => msg.delete({ timeout: 7000 })); // Notifica que as mensagens foram limpas no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações