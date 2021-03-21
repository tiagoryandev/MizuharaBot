const Discord = require("discord.js"); // Exporta a dependência da discord.js
const malScraper = require('mal-scraper'); // Exporta a dependência do myanimelist api

module.exports = {
    name: "anime", // Nome principal do comando
    description: "Comando para pequisar animes no MyAnimeList.", // Descrição do comando
    aliases: ["myanimelist"], // Apelidos do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Nome]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let argumentos = args.join(" "); // Puxa os argumentos da mensagem do autor

        if (!argumentos) {
            return message.channel.send(`${emojis.IconCheckMark} **|** ${message.author}, você precisa enviar o nome para realizar a pesquisa do anime!`); // Notifica o autor sobre a falta dos argumentos
        }; // Verifica se o autor colocou os argumentos na mensagem

        malScraper.getInfoFromName(argumentos).then((data) => {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Resultado do My Anime List sobre: ${args.join(" ")}`.split(',').join(' '))
                .setThumbnail(data.picture)
                .setColor(colors.default)
                .addField(':flag_us: **|** Titulo em Inglês:', data.englishTitle, true)
                .addField(':flag_jp: **|** Titulo em Japonês:', data.japaneseTitle, true)
                .addField('📺 **|** Tipo:', data.type, true)
                .addField('💻 **|** Quantidade de Episódios:', data.episodes, true)
                .addField('⭐ **|** Avaliação:', data.rating, true)
                .addField('📅 **|** Data de Exibição:', data.aired, true)
                .addField('📊 **|** Pontuação:', data.score, true)
                .addField('📊 **|** Estatísticas de Pontuação:', data.scoreStats, true)
                .addField('🔗 **|** Link:', data.url)
                .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                .setTimestamp(); // Define a embed com a informações do anime escolido

            message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor da mensagem
        }).catch(error => {
            message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu infelizmente não encontrei esse anime no **MyAnimeList**!`); // Notifica ao autor que não foi possivel fazer a pesquisa 
        }); // Faz a busca na api, e casa ocorra um erro, ele notifica sobre o erro
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa