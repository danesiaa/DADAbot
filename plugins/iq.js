const crypto = require("crypto");

module.exports = {
    name: "iq",

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

        const hash = crypto
            .createHash("md5")
            .update("iq" + jid)
            .digest("hex");

        const iq = (parseInt(hash.substring(0, 8), 16) % 181) + 20;

        let frase = "";

        if (iq <= 50)
            frase = "🪨 Meglio non fare test di matematica.";

        else if (iq <= 80)
            frase = "😅 C'è margine di miglioramento.";

        else if (iq <= 110)
            frase = "🙂 Nella media.";

        else if (iq <= 140)
            frase = "🧠 Molto intelligente.";

        else if (iq <= 170)
            frase = "🤯 Genio assoluto.";

        else
            frase = "👑 Einstein ti fa un applauso.";

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🧠 IQ TEST

👤 ${nome}

QI: ${iq}

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