const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "morse", // Nome principal do comando
    description: "Comando para um texto em código morse.", // Descrição do comando
    aliases: ["morcecode"], // Apelidos do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Conteúdo]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        if (!args[0]) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, escreve algo para eu converter em código morse!`); // Notifica ao autor sobre a falta de argumentos
        }; // Verifica caso não tenha argumentos na mensagem
        let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
            morse = "/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----".split(","),
            text = args.join(" ").toUpperCase(); // Define as letras, morses e o texto
        while (text.includes("Ä") || text.includes("Ö") || text.includes("Ü")) {
            text = text.replace("Ä", "AE").replace("Ö", "OE").replace("Ü", "UE"); // Faz as conversões das caracteris especiais
        }; // Caso tenha alguma caracteris, ele converte 

        if (text.startsWith(".") || text.startsWith("-")) {
            text = text.split(" "); // Separa as letras
            let length = text.length; // Verifica a quantidade de letras
            for (i = 0; i < length; i++) {
                text[i] = alpha[morse.indexOf(text[i])]; // Caso ainda não tenha terminado todas as caracteris, ele adiciona um i
            }; // Faz uma estrutura de repetição

            text = text.join(""); // Remove os espaços do texto
        } else {
            text = text.split(""); // Remove os espaços do texto
            let length = text.length;
            for (i = 0; i < length; i++) {
                text[i] = morse[alpha.indexOf(text[i])]; // Adiciona as as caracteris do array
            }; // Faz estrutura de repetição
            text = text.join(" "); // Adiciona espaços no texto
        }; // Verifica se tenha . ou - no conteúdo

        const embed = new Discord.MessageEmbed()
            .setColor(colors.default)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`${emojis.IconCheckMark} **|** Seu argumento em **Código Morse**: \n\`\`\`${text}\`\`\``); // Define a embed com o código convertido

        return message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa