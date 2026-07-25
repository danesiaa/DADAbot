module.exports = {
    name: "8ball",

    async execute(sock, msg, args) {

        if (args.length === 0) {
            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`❌ Scrivi una domanda.

Esempio:
.8ball Domani pioverà?`
                },
                {
                    quoted: msg
                }
            );
        }

        const domanda = args.join(" ");

        const risposte = [

            "🟢 Sì, assolutamente.",
            "🟢 Direi proprio di sì.",
            "🟢 Tutto fa pensare di sì.",
            "🟢 Le probabilità sono alte.",
            "🟢 Senza alcun dubbio.",

            "🟡 Forse.",
            "🟡 È difficile dirlo.",
            "🟡 Riprova più tardi.",
            "🟡 Non posso prevederlo ora.",
            "🟡 I segnali sono contrastanti.",

            "🔴 No.",
            "🔴 Direi proprio di no.",
            "🔴 Le probabilità sono basse.",
            "🔴 Meglio non contarci.",
            "🔴 Assolutamente no."

        ];

        const risposta =
            risposte[Math.floor(Math.random() * risposte.length)];

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🎱 MAGIC 8 BALL

❓ Domanda:
${domanda}

💬 Risposta:
${risposta}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
            },
            {
                quoted: msg
            }
        );

    }
};