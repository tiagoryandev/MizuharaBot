const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "rolesmember", // Nome principal do comando
    description: "Comando para mostrar todos os cargos de um membro do seu servidor.", // Descrição do comando
    aliases: ["memberroles"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Membro]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comandos
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member; // Faz a busca do membro por menção e id ou o autor

        let role = member.roles.cache.map(r => `${r}`).join(' **|** '); // Faz o mapeamento dos cargos filtrando o everyone

        const embed = new Discord.MessageEmbed()
            .setAuthor(`• Cargos do ${member.user.username}`, member.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setColor(colors.default)
            .setDescription(`${emojis.IconMembershipGating} **|** Abaixo está todos os cargos do ${member}, com um total de **${member.roles.cache.size} cargos** no servidor:` +
            `\n${role}`); // Define a embed com todos os cargos do membro mencionado

        message.channel.send(`${message.author}`, embed); // Envia a mensagem com a embed mencionando o membro
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações