const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = {
    name: "mcachievement", // Nome principal do comando
    description: "Comando para criar uma conquista do Minecraft a sua escolha.", // Descrição do comando
    category: "mc", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Titulo] | [Descrição]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let [title, contents] = args.join(" ").split("|"); // Define o conteúdo depois do |

        if (!contents) [title, contents] = ["Conquista desbloqueada!", title]; // Caso não tenha conteúdo, ele enviará a mensagem padrão

        let rnd = Math.floor((Math.random() * 39) + 1); // Faz um numero random para o icone

        if (args.join(" ").toLowerCase().includes("burn")) rnd = 38; // Define um certo numero para o icone 
        if (args.join(" ").toLowerCase().includes("cookie")) rnd = 21; // Define um certo numero para o icone
        if (args.join(" ").toLowerCase().includes("cake")) rnd = 10; // Define um certo numero para o icone

        if (!args.join(" ")) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever a descrição da sua conquista!`); // Notifica o autor sobre a falta de algumentos
        }; // Verifica se ele adicionou os argumentos

        if (title.length > 24 || contents.length > 22) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, a descrição precisa ter no maximo **22 letras**!`); // Notifica o autor sobre o limite
        }; // Verifica se os argumentos passam do limite
        
        message.channel.startTyping(); // Inicia uma string no canal

        const url = `https://www.minecraftskinstealer.com/achievement/a.php?i=${rnd}&h=${encodeURIComponent(title)}&t=${encodeURIComponent(contents)}`; // Define o link para fazer a requisição na api
        
        message.channel.send(`${message.author}`, new Discord.MessageAttachment(url, 'mcconquista.png')); // Envia a imagem mencionando o autor

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações