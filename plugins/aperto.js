module.exports = {
    name: "aperto",
    admin:true,

    async execute(sock, msg) {

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

            // Apre il gruppo
            await sock.groupSettingUpdate(
                msg.key.remoteJid,
                "not_announcement"
            );

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`🔓 Gruppo aperto.

Da questo momento tutti i partecipanti possono inviare messaggi.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
                }
            );

        } catch (err) {

            console.log(err);

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`❌ Non sono riuscito ad aprire il gruppo.

Controlla che DADAbot sia amministratore.`
                },
                {
                    quoted: msg
                }
            );

        }

    }
};