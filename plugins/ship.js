const crypto = require("crypto");

module.exports = {
    name: "ship",

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

        if (mentioned.length < 2) {
            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Menziona due utenti.\n\nEsempio:\n.ship @utente1 @utente2"
                },
                {
                    quoted: msg
                }
            );
        }

        const metadata = await sock.groupMetadata(msg.key.remoteJid);

        const user1 = metadata.participants.find(p => p.id === mentioned[0]);
        const user2 = metadata.participants.find(p => p.id === mentioned[1]);

        const nome1 = user1?.name || mentioned[0].split("@")[0];
        const nome2 = user2?.name || mentioned[1].split("@")[0];

        // Sempre la stessa percentuale per la stessa coppia
        const ids = [mentioned[0], mentioned[1]].sort().join("");

        const hash = crypto
            .createHash("md5")
            .update(ids)
            .digest("hex");

        const percentuale = parseInt(hash.substring(0, 8), 16) % 101;

        let frase = "";

        if (percentuale <= 20)
            frase = "💔 Meglio restare amici.";

        else if (percentuale <= 40)
            frase = "😅 Qualche possibilità c'è.";

        else if (percentuale <= 60)
            frase = "😊 Non male!";

        else if (percentuale <= 80)
            frase = "❤️ Ottima intesa!";

        else
            frase = "💍 Siete fatti l'uno per l'altra!";

        const blocchi = Math.round(percentuale / 10);

        const barra =
            "█".repeat(blocchi) +
            "░".repeat(10 - blocchi);

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`❤️ SHIP ❤️

👤 ${nome1}
💞
👤 ${nome2}

Compatibilità: ${percentuale}%

${barra}

${frase}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`,
                mentions: mentioned
            },
            {
                quoted: msg
            }
        );

    }
};