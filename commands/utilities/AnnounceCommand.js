const Discord = require("discord.js"); // Exporta a dependência da Discord.js

module.exports = {
    name: "anunciar", // Nome principal do comando
    description: "Comando para realizar anúncios em canais de texto no seu servidor.", // Descrição do comando
    aliases: ["announce"], // Apelidos do comando
    category: "utils", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: ["MANAGE_GUILD"], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS", "MENTION_EVERYONE"], // Permissões da Mizuhara para executar o comando
    usage: "[Canal]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let channel_mention = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]); // Busca uma menção de canal ou um id de um canal

        if (!channel_mention) {
            return message.channel.send(`${emojis.IconChannelBlock} **|** ${message.author}, você precisa **Mencionar** ou escrever o **ID** de um **Canal** do **Servidor**`); // Notifica ao autor que precisa mencionar um canal do servidor
        }; // Verifica se o autor mencionou um canal do servidor

        message.channel.send(`${emojis.IconAnnouncement} **|** ${message.author}, qual será o **Título** do seu anúncio?`).then(msg => {
            const question_title = message.channel.createMessageCollector(x => x.author.id == message.author.id, { max: 1 }) // Define um evento de coletor de mensagens no canal
                .on("collect", m_title => {
                    let title_content = m_title.content; // Pega o conteúdo da mensagem coletada do autor
                    m_title.delete(); // Deleta a mensagem do autor
                    msg.delete(); // Deleta a pergunta da Mizuhara

                    message.channel.send(`${emojis.IconAnnouncement} **|** ${message.author}, qual será o **Conteúdo** do seu anúncio?`).then(msg1 => {
                        const question_description = message.channel.createMessageCollector(x => x.author.id == message.author.id, { max: 1 }) // Define um evento de coletor de mensagem do canal
                            .on("collect", m_description => {
                                let description_content = m_description.content; // Pega o conteúdo da mensagem coletada do autor
                                m_description.delete(); // Deleta a mensagem do autor
                                msg1.delete(); // Deleta a pergunta da Mizuhara

                                message.channel.send(`${emojis.IconAnnouncement} **|** ${message.author}, você deseja mencionar **Everyone**(Todos os Membros)?\nReaja ${emojis.IconCheckMark} para **Sim** e ${emojis.IconCross} para **Não**.`).then(msg2 => {
                                    msg2.react("793179460903501834").then(() => { }); // Adiciona a reação de positivo
                                    msg2.react("793179461880381460").then(() => { }); // Adiciona a reação de negativo

                                    let sim = (reaction, user) => reaction.emoji.id === "793179460903501834" && user.id === message.author.id; // Define o coletor com a reação de positivo
                                    let sim_v = msg2.createReactionCollector(sim)
                                        .on("collect", r1 => {
                                            msg2.delete(); // Deleta a mensagem de pergunta

                                            const embed = new Discord.MessageEmbed()
                                                .setTitle(`${emojis.IconAnnouncement} **|** ${title_content}`)
                                                .setColor(colors.default)
                                                .setDescription(description_content)
                                                .setFooter(`• Anúnciante: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                                                .setTimestamp(); // Define a embed de anúncio do autor

                                            try {
                                                channel_mention.send(`@everyone`, embed); // Envia o anúncio do autor no canal mencionado
                                            } catch (error) {
                                                return message.channel.send(`${emojis.IconChannelBlock} **|** ${message.author}, ocorreu um erro ao executar o anúncio!`); // Notifica ao autor que ocorreu um erro ao enviar o anúncio
                                            };
                                            message.channel.send(`${emojis.IconChannelFixed} **|** ${message.author}, o seu anuncio foi enviado com sucesso!`); // Notifica ao autor que teve sucesso ao enviar a mensagem
                                        }); // Define o coletor e aciona o evento de coleção

                                    let nao = (reaction, user) => reaction.emoji.id === "793179461880381460" && user.id === message.author.id;
                                    let nao_v = msg2.createReactionCollector(nao)
                                        .on("collect", r1 => {
                                            msg2.delete(); // Deleta a mensagem de pergunta

                                            const embed = new Discord.MessageEmbed()
                                                .setTitle(`${emojis.IconAnnouncement} **|** ${title_content}`)
                                                .setColor("#FF69B4")
                                                .setDescription(description_content)
                                                .setFooter(`• Anúnciante: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                                                .setTimestamp(); // Define a embed de anúncio do autor

                                            try {
                                                channel_mention.send(embed); // Envia o anúncio do autor no canal mencionado
                                            } catch (error) {
                                                return message.channel.send(`${emojis.IconChannelFixed} **|** ${message.author}, ocorreu um erro ao executar o anúncio!`); // Notifica ao autor que ocorreu um erro ao enviar o anúncio
                                            };
                                            message.channel.send(`${emojis.IconCheckMask} **|** ${message.author}, o seu anuncio foi enviado com sucesso!`); // Notifica ao autor que teve sucesso ao enviar a mensagem
                                        }); // Define o coletor e aciona o evento de coleção 
                                }); // Pergunta se o autor deseja mencionar todos os membros no seu anúncio
                            }); // Quando for coletado o conteúdo, ele abrirá o evento
                    }); // Pergunta ao autor qual serpa o conteúdo do anúncio
                }); // Quando for coletado o títuto, ele abrirá o evento 
        }); // Pergunta ao autor qual será o título do anúncio
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações