module.exports = {
    name: "owner",

    async execute(sock, msg) {

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                contacts: {
                    displayName: "👑 Dada • Founder & Developer",
                    contacts: [
                        {
                            displayName: "👑 Dada • Founder & Developer",
                            vcard: `BEGIN:VCARD
VERSION:3.0
FN:👑 Dada
N:Dada;;;;
ORG:DADAbot;
TITLE:Founder & Developer
TEL;type=CELL;type=VOICE;waid=393201391411:+39 320 139 1411
NOTE:Owner ufficiale di DADAbot
END:VCARD`
                        }
                    ]
                }
            },
            {
                quoted: msg
            }
        );

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: `╭━━━〔 👑 OWNER 〕━━━╮

👤 Nome: Dada
🤖 Ruolo: Founder & Developer
📱 Contatto ufficiale DADAbot

💬 Per assistenza, segnalazioni o informazioni puoi contattarmi direttamente.

╰━━━━━━━━━━━━━━━━━━╯`
            },
            {
                quoted: msg
            }
        );

    }
};