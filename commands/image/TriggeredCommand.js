const jimp = require("jimp"); // Exporta a dependência do jimp para manipulação de imagem
const GIFEnc = require("gifencoder"); // Exporta a dependência do gifencoder para cração de gifs

module.exports = {
    name: "triggered", // Nome principal do comando
    description: "Comando para mandar uma imagem com o avatar de um usuário com raiva.", // Descrição do comando
    category: "image", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    ClientPerm: ["EMBED_LINKS", "ATTACH_FILES"], // Permissões da Mizuhara para executar o comando
    usage: "[Usuário]", // Modo de uso para usar o comando
    cooldown: 5, // Tempo de cooldown do comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix) {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }; // Define uma função para retornar um valor aleatório

        const options = {
            frames: 8,
            size: 256
        }; // Define as opções do arquivo com o tamanho da imagem e os frames

        let user = message.attachments.size > 0 || message.mentions.users.first() || client.users.cache.get(args[0]) || message.author; // Pega o usuário por menção, id ou o autor
        
        message.channel.startTyping(); // Inicia uma string no canal

        const base = new jimp(options.size, options.size); // Adiciona as configurações no jimp
        const avatar = await jimp.read((message.attachments.size > 0 && (message.attachments).array()[0].url) || user.displayAvatarURL({ format: 'png' })); // Pega o avatar do usuário mencionado); // Pega o url da imagem do usuário
        const text = await jimp.read("./assets/images/triggered.jpg"); // Exporta a imagem de triggered 

        avatar.resize(320, 320); // Faz o redimencionamento da imagem
        avatar.color([
            {
                apply: 'mix', // Coloca em modo mix para mixar na imagem
                params: ['#FF0000', '30'] // Cola os parametos de cores
            }
        ]); // Adiciona um filtro de cor vermelho

        text.scaleToFit(280, 60); // Coloca a scala da umagem de triggered

        const frames = []; // Define um arrey para os frames do gif
        const buffers = []; // Define os buffs do gif
        const encoder = new GIFEnc(256, 256); // Define o modelo do gif com o tamanho
        const stream = encoder.createReadStream(); // Cria um stream para o gif
        let temp; // Coloca o parametro temp como nulo

        stream.on('data', buffer => buffers.push(buffer)); // Adiciona o buff no array de buffs quando tiver dados na stream
        stream.on('end', () => message.channel.send(`${message.author}`, { files: [{ attachment: Buffer.concat(buffers), name: 'triggered.gif' }] })); // Quando terminar, ele envia a mensagem no canal mencionando o altor

        for (let i = 0; i < options.frames; i++) {
            temp = base.clone(); // Clona a base e define no temp com o valor

            if (i === 0) temp.composite(avatar, -16, -16); // Adiciona a composção no gif com a divisão 
            else temp.composite(avatar, -32 + getRandomInt(-16, 16), -32 + getRandomInt(-16, 16)); // Adiciona a composção no gif com a divisão 

            if (i === 0) temp.composite(text, -10, 200); // Faz o movimento da imagem no gif
            else temp.composite(text, -12 + getRandomInt(-8, 8), 200 + getRandomInt(-0, 12)); // Adiciona a composção no gif com a divisão 

            frames.push(temp.bitmap.data); // Adiciona o fremes no array
        }; // Faz a estrutura de repetção para adição de frames

        encoder.start(); // Inicia o encoder
        encoder.setRepeat(0); // Adiciona a repetção
        encoder.setDelay(20); // Define um delay
        for (const frame of frames) encoder.addFrame(frame); // Adiciona o freme no encoder
        encoder.finish(); // Finalizar o encoder

        message.channel.stopTyping(true); // Para a string no canal
    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa