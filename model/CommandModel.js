module.exports = {
    name: "", // Nome principal do comando
    description: "", // Descrição do comando
    aliases: [""], // Apelidos do comando
    category: "", // Categorias: fun, mod, utils, config, social, dev, register, botlist, nsfw, mc, image
    guildOnly: true, // Só pode ser usado em servidor
    MemberPerm: [""], // Permissões do membro(autor) para usar o comando
    ClientPerm: ["EMBED_LINKS"], // Permissões da Mizuhara para executar o comando
    usage: "", // Modo de uso para usar o comando
    cooldown: 3, // Tempo de cooldown do comando
    nsfw: true, // Apenas para comandos que são usados em canais de NSFW
    developer: true, // Apenas para desenvolvedores usarem esse comando
    premium: true, // apenas para premiuns usarem esse comando
    backlist: true, // Apenas para membros que não estão banidos
    async execute(client, message, args, emojis, colors, config, prefix){

    }, // Executa p código do comando
}; // Exporta o comando com todas as configurações e informaçõesa
