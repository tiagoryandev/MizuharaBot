const Discord = require("discord.js");

const embed = new Discord.MessageEmbed()
.setTitle("") // Para criar um Titulo para a embed
.setColor("") // Para definir uma cor em hexadecimal para embed
.setAuthor("", "") // Define um autor com um nome/avatar na embed
.setDescription("") // Adiciona uma descrição para a embed
.setURL("") // Seta um URL com um link na embed
.setThumbnail("") // Seta uma fotinha na direita da embed
.setImage("") // Adiciona uma imagem no final da embed
.addField({ name: "", value: ""}) // Adiciona um field na embed
.addFields({ name: "", value: "", inline: true }) // Adiciona varios fields na embed
.setFooter("", "") // Adiciona um footer com descrição/avatar
.setTimestamp(); // Mostra a data que foi enviada a embed
