const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "say", // Nome principal do comando
    description: "Comando para a Mizuhara enviar mensagens em canais com o conteúdo a sua escolha.", // Descrição do comando
    aliases: ["falar"], // Apelidos do comando
    category: "ytils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MANAGE_GUILD"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "MANAGE_MESSAGES"], // Permissões da Mizuhara para executar o comando
    usage: "[Conteúdo] ou [Canal] e [Conteúdo]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        const mchannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]); // Busca o canal mencionado ou por id

        if (mchannel) {
            argsresult = args.slice(1).join(' '); // Define os argumentos depois da menção
            message.delete().catch(O_o => { }); // Deleta a mensagem do autor
            mchannel.send(`${argsresult}\n\n${emojis.IconChannelFixed} - Mensagem Enviada por ${message.author}.`); // Envia a mensagem no canal mencionado
        } else {
            argsresult = args.join(' '); // Define os argumentos da mensagem
            message.delete().catch(O_o => { }); // Deleta a mensagem do autor
            message.channel.send(`${argsresult}\n\n${emojis.IconChannelFixed} - Mensagem Enviada por ${message.author}.`); // Envia a mensagem no canal atual
        }; // Verifica se o autor mencionou um canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações