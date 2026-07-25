const { setWelcome, getGroup } = require("../lib/groups");

module.exports = {
    name: "welcome",
    admin:true,

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

        const me = metadata.participants.find(p => p.id === sender);

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
`👋 Sistema Welcome

Stato attuale: ${group.welcome ? "🟢 ATTIVO" : "🔴 DISATTIVATO"}

Utilizzo:

.welcome on
.welcome off`
                },
                {
                    quoted: msg
                }
            );

        }

        const option = args[0].toLowerCase();

        if (option === "on") {

            setWelcome(msg.key.remoteJid, true);

            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`✅ Messaggio di benvenuto attivato.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
                },
                {
                    quoted: msg
                }
            );

        }

        if (option === "off") {

            setWelcome(msg.key.remoteJid, false);

            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`❌ Messaggio di benvenuto disattivato.

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
                text: "❌ Usa .welcome on oppure .welcome off"
            },
            {
                quoted: msg
            }
        );

    }
};