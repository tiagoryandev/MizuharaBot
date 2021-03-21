const express = require("express"); // Faz a exportação do express
const app = express(); // Inicia todas as funções do express

app.get("/", (request, response) => {
    const ping = new Date(); // Gera a data que aconteceu o ping
    ping.setHours(ping.getHours() - 3); // Faz a divisão e conversão para horas
    console.log(`[INFO] Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`); // Notifica no console quando for receber uma solicitação no projeto
    response.sendStatus(200); // Seta os status de online
}); // Evento para solicitação de ping

app.listen(process.env.PORT); // Gera uma porta para o projeto

const Discord = require("discord.js"); // Exporta a dependência da discord.js
const fs = require("fs"); // Exporta a dependência do fs(File-System)
require('dotenv').config(); // Exporta o seu arquivo env com todas as chaves
const firebase = require("firebase"); // Exporta a dependência do firebase(Realtime) para o banco de dados
const { sep } = require("path"); // Exporta a função do path para criação do handler de eventos e comandos
const fire = require("./modules/firebase.js"); // Faz a exportação do modulo de conecção com o banco de dados Firebase
const fetch = require("node-fetch"); // Exporta a dependência do node-fetch para fazer requisições em url
const numberFormatter = require("number-formatter"); // Exporta a dependência do number-formatter

fire(); // Inicia o modulo de conecção com o banco de dados

const client = new Discord.Client({ ws: { intents: new Discord.Intents().ALL, fetchAllMembers: true } }); // Gera um cliente para logar com a API do discord
const database = firebase.database(); // Exporta a função do banco de dados realtime
const votosZuraaa = require("./modules/zuraaa.js"); // Exporta o modulo de verificação de votos do Zuraaa
const config = require("./json/config.json"); // Faz a exportação do arquivo de configurações em json
const emojis = require("./json/emojis.json"); // Faz a exportação dos emojis em json
const colors = require("./json/colors.json"); // Faz a exportação das cores para embeds em json

client.commands = new Discord.Collection(); // Cria uma coleção no cliente para os comandos

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err); // Caso ocorra um erro, será notificado no console
    files.forEach(file => {
        const event = require(`./events/${file}`); // Busca o evento dentro da pasta de eventos
        let eventName = file.split(".")[0]; // Mostra o nome do arquivo do evento
        client.on(eventName, event.bind(null, client)); // Seta o evento no cliente
        console.log(`[EVENTOS] O Evento ${eventName} foi carregado com sucesso;`); // Notifica no console que o evento foi carregado
    }); // Faz a leitura de todos os arquivos dentro da pasta de evento
}); // Processa todos os eventos

const load = (dir = "./commands/") => {
    fs.readdirSync(dir).forEach(dirs => {
        const commandFiles = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js")); // Busca em sub-pastas, todos os comandos
        for (const file of commandFiles) {
            const command = require(`${dir}/${dirs}/${file}`); // Busca o comando especifico dentro da pasta
            client.commands.set(command.name, command); // Seta no coletor o novo comando
            console.log(`[COMANDOS] O comando ${command.name} foi carregado com sucesso;`); // Notifica sobre o comando carregado
        } // Faz a lista dos arquivos de comandos
    }); // Faz uma leitura de todos os comandos dentro da pasta de comandos
}; // Cria o modulo de comandos

load(); // Inicia o modulo de comandos 

client.on('message', async message => {
    votosZuraaa.verificaVotos(message, async (user) => {
        database.ref(`Social/${user.id}`).once("value").then(async function (db) {
            if (db.val() == null) {
                database.ref(`Social/${user.id}`).set({
                    tag: user.tag,
                    avatar: user.displayAvatarURL({ format: "png", size: 256 }),
                    sobremim: "Não definido.",
                    background: "https://i.pinimg.com/originals/0e/44/a9/0e44a9916e6fe6368a9f68774e5b64e2.jpg",
                    yen: 1000,
                    rep: 0,
                    upvote: 1
                }); // Caso o usuário não esteja no banco de dados, ele irá setar o usuário
            } else {
                database.ref(`Social/${user.id}`).update({
                    tag: user.tag,
                    avatar: user.displayAvatarURL({ format: "png", size: 256 }),
                    yen: db.val().yen + 1000,
                    upvote: db.val().upvote + 1
                }); // Se não, ele atualizará os status do usuário
            }; // Verifica se os dados do usuário estão null
        }); // Faz a busca no banco de dados e faz a atualização dos status do usuário
    
        const embed = new Discord.MessageEmbed()
            .setDescription(`${emojis.IconNotification} **|** Eu fico muito feliz em saber que você votou em mim! Serio isso ajuda demais!\n\n💜 E como modo de agradecimento, você ganhou :yen: \`¥${numberFormatter( "#,##0.00", 1000 )} Ienis\` na sua carteira!`)
            .setColor(colors.default)
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setFooter(`• Muito Obrigado por votar em Mim!`, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
            .setTimestamp(); // Cria uma embed para ser envia para o usuário para notificalo
    
        try {
            user.send(`${user}`, embed); // Notifica o usuário com a embed mostrando as informações do seu voto
    
            const whurl = `https://discord.com/api/webhooks/${process.env.WEBHOOK_VOTE_ID}/${process.env.WEBHOOK_VOTE_TOKEN}`; // Define url do webhook

            const embedvote = new Discord.MessageEmbed()
                .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                .setDescription(`${emojis.IconNotification} **|** \`${user.tag}\` votou em mim! Obigada :heart:\n💜 E como modo de agradecimento, ele ganhou :yen: \`¥${numberFormatter( "#,##0.00", 1000 )} Ienis\` na carteira dele!\nhttps://www.zuraaa.com/bots/694270851008167976/votar`)
                .setFooter(`• Muito Obrigado por votar em Mim!`, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
                .setTimestamp(); // Define a embed de notificação do voto para enviar pelo webhook

            fetch(whurl + "?wait=true",
                {
                    "method": "POST",
                    "headers": { "content-type": "application/json" },
                    "body": JSON.stringify({
                        embeds: [embedvote]
                    })
                }); // Faz a requisição do url de webhook fazendo ele envia a mensagem
    
            console.log(`[UPVOTE] [ ${user.tag} / ${user.id} ] votou em mim!`); // Notifica no console que o usuário votou nela
        } catch (error) {
            return console.log(`[ERRO] Ocorreu um erro ao notificar o ${user.tag} sobre o seu voto!`); // Caso ocorra um erro ao notificar, ele enviará no console sobre o erro
        }; // Caso tenha um erro, ele notifica no console
    }); // Inicia o modulo de verificação de votos Zuraaa com as informações
}); // Inicia o evento de votos

client.login(process.env.TOKEN); // Faz a conecção com a API do Discord, e inicia a Mizuhara