const Discord = require("discord.js"); // Faz a exportação da dependência da Discord.js
require('dotenv').config(); // Exporta o seu arquivo env com todas as chaves
const manager = new Discord.ShardingManager("./mizuhara.js", { token: process.env.TOKEN, totalShards: "auto" }); // Acada shard criado, ele irá fazer a fragmentação da aplicação

manager.on("shardCreate", shard => {
    console.log(`[GERENCIADOR-SHARD] - Shard ${shard.id} foi criado e carregado com Sucesso!`);
}); // Notifica no console quando um shard for criado e carredado com sucesso

manager.spawn(); // Inicia o processo de fraguimentação