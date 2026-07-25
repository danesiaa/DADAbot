const crypto = require("crypto");

module.exports = {
    name: "gay",

    async execute(sock, msg) {

        let jid = msg.key.participant || msg.key.remoteJid;

        // Se viene menzionato un utente
        const mentioned =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (mentioned && mentioned.length > 0) {
            jid = mentioned[0];
        }

        const metadata = await sock.groupMetadata(msg.key.remoteJid);

        const user = metadata.participants.find(p => p.id === jid);

        const nome = user?.name || jid.split("@")[0];

        // Percentuale sempre uguale per la stessa persona
        const hash = crypto
            .createHash("md5")
            .update(jid)
            .digest("hex");

        const percentuale = parseInt(hash.substring(0, 8), 16) % 101;

        const barra =
            "█".repeat(Math.round(percentuale / 10)) +
            "░".repeat(10 - Math.round(percentuale / 10));

        let frase = "";

        if (percentuale <= 20)
            frase = "😎 Nessun sospetto.";

        else if (percentuale <= 40)
            frase = "🤨 Qualche dubbio...";

        else if (percentuale <= 60)
            frase = "😏 Mmm... interessante.";

        else if (percentuale <= 80)
            frase = "🌈 Qualche sospetto c'è.";

        else
            frase = "👑 Impossibile negarlo.";

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🌈 GAY METER

👤 ${nome}

Risultato: ${percentuale}%

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