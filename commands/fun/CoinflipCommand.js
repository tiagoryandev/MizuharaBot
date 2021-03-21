module.exports = {
    name: "coinflip", // Nome principal do comando
    description: "Comando para jogar um Cara ou Coroa.", // Descrição do comando
    aliases: ["caracoroa"], // Apelidos do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Cara ou Coroa]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){
        var array1 = ["cara", "coroa"]; // Cria um array com as opções

        var rand = Math.floor(Math.random() * array1.length); // Faz uma seleção randomica no array

        if (!args[0] || (args[0].toLowerCase() !== "cara" && args[0].toLowerCase() !== "coroa")) {
            message.channel.send(`:coin: **|** ${message.author}, insira **cara** ou **coroa** na frente do comando.`); // Notifica sobre a falta dos argumentos
        } else if (args[0].toLowerCase() == array1[rand]) {
            message.channel.send(`:coin: **|** ${message.author} deu **` + array1[rand] + "**, você ganhou dessa vez!"); // Caso de o mesmo resultado dos argumentos do autor, ele notifica
        } else if (args[0].toLowerCase() != array1[rand]) {
            message.channel.send(`:coin: **|** ${message.author}, deu **` + array1[rand] + "**, você perdeu dessa vez!"); // Caso de resultado diferente, ele notifica o autor
        };  // Faz as verificações de argumentos
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa