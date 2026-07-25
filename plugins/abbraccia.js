module.exports = {
    name: "abbraccia",

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
                    text: "❌ Menziona una persona.\n\nEsempio:\n.abbraccia @utente"
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

        const frasi = [
            "🫂 Che bel momento!",
            "❤️ Un abbraccio vale più di mille parole.",
            "😊 Abbraccio ricambiato!",
            "🤗 Che tenerezza!",
            "✨ L'amicizia prima di tutto.",
            "🥹 Un abbraccio pieno di affetto.",
            "💙 Momento wholesome."
        ];

        const frase = frasi[Math.floor(Math.random() * frasi.length)];

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🤗 ABBRACCIO

👤 ${nome1}

🫂

👤 ${nome2}

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