const Discord = require("discord.js"); // Exporta a dependência da discord.js
const firebase = require("firebase"); // Exporta a dependência do firebase
const numberFormatter = require("number-formatter"); // Exporta a dependência do number-formatter para formatção
const jimp = require("jimp"); // Exporta a dependência do jimp
const database = firebase.database(); // Puxa a função de banco de dados do firebase

module.exports = {
	name: "yentop", // Nome principal do comando
	description: "Comando para mostrar o rank dos usuários com mais Yens.", // Descrição do comando
	aliases: ["topyen"], // Apelidos do comando
	category: "social", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
	guildOnly: true, // Só pode ser usado em servidor
	ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
	cooldown: 5, // Tempo de cooldown do comando
	backlist: true, // Apenas para membros que não estão banidos
	async execute(client, message, args, emojis, colors, config, prefix) {
		database.ref("Social").once("value").then(async (snapshot) => {
			let array = []; // Define um array para o armazenamento dos dados

			snapshot.forEach((child) => {
				array.push({ id: child.key, tag: child.val().tag, yen: child.val().yen, avatar: child.val().avatar, background: child.val().background }); // Adiciona no array as informações do usuário
			}); // Faz a leitura de todos os dados do snapshot e adiciona no array os aparamentos

			array.sort(function(a, b) {
				return b.yen - a.yen; // Reverte os dados para a ordem descrecente
			}); // Faz a ordenação do array

			let desc = array.filter((v) => v.yen > 0).map(({ id, tag, yen }, index) => `\`${index + 1}º\` **|** **${tag}** - \`¥${numberFormatter("#,##0.00", yen)}\``).slice(0, 10); // Faz o mapeamento dos usuários do array

			const embed = new Discord.MessageEmbed()
				.setTitle(`:yen: **|** Rank Global Yens`)
				.setColor(colors.yen)
				.setDescription(`${desc.join("\n")}`)
				.setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setTimestamp(); // Define a embed com o rank de yens globais

			message.channel.send(`${message.author}`, embed); // Envia a embed mencionando o autor
		}); // Faz a busca no banco de dados
	}, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa