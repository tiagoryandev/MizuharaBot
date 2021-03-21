const firebase = require("firebase"); // Exporta a dependência do banco de dados do Firebase
require('dotenv').config(); // Exporta o seu arquivo env com todas as chaves

let fire = () => {
    let configF = {
        apiKey: process.env.FB_API_KEY,
        authDomain: process.env.FB_AUTH_DOMAIN,
        databaseURL: process.env.FB_DATABASE_URL,
        projectId: process.env.FB_PROJECT_ID,
        storageBucket: process.env.FB_STORE_BUCKET,
        messagingSenderId: process.env.FB_MESSAGE_SEND_ID,
        appId: process.env.FB_APP_ID,
        measurementId: process.env.FB_MEAS_ID
    }; // Cria uma variavel com todas as chaves de login com o banco de dados
    
    try {
        firebase.initializeApp(configF); // Inicia o banco de dados com todas as configurações da variavel de armazenamento
        console.log(`[BANCO-DE-DADOS] - Firebase Realtime conectado com sucesso!`); // Notifica no console que o banco de dados foi iniciado com sucesso
    } catch (error) {
        return console.log(`[BANCO-DE-DADOS] - Firebase Realtime não foi conectado devido ao erro: ${error}`); // Caso ocorra um erro ao conectar, ele notificará no console com o erro
    };
};

module.exports = fire; // Exporta o fire como modulo
