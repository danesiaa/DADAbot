module.exports = {
    name: "moneta",

    async execute(sock, msg) {

        const risultato = Math.random() < 0.5 ? "🪙 Testa" : "🪙 Croce";

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🪙 LANCIO DELLA MONETA

Risultato:

${risultato}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
            },
            {
                quoted: msg
            }
        );

    }
};