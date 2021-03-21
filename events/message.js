const Discord = require("discord.js"); // Exporta a dependência da discord.js 
const firebase = require("firebase"); // Exporta a dependência do firebase
const database = firebase.database(); // Puxa a função para solicitar o banco de dados
const ms = require("parse-ms"); // Exporta a dependência do parse-ms
const config = require("../json/config.json"); // Exporta o arquivo de configurações em json
const developer = require("../config/developers.js"); // Exporta a lista de desenvolvedores
const guildblacklist = require("../config/blacklist.js"); // Exporta a lista de membros banidos dos comandos em um array
const emojis = require("../json/emojis.json"); // Exporta a lista de emojis
const colors = require("../json/colors.json"); // Exporta a lista de cores
const cooldowns = new Discord.Collection(); // Cria um coletor para fazer o sistema de cooldown

module.exports = async (client, message) => {
    let prefix; // Define o prefixo como null e terá o valar abaixo com as seguintes condições
    if (message.author.bot) return; // não responde mensagens de bots
    if (message.channel.type === 'dm') {
        prefix = config.prefix; // Caso seja em dm, o prefixo será o padrão
    } else {
        prefix = await database.ref(`Servidores/${message.guild.id}/Config/Prefix`).once("value").then(async function (db) {
            if (db.val() == null) {
                return config.prefix; // Retorna o prefixo do arquivo de configurações se nao tiver prefixo setado
            } else {
                return db.val().prefix; // Retorna o prefixo setado no banco de dados
            }; // Define as confições para solicitar o prefixo
        }); // Define o prefix para o prefixo dos comandos da Mizuhara
    }; // Se não, ele buscará no banco de dados o prefixo

    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return message.channel.send(`${emojis.IconHelp} **|** ${message.author}, se você estiver com duvidas, o meu prefixo nesse servidor é \`${prefix}\`, use o comando \`${prefix}help\` para ver todos os meus comandos.`); // Caso alguem membro mencione ela, ela mostrará o seu prefixo no servidor
    if (!message.content.startsWith(prefix)) return; // Não responde mensagens com apenas o prefixo

    const args = message.content.slice(prefix.length).trim().split(/ +/); // Define os argumentos de entrada de um comando
    const commandName = args.shift().toLowerCase(); // Define o nome do comando como a primeira palavra removendo o prefixo

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // Busca o comando no collector de comandos da Mizuhara com nome ou aliases

    if (!command) return; // Caso o comando não seja encontrado, a Mizuhara não retornará nada

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, esse comando não pode ser executado na **DM**.`).then(msg => { msg.delete({ timeout: 7000 }) }); // Retorna o aviso e deleta a mensagem depois de 7 segundos
    }; // Define a condição de execução de comandos em DM

    if (guildblacklist.includes(message.guild.id)) {
        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode executar comandos nesse servidor, pois esse servidor está banido de usar meus comandos.`).then(msg => { msg.delete({ timeout: 7000 }) }); // Retorna o aviso e deleta a mensagem depois de 7 segundos
    }; // Verifica se o servidor está banido de usar os comandos da Mizuhara

    let ListMemberBan = await database.ref(`BlackList/${message.author.id}`).once("value").then(async function (db) {
        if (!db.val() || db.val().reason == null) {
            return null; // Retorna Null se não tiver o usuário
        } else {
            return db.val().reason; // Retorna o motivo do banimento
        }; // Verifica se o usuário está na lista de membros banidos
    }); // Solicita o banco de dados a lista de membros banidos

    if (command.blacklist && ListMemberBan != null) {
        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode realizar meus comandos, pois você foi **Banido** de usar meus comando! ${emojis.IconComments} **|** **Motivo:** ${ListMemberBan}`).then(msg => { msg.delete({ timeout: 15000 }) }); // Notifica o usuário sobre o banimento e o motivo
    }; // Define a condição para a blacklist

    if (command.MemberPerm && !message.member.permissions.has(command.MemberPerm)) {
        let permissions = []; // Define um array para mostrar todas as permissões necessarias

        // VERIFICAÇÃO DE PERMISSÕES DO MEMBRO

        if (command.MemberPerm.includes('ADMINISTRATOR')) permissions.push('`Administrador`');
        if (command.MemberPerm.includes('VIEW_AUDIT_LOG')) permissions.push('`Ver o registro de auditoria`');
        if (command.MemberPerm.includes('MANAGE_GUILD')) permissions.push('`Gerenciar servidor`');
        if (command.MemberPerm.includes('MANAGE_ROLES')) permissions.push('`Gerenciar cargos`');
        if (command.MemberPerm.includes('MANAGE_CHANNELS')) permissions.push('`Gerenciar canais`');
        if (command.MemberPerm.includes('KICK_MEMBERS')) permissions.push('`Expulsar membros`');
        if (command.MemberPerm.includes('BAN_MEMBERS')) permissions.push('`Banir membros`');
        if (command.MemberPerm.includes('CREATE_INSTANT_INVITE')) permissions.push('`Criar convite`');
        if (command.MemberPerm.includes('CHANGE_NICKNAME')) permissions.push('`Alterar apelido`');
        if (command.MemberPerm.includes('MANAGE_NICKNAMES')) permissions.push('`Gerenciar apelidos`');
        if (command.MemberPerm.includes('MANAGE_EMOJIS')) permissions.push('`Gerenciar emojis`');
        if (command.MemberPerm.includes('MANAGE_WEBHOOKS')) permissions.push('`Gerenciar webhooks`');
        if (command.MemberPerm.includes('VIEW_CHANNEL')) permissions.push('`Ler canais de texto e ver canais de voz`');
        if (command.MemberPerm.includes('SEND_MESSAGES')) permissions.push('`Enviar mensagens`');
        if (command.MemberPerm.includes('SEND_TTS_MESSAGES')) permissions.push('`Enviar mensagens em TTS`');
        if (command.MemberPerm.includes('MANAGE_MESSAGES')) permissions.push('`Gerenciar mensagens`');
        if (command.MemberPerm.includes('EMBED_LINKS')) permissions.push('`Inserir links`');
        if (command.MemberPerm.includes('ATTACH_FILES')) permissions.push('`Anexar arquivos`');
        if (command.MemberPerm.includes('READ_MESSAGE_HISTORY')) permissions.push('`Ver histórico de mensagens`');
        if (command.MemberPerm.includes('MENTION_EVERYONE')) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
        if (command.MemberPerm.includes('USE_EXTERNAL_EMOJIS')) permissions.push('`Usar emojis externos`');
        if (command.MemberPerm.includes('ADD_REACTIONS')) permissions.push('`Adicionar reações`');
        if (command.MemberPerm.includes('CONNECT')) permissions.push('`Conectar`');
        if (command.MemberPerm.includes('SPEAK')) permissions.push('`Falar`');
        if (command.MemberPerm.includes('STREAM')) permissions.push('`Vídeo`');
        if (command.MemberPerm.includes('MUTE_MEMBERS')) permissions.push('`Silenciar membros`');
        if (command.MemberPerm.includes('DEAFEN_MEMBERS')) permissions.push('`Ensurdecer membros`');
        if (command.MemberPerm.includes('MOVE_MEMBERS')) permissions.push('`Mover membros`');
        if (command.MemberPerm.includes('USE_VAD')) permissions.push('`Usar detecção de voz`');
        if (command.MemberPerm.includes('PRIORITY_SPEAKER')) permissions.push('`Voz Prioritária`');

        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode executar esse comandos, pois você precisa das permissões de ${permissions.join(", ")}.`).then(msg => { msg.delete({ timeout: 15000 }) }); // Notifica ao membro quais permissões são necessarias para usar o comando
    }; // Define a condição para verificar se o membro tem as permissões necessarias para usar o comando

    if (command.ClientPerm && !message.guild.members.cache.get(client.user.id).permissions.has(command.ClientPerm)) {
        let permissions = []; // Define um array para mostrar todas as permissões necessarias

        // VERIFICAÇÃO DE PERMISSÕES DO CLIENTE

        if (command.ClientPerm.includes('ADMINISTRATOR')) permissions.push('`Administrador`');
        if (command.ClientPerm.includes('VIEW_AUDIT_LOG')) permissions.push('`Ver o registro de auditoria`');
        if (command.ClientPerm.includes('MANAGE_GUILD')) permissions.push('`Gerenciar servidor`');
        if (command.ClientPerm.includes('MANAGE_ROLES')) permissions.push('`Gerenciar cargos`');
        if (command.ClientPerm.includes('MANAGE_CHANNELS')) permissions.push('`Gerenciar canais`');
        if (command.ClientPerm.includes('KICK_MEMBERS')) permissions.push('`Expulsar membros`');
        if (command.ClientPerm.includes('BAN_MEMBERS')) permissions.push('`Banir membros`');
        if (command.ClientPerm.includes('CREATE_INSTANT_INVITE')) permissions.push('`Criar convite`');
        if (command.ClientPerm.includes('CHANGE_NICKNAME')) permissions.push('`Alterar apelido`');
        if (command.ClientPerm.includes('MANAGE_NICKNAMES')) permissions.push('`Gerenciar apelidos`');
        if (command.ClientPerm.includes('MANAGE_EMOJIS')) permissions.push('`Gerenciar emojis`');
        if (command.ClientPerm.includes('MANAGE_WEBHOOKS')) permissions.push('`Gerenciar webhooks`');
        if (command.ClientPerm.includes('VIEW_CHANNEL')) permissions.push('`Ler canais de texto e ver canais de voz`');
        if (command.ClientPerm.includes('SEND_MESSAGES')) permissions.push('`Enviar mensagens`');
        if (command.ClientPerm.includes('SEND_TTS_MESSAGES')) permissions.push('`Enviar mensagens em TTS`');
        if (command.ClientPerm.includes('MANAGE_MESSAGES')) permissions.push('`Gerenciar mensagens`');
        if (command.ClientPerm.includes('EMBED_LINKS')) permissions.push('`Inserir links`');
        if (command.ClientPerm.includes('ATTACH_FILES')) permissions.push('`Anexar arquivos`');
        if (command.ClientPerm.includes('READ_MESSAGE_HISTORY')) permissions.push('`Ver histórico de mensagens`');
        if (command.ClientPerm.includes('MENTION_EVERYONE')) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
        if (command.ClientPerm.includes('USE_EXTERNAL_EMOJIS')) permissions.push('`Usar emojis externos`');
        if (command.ClientPerm.includes('ADD_REACTIONS')) permissions.push('`Adicionar reações`');
        if (command.ClientPerm.includes('CONNECT')) permissions.push('`Conectar`');
        if (command.ClientPerm.includes('SPEAK')) permissions.push('`Falar`');
        if (command.ClientPerm.includes('STREAM')) permissions.push('`Vídeo`');
        if (command.ClientPerm.includes('MUTE_MEMBERS')) permissions.push('`Silenciar membros`');
        if (command.ClientPerm.includes('DEAFEN_MEMBERS')) permissions.push('`Ensurdecer membros`');
        if (command.ClientPerm.includes('MOVE_MEMBERS')) permissions.push('`Mover membros`');
        if (command.ClientPerm.includes('USE_VAD')) permissions.push('`Usar detecção de voz`');
        if (command.ClientPerm.includes('PRIORITY_SPEAKER')) permissions.push('`Voz Prioritária`');

        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, eu não posso executar esse comandos, pois eu preciso das permissões de ${permissions.join(", ")} nesse servidor.`).then(msg => { msg.delete({ timeout: 15000 }) }); // Notifica ao membro quais permissões são necessarias para a Mizuhara executar o comando
    }; // Define a condição para verificar se a Mizuhara tem as permissões necessarias para executar o comando

    if (command.developer && !developer.includes(message.author.id)) {
        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode usar esse comando, pois esse comando só pode ser executado por meus **Desenvolvedores**!`).then(msg => { msg.delete({ timeout: 15000 }) }); // Notifica ao autor que ele não é um desenvolvedor para usar esse comando
    }; // Condição para uso de comando para desenvolvedores

    let ListPremium = await database.ref(`Premium/${message.author.id}`).once("value").then(async function (db) {
        if (db.val() == null || db.val().premium == null || db.val().premium == false) {
            return null; // Retorna Null se não tiver o usuário
        } else {
            return db.val().premium; // Retorna o valor do usuário
        }; // Verifica se o usuário está na lista de membros premiuns
    }); // Solicita o banco de dados a lista de membros premiuns

    if (command.premium && ListPremium == null) {
        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode executar esse comando, pois esse comando só está liberado para **Usuários Premiuns**!`).then(msg => { msg.delete({ timeout: 15000 }) }); // Notifica ao membro que não é um usuário premium
    }; // Define a condição para premium

    if (command.nsfw && !message.channel.nsfw) {
        return message.channel.send(`${emojis.IconCross} **|** ${message.author}, você não pode executar esse comando nesse canal, pois esse comando só pode ser executado em canais de **NSFW**!`).then(msg => { msg.delete({ timeout: 15000 }) }); // Notifica ao usuário que não pode usar o comando em canais comuns
    }; // Define a condição para uso de comando em canais nsfw

    // SISTEMA DE COOLDOWN POR COLEÇÃO

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection()); // Seta um coletor no comando
    }; // Verifica se o comando não tem cooldown setado

    const now = Date.now(); // Gera a data de execução do comando
    const timestamps = cooldowns.get(command.name); // Busca o valor do cooldown do comando
    const cooldownAmount = (command.cooldown || 3) * 1000; // Caso não tenha valor, ele será 3 segundos por padrão

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount; // Define o tempo restante do cooldown

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000; // Converte o tempo restante do cooldown em segundos
            return message.channel.send(`${emojis.IconCross} **|** ${message.author}, por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de realizar o comando \`${command.name}\`.`).then(msg => { msg.delete({ timeout: 5000 }) }); // Notifica ao autor que ainda falta terminar o cooldown
        }; // Verifica se ainda falta tempo para o termino do cooldown
    }; // Verifica se o autor tem um tempo setado de cooldown

    timestamps.set(message.author.id, now); // Seta o cooldown se o autor nao tiver nenhum coletor setado
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); // Remove o cooldown após o tempo de termino

    try {
        await command.execute(client, message, args, emojis, colors, config, prefix); // Executa o comando exportando os parametros definidos no evento de mensagem

        let argumentos = args.join(" "); // Definição de argumentos no comando
        if (!argumentos) {
            argumentos = "Argumentos não foram usados nesse comando."; // Se não tiver argumentos, ele enviará esse aviso
        }; // Verifica se foi usado argumentos nesse comando

        console.log(`[COMANDO-USADO] (${message.author.tag} / ${message.author.id}) usou o comando "${command.name}":\n | [Shard]: ${message.guild.shardID}\n | [Servidor]: ${message.guild.name} / ${message.guild.id}\n | [Canal]: ${message.channel.name} / ${message.channel.id}\n | [Argumentos]: ${argumentos}`)
    } catch (error) {
        console.log(`[ERRO] Ocorreu um erro ao executar o comando. Erro: ${error}`); // Notifica no console que ocorreu um erro
        return message.channel.send(`${emojis.IconConfig} **|** ${message.author}, ocorreu um erro ao executar esse comando, recomendo você reportar esse erro no servidor de suporte para meus desenvolvedores.`).then(msg => { msg.delete({ timeout: 5000 }) }); // Notifica que ocorreu um erro ao executar o comando
    }; // Faz a execução do comando 

}; // Exporta o modulo de evento de mensagem para a Mizuhara