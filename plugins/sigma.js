const crypto = require("crypto");

module.exports = {
    name: "sigma",

    async execute(sock, msg) {

        let jid = msg.key.participant || msg.key.remoteJid;

        const mentioned =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (mentioned && mentioned.length > 0) {
            jid = mentioned[0];
        }

        const metadata = await sock.groupMetadata(msg.key.remoteJid);

        const user = metadata.participants.find(p => p.id === jid);

        const nome = user?.name || jid.split("@")[0];

        // Percentuale sempre uguale
        const hash = crypto
            .createHash("md5")
            .update("sigma" + jid)
            .digest("hex");

        const percentuale = parseInt(hash.substring(0, 8), 16) % 101;

        const barra =
            "█".repeat(Math.round(percentuale / 10)) +
            "░".repeat(10 - Math.round(percentuale / 10));

        let frase = "";

        if (percentuale <= 20)
            frase = "🐑 Mentalità da NPC.";

        else if (percentuale <= 40)
            frase = "😅 Ancora tanta strada da fare.";

        else if (percentuale <= 60)
            frase = "🙂 Niente male.";

        else if (percentuale <= 80)
            frase = "🗿 Mentalità da vero sigma.";

        else
            frase = "👑 Sigma assoluto.";

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🗿 SIGMA METER

👤 ${nome}

Sigma: ${percentuale}%

${barra}

${frase}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`,
                mentions: [jid]
            },
            {
                quoted: msg
            }
        );

    }
};