module.exports = {
    name: "dado",

    async execute(sock, msg) {

        const numero = Math.floor(Math.random() * 6) + 1;

        const dadi = {
            1: "⚀",
            2: "⚁",
            3: "⚂",
            4: "⚃",
            5: "⚄",
            6: "⚅"
        };

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🎲 LANCIO DEL DADO

Risultato:

${dadi[numero]} ${numero}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
            },
            {
                quoted: msg
            }
        );

    }
};