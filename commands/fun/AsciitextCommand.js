const fetch = require("node-fetch"); // Exporta a dependência do node-fetch

module.exports = {
    name: "asciitext", // Nome principal do comando
    description: "Comando para enviar o seu texto em ASCII.", // Descrição do comando
    category: "fun", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "[Conteúdo]", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        let text = args.join(" "); // Pega os argumentos da mensagem do autor

        if (!text) {
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever algo para se convertido no modelo de texto.`); // Notifica o autor sobre a falta de argumentos
        }; // Verifica se o autor colocou os argumentos

        message.channel.startTyping(); // Inicia uma string no canal

        fetch(`http://artii.herokuapp.com/make?text=${encodeURIComponent(text)}`)
            .then(res => res.text())
            .then(data => {
                if (data.length > 2000) {
                    return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você precisa escrever o conteúdo com menos de **2000 letras**`); // Notifica o autor sobre o limite de letras
                } else {
                    return message.channel.send(`${message.author}\n\`\`\`${data}\`\`\``); // Envia o texto mencionando o autor
                }; // Verifica se o conteúdo passa de 300 letras ou caracteris
            })
            .catch(error => {
                message.channel.send(`${emojis.IconCross} **|** ${message.author}, ocorreu um erro ao converter no modelo de texto!`); // Notifica o autor sobre o erro
            }); // Faz a requisição na api do comando usando o nodefetch

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa