module.exports = {
    name: "elimina",
    admin:true,

    async execute(sock, msg) {

        // Solo nei gruppi
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

        // Deve essere usato rispondendo a un messaggio
        const quoted = msg.message?.extendedTextMessage?.contextInfo;

        if (!quoted?.stanzaId) {
            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Rispondi al messaggio da eliminare."
                },
                {
                    quoted: msg
                }
            );
        }

        try {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    delete: {
                        remoteJid: msg.key.remoteJid,
                        fromMe: quoted.participant === sock.user.id,
                        id: quoted.stanzaId,
                        participant: quoted.participant
                    }
                }
            );

        } catch (err) {

            console.log(err);

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Non sono riuscito ad eliminare il messaggio.\nControlla di essere amministratore."
                },
                {
                    quoted: msg
                }
            );

        }

    }
};