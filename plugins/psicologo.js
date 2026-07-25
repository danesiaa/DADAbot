const fs = require("fs");
const path = require("path");

module.exports = {
    name: "psicologo",

    async execute(sock, msg) {

        // Carica le frasi
        const file = path.join(__dirname, "..", "database", "frasi.json");
        const frasi = JSON.parse(fs.readFileSync(file, "utf8"));

        // Sceglie una frase casuale
        const frase = frasi[Math.floor(Math.random() * frasi.length)];

        // Carica l'immagine
        const image = fs.readFileSync(
            path.join(__dirname, "..", "assets", "psicologo.png")
        );

        const testo =
`╭━━━〔 🧠 PSICOLOGO 〕━━━╮

${frase}

━━━━━━━━━━━━━━━━━━

💙 Ricorda sempre:
Chiedere aiuto non è una debolezza, ma un gesto di coraggio. Se stai attraversando un momento difficile, parlane con una persona di cui ti fidi.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                image: image,
                caption: testo
            },
            {
                quoted: msg
            }
        );

    }
};