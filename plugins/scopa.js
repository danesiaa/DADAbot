const crypto = require("crypto");

module.exports = {
    name: "scopa",

    async execute(sock, msg) {

        if (!msg.key.remoteJid.endsWith("@g.us")) {
            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Questo comando può essere usato solo nei gruppi."
                },
                {
                    quoted: msg
                }
            );
        }

        const mentioned =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (mentioned.length < 1) {
            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Menziona una persona.\n\nEsempio:\n.scopa @utente"
                },
                {
                    quoted: msg
                }
            );
        }

        const autore = msg.key.participant || msg.key.remoteJid;
        const target = mentioned[0];

        const metadata = await sock.groupMetadata(msg.key.remoteJid);

        const me = metadata.participants.find(p => p.id === autore);
        const lui = metadata.participants.find(p => p.id === target);

        const nome1 = me?.name || autore.split("@")[0];
        const nome2 = lui?.name || target.split("@")[0];

        const hash = crypto
            .createHash("md5")
            .update([autore, target].sort().join(""))
            .digest("hex");

        const percentuale = parseInt(hash.substring(0, 8), 16) % 101;

        const barra =
            "█".repeat(Math.round(percentuale / 10)) +
            "░".repeat(10 - Math.round(percentuale / 10));

        let frase = "";

        if (percentuale <= 20)
            frase = "💀 Direi proprio di no.";

        else if (percentuale <= 40)
            frase = "😅 Forse in un'altra vita.";

        else if (percentuale <= 60)
            frase = "😏 Chissà...";

        else if (percentuale <= 80)
            frase = "🔥 C'è sintonia.";

        else
            frase = "👀 Stanotte succede qualcosa.";

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`😏 SCOPA METER

👤 ${nome1}
❤️
👤 ${nome2}

Compatibilità: ${percentuale}%

${barra}

${frase}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`,
                mentions: [autore, target]
            },
            {
                quoted: msg
            }
        );

    }
};