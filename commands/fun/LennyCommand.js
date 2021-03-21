const lennys = require("../../config/lenny.js"); // Exporta a lista de array com as carinhas

module.exports = {
    name: "lenny", // Nome principal do comando
    description: "Comando para enviar carinhas para o usuário.", // Descrição do comando
    aliases: ["carinhas"], // Apelidos do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        var rand_num = Math.floor(Math.random() * lennys.length); // Faz uma escolha aleatória com o limite de lennys no array
        var rand_val = lennys[rand_num]; // Seleciona a carinha escolida no array
    
        return message.channel.send(`${message.author}, ${rand_val}`); // Envia a mensagem com a carinha mencionando o autor
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa