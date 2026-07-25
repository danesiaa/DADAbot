const { muteUser } = require("../lib/muted");

module.exports = {
    name: "muta",
    admin:true,

    async execute(sock, msg) {

        if (!msg.key.remoteJid.endsWith("@g.us")) {
            return;
        }

        const mentioned =
            msg.message.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentioned || mentioned.length === 0) {

            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Devi menzionare un utente."
                },
                {
                    quoted: msg
                }
            );

        }

        const user = mentioned[0];

        muteUser(msg.key.remoteJid, user);

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🔇 Utente mutato con successo!

Da questo momento tutti i suoi messaggi verranno eliminati automaticamente.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`,
                mentions: [user]
            },
            {
                quoted: msg
            }
        );

    }
};