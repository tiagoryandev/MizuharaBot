const lista = require("../../config/response.js"); // Exporta a lista de array com as carinhas

module.exports = {
    name: "mami", // Nome principal do comando
    description: "Comando para realizar perguntas para a Mami Nanami.", // Descrição do comando
    aliases: ["mamichan"], // Apelidos do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["MANAGE_WEBHOOKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Pergunta]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        const webhooks = await message.channel.fetchWebhooks(); // Faz a busca de todos os webhooks no canal

        const webhook = webhooks.first(); // Pega o primeiro webhook do canal

        var rand = lista[Math.floor(Math.random() * lista.length)]; // Faz uma seleção randomica do array

        if (!webhook) {
            message.channel.createWebhook('Mami Nanami', {
                avatar: 'https://i.pinimg.com/originals/d4/e7/fc/d4e7fcbad5dc55fa4f12364d7314ad7b.jpg',
            }).then(hook => hook.send(`${message.author}, ${rand}`)); // Cria um webhook e envia a mensagem no canal
        } else {
            await webhook.send(`${message.author}, ${rand}`, {
                username: "Mami Nanami",
                avatarURL: "https://i.pinimg.com/originals/d4/e7/fc/d4e7fcbad5dc55fa4f12364d7314ad7b.jpg"
            }); // Usa o webhook no canal e envia a mensagem
        }; // Verifica se possui um webhook no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informações