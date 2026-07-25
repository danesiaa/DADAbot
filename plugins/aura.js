const crypto = require("crypto");

module.exports = {
    name: "aura",

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

        // Aura sempre uguale per la stessa persona
        const hash = crypto
            .createHash("md5")
            .update("aura" + jid)
            .digest("hex");

        const aura = (parseInt(hash.substring(0, 8), 16) % 2001) - 1000;

        let frase = "";

        if (aura <= -750)
            frase = "💀 Aura disastrosa.";

        else if (aura <= -400)
            frase = "😬 Oggi non ispiri molta fiducia.";

        else if (aura <= 0)
            frase = "😐 Aura nella media.";

        else if (aura <= 400)
            frase = "✨ Hai una buona presenza.";

        else if (aura <= 750)
            frase = "🔥 Aura impressionante.";

        else
            frase = "👑 Aura leggendaria.";

        const segno = aura >= 0 ? "+" : "";

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`✨ AURA METER

👤 ${nome}

Aura: ${segno}${aura}

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