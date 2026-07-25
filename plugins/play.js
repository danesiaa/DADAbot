const yts = require("yt-search");

module.exports = {
    name: "play",

    async execute(sock, msg, args) {

        if (args.length === 0) {
            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`❌ Inserisci il nome di una canzone.

Esempio:
.play Viva La Vida Coldplay`
                },
                {
                    quoted: msg
                }
            );
        }

        const query = args.join(" ");

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🎵 DADAbot Music

🔎 Ricerca in corso...

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
            },
            {
                quoted: msg
            }
        );

        try {

            const result = await yts(query);

            if (!result.videos.length) {
                return await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text: "❌ Nessun risultato trovato."
                    },
                    {
                        quoted: msg
                    }
                );
            }

            const video = result.videos[0];

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
`🎵 CANZONE TROVATA

🎧 Titolo: ${video.title}

👤 Canale: ${video.author.name}

⏱️ Durata: ${video.timestamp}

👀 Visualizzazioni: ${video.views.toLocaleString()}

🔗 ${video.url}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
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
                    text: "❌ Errore durante la ricerca."
                },
                {
                    quoted: msg
                }
            );

        }

    }
};