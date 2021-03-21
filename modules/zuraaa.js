/*
       
    ---------------------------------
      VERIFICADOR DE VOTOS ZURAAA!
    ---------------------------------
    Desenvolvido por: Rangel#3644
    Agradecimentos: Acnologia#8486
    Baseado na biblioteca desenvolvida por: GM#3078
    Esta biblioteca tem o objetivo de identificar em tempo real quando seu bot recebe um voto na botlist Zuraaa! (https://zuraaa.com) e obter os dados do usuário que fez o voto, para enviar uma mensagem de agradecimento ou recompensa. Esta versão não precisa de APIs nem de Webhooks, porém requer que o usuário que votou esteja pelo menos em um servidor que seu bot também esteja. Seu bot também precisa estar presente no servidor Bots Para Discord (https://zuraaa.com/discord)!
    Leia o arquivo README.md para saber como usar corretamente esta biblioteca.
    Dúvidas, sugestões ou problemas abra um Issue no GitHub ou me chame no Discord!
    Se copiar ou modificar, por favor mantenha os créditos.
    
    *********************************
    ***NÃO MODIFIQUE ESTE ARQUIVO!***
    *********************************
*/

// Função para escapar caracteres especiais na tag do bot
const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

/**
 * Faz a verificação dos votos do site Zuraaa
 * @param {Discord.Message} message Objeto Message retornado pelo evento Client.on('message')
 * @param {void} callback Função que será chamada ao receber um voto, retorna o objeto User com os dados do usuário que votou
 */
module.exports.verificaVotos = (message, callback) => {

    // Verifica se a mensagem foi enviada pelo bot Zuraaa no canal site_logs (servidor Bots Para Discord)
    if (message.author.id == '745828915993640980' && message.channel.id == '537433191393525760') {
        try {
            // Verifica se a mensagem é a informação de um voto no seu bot
            const regx = new RegExp('(.+) \\(([0-9]+)\\) votou no bot `' + escapeRegex(message.client.user.tag) + '`');
            const match = regx.exec(message.content.trim());

            // Extrai a ID do usuário que fez o voto
            if (match && match[2]) {

                // Procura o usuário com a ID informada
                const user = message.client.users.cache.find(user => user.id == match[2]);

                // Chama a função com os dados do usuário
                if (user) callback(user);

            }
        } catch (error) {
            console.log(error);
        }
    }
}
