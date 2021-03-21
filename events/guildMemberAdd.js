const Discord = require("discord.js"); // Exporta a dependência da Discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase 
const database = firebase.database(); // Puxa a função de banco de dados do firebase realtime

module.exports = async (client, member) => {
    if (!member.guild.me.permissions.has("MANAGE_ROLES")) {
        return; // Não retorna nada se nao tiver a permissão de gerenciar cargos
    }; // Verifica se a Mizuhara tem a devida permissão no servidor

    database.ref(`Servidores/${member.guild.id}/Config/AutoRole`).once("value").then(async function (db) {
        if (db.val() == null) {
            return; // Se não tiver cargo no autorole, ele retorna nada
        } else {
            let role = member.guild.roles.cache.get(db.val().role); // Busca o cargo por id no servidor
            if (!role) {
                database.ref(`Servidores/${member.guild.id}/Config/AutoRole`).remove(); // Deleta o cargo de autorole se nao tiver no servidor
                
                return; // Retorna nada;
            }; // Verifica se o cargo de autorole está no servidor
            try {
                member.roles.add(role); // Adiciona o cargo ao membro
            } catch (error) {
                return console.log(`[ERRO] Erro ao adicionar o cargo ao [ ${member.user.tag} / ${member.id} ] \nServidor: [ ${member.guild.name} / ${member.guild.id} ]`); // Notifica no console o erro ao adicionar o cargo
            };
        }; // Faz a verificação de cargo do autorole
    }); // Busca no banco de dados o cargo de autorole
}; // Exporta o modulo de evento de guildMemberAdd
