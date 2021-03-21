const Discord = require("discord.js"); // Exporta a dependência da discord.js
const moment = require('moment'); // Exporta a dependência da moment
moment.locale('pt-BR'); // Define o idioma para português

module.exports = {
    name: "botinfo", // Nome principal do comando
    description: "Comando para mostrar as informações da Mizuhara.", // Descrição do comando
    aliases: ["infobot"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        let totalSeconds = client.uptime / 1000; // Define o tempo de vida da Mizuhara em segundos
        let days = Math.floor(totalSeconds / 86400); // Define os dias que a Mizuhara ficou online
        let hours = Math.floor(totalSeconds / 3600); // Define as horas que a Mizuhara ficou online

        totalSeconds %= 3600; // Faz a divisão do tempo

        let minutes = Math.floor(totalSeconds / 60); // Define os minutos que a Mizuhara ficou online
        let seconds = totalSeconds % 60; // Define os segundos que a Mizuhara ficou online
        let uptime = `🗓${days.toFixed()}d ${hours.toFixed()}h ${minutes.toFixed()}m ${seconds.toFixed()}s`; // Define a mensagem que informa o tempo completo

        let guilds = await client.shard.fetchClientValues('guilds.cache.size').then(results => {
        	return `${results.reduce((acc, guildCount) => acc + guildCount, 0)}`; // Retorna o valor dos servidores 
        }); // Faz a soma de todos os servidores de todos os Shards da Mizuhara

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Olá, eu soa a Mizuhara Chizuru! ❤️`, client.user.displayAvatarURL())
            .setColor("#FF69B4")
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setDescription(`:purple_heart: Olá, eu sou a **Mizuhara** ou **Mizu** para quem é mais intimo, e tenho 20 anos e sou uma Aplicação para Servidores do Discord. Minha personagem foi inspirada na protagonista de **Rent-a-Girlfriend**, um dos animes preferidos do meu criador.` +
                `\n\n:white_check_mark: Atualmente estou presente em **${guilds} servidores** com **${client.commands.size} comandos** e **funções** para você usar, e estou online á **${uptime}**.` +
                ` Eu fui criada do dia ${moment(client.user.createdAt).format("LL")}, e fui programada em <:javascript:783318954428858400> **JavaScript** usando a biblioteca da :orange_book:  [**Discord.js**](https://discord.js.org/#/)!` +
                `\n\nCaso você queira ver meu <:mizuprofile:783318954876993546> **Website**, você pode [clicar aqui](https://www.mizuhara.tk).`)
            .addFields({ name: `<:svadd:783318954755358780> Me Adicione!`, value: `[Aperte Aqui](https://discord.com/oauth2/authorize?client_id=694270851008167976&scope=bot&permissions=805314622)`, inline: true },
                { name: `<:helperbug:783318954838851617> Meu Suporte`, value: `[Rent-a-Girlfriend Corp](https://discord.gg/v2j2jNK3wa)`, inline: true },
                { name: `:sparkles: Meu Twitter`, value: `[@BotMizuhara](https://twitter.com/BotMizuhara)`, inline: true },
                { name: `:crown: Menções Incriveis`, value: `• \`TiaGoiNsaNy#9903\` por ter me criado. :heart:` +
                `\n• Por todas as pessoas que me adicionaram no seu servidor, eu fico grata.` +
                `\n• E uma menção a você **${message.author.username}**, que está usando meus comandos! Eu te amo! :heart:`, inline: true },
                { name: `:moneybag: Donete`, value: `[Uma Ajudinha para Mim](https://www.paypal.com/donate/?cmd=_donations&business=K4DA7PQ8N2NDY&item_name=Ajudar+a+melhorar+a+hospedagem+da+Mizuhara+Bot&currency_code=BRL)`, inline: true })
            .setFooter(`• Mizuhara Bot!`, client.user.displayAvatarURL())
            .setTimestamp(); // Define a embed com as informações da Mizuhara Bot

        message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor do comando
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações