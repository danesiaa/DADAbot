const { unmuteUser } = require("../lib/muted");

module.exports = {
    name: "smuta",
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

        unmuteUser(msg.key.remoteJid, user);

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🔊 Utente smutato con successo!

Da questo momento i suoi messaggi saranno nuovamente visibili.

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