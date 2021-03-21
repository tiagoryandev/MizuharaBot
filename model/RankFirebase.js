const firebase = require("firebase"); // Exporta o modulo do firebase
const database = firebase.database(); // Chama a função de banco de dados

database.ref("Social").once("value").then(async (snapshot) => {
    let array = []; // Define um array para o armazenamento dos dados

    snapshot.forEach((child) => {
        array.push({ id: child.key, tag: child.val().tag, yen: child.val().yen }); // Adiciona no array as informações do usuário
    }); // Faz a leitura de todos os dados do snapshot e adiciona no array os aparamentos

    array.sort(function (a, b) {
        return b.yen - a.yen; // Reverte os dados para a ordem descrecente
    }); // Faz a ordenação do array

    let desc = array.filter((v) => v.yen > 0).map(({ tag, yen }, index) => `\`${index + 1}º\` **|** **${tag}** - \`¥${numberFormatter("#,##0.00", yen)}\``).slice(0, 10); // Faz o mapeamento dos usuários do array

    const embed = new Discord.MessageEmbed()
        .setTitle(`:yen: **|** Rank Global Yens`)
        .setColor(colors.yen)
        .setDescription(`${desc.join("\n")}`)
        .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
        .setTimestamp(); // Define a embed com o rank de yens globais

    message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
});
