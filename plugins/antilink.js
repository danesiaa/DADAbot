const { setAntiLink, getGroup } = require("../lib/groups");

module.exports = {
    name: "antilink",

    async execute(sock, msg, args) {

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

        const metadata = await sock.groupMetadata(msg.key.remoteJid);

        const sender =
            msg.key.participant ||
            msg.key.remoteJid;

        const me = metadata.participants.find(p =>
            p.id === sender ||
            p.phoneNumber === sender
        );

        if (!me || me.admin == null) {
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

        if (!args[0]) {

            const group = getGroup(msg.key.remoteJid);

            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`🛡️ Sistema Anti-Link

Stato attuale: ${group.antilink ? "🟢 ATTIVO" : "🔴 DISATTIVATO"}

Utilizzo:

.antilink on
.antilink off`
                },
                {
                    quoted: msg
                }
            );

        }

        const option = args[0].toLowerCase();

        if (option === "on") {

            setAntiLink(msg.key.remoteJid, true);

            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`🟢 Sistema Anti-Link attivato.

Da ora chi invierà link WhatsApp verrà automaticamente espulso.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
                },
                {
                    quoted: msg
                }
            );

        }

        if (option === "off") {

            setAntiLink(msg.key.remoteJid, false);

            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`🔴 Sistema Anti-Link disattivato.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
                },
                {
                    quoted: msg
                }
            );

        }

        return await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: "❌ Usa .antilink on oppure .antilink off"
            },
            {
                quoted: msg
            }
        );

    }
};