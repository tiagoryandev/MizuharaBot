const Discord = require("discord.js"); // Exporta a dependência da discord.js

module.exports = async (client) => {
    const ping = new Date(); // Gera a data que foi definido a variavel
    ping.setHours(ping.getHours() - 3); // Converte em horas o tempo 
    
    let status = [
        {name: `${client.guilds.cache.size} servidores`, type: 'WATCHING'},
        {name: `${client.commands.size} Comandos!`, type: 'WATCHING'},
        {name: `Rent-a-Girlfriend`, type: "WATCHING"},
        {name: 'www.mizuhara.tk', type: "PLAYING"},
        {name: 'pedra no Kazuya!', type: "PLAYING"}, 
        {name: `Me siga no meu Twitter: @BotMizuhara`, type: "PLAYING"},
        {name: `Use upvote`, type: 'WATCHING'},
        {name: `Feliz Natal!`, type: 'WATCHING'}
    ]; // Definição de um array com todos os status
  
    function setStatus() {
        let randomStatus = status[Math.floor(Math.random()*status.length)]
        client.user.setPresence({activity: randomStatus})
    }; // Define um random status e seta no usuário

    setStatus(); // Executa a função de setStatus
    setInterval(() => setStatus(), 5000); // Cria m intervalo onde irá executar acada 5 segundos a função de setStatus
  
    console.log(`[LOGIN] - O Bot ${client.user.tag} foi inicializada em ${client.guilds.cache.size} servidores!`); // Notifica no console quando a Mizuhara for logada
}; // Exporta o module de evento ready para o arquivo principal
