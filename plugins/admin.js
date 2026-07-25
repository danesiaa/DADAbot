module.exports = {
    name: "admin",

    async execute(sock, msg, args) {

        // Solo gruppi
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

        try {

            const metadata = await sock.groupMetadata(msg.key.remoteJid);

            const sender = msg.key.participant || msg.key.remoteJid;

            const isAdmin = metadata.participants.some(
                p => p.id === sender && p.admin
            );

            if (!isAdmin) {
                return await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text: "❌ Solo gli amministratori possono usare questo comando."
                    },
                    {
                        quoted: msg
                    }
                );
            }

            // Recupera tutti gli admin
            const admins = metadata.participants.filter(p => p.admin);

            const mentions = admins.map(p => p.id);

            const messaggio = args.length
                ? args.join(" ")
                : "";

            let text = "📢 Richiamo amministratori\n\n";

            if (messaggio) {
                text += messaggio + "\n\n";
            }

            text += admins
                .map(a => `@${a.id.split("@")[0]}`)
                .join("\n");

            text += "\n\n━━━━━━━━━━━━━━━━━━\nPowered by DADAbot";

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text,
                    mentions
                },
                {
                    quoted: msg
                }
            );

        } catch (err) {

            console.log(err);

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Errore durante il richiamo degli amministratori."
                },
                {
                    quoted: msg
                }
            );

        }

    }
};