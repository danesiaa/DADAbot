module.exports = {
    name: "promuovi",
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

            const mentioned =
                msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

            if (!mentioned || mentioned.length === 0) {
                return await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text: "❌ Menziona l'utente da promuovere."
                    },
                    {
                        quoted: msg
                    }
                );
            }

            await sock.groupParticipantsUpdate(
                msg.key.remoteJid,
                [mentioned[0]],
                "promote"
            );

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`⬆️ Utente promosso ad amministratore.

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
`❌ Non sono riuscito a promuovere l'utente.

Controlla che DADAbot sia amministratore.`
                },
                {
                    quoted: msg
                }
            );

        }

    }
};