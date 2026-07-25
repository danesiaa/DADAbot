const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",

    async execute(sock, msg) {

        const image = fs.readFileSync(
            path.join(__dirname, "..", "assets", "menu.png")
        );

        const metadata = await sock.groupMetadata(msg.key.remoteJid);

        const nome = msg.pushName || "Utente";

        const gruppo = metadata.subject;

        const uptime = Date.now() - global.startTime;

        const ore = Math.floor(uptime / 3600000);
        const minuti = Math.floor((uptime % 3600000) / 60000);
        const secondi = Math.floor((uptime % 60000) / 1000);

        const now = new Date();

        const data = now.toLocaleDateString("it-IT");

        const ora = now.toLocaleTimeString("it-IT");

        const menu = `
╔══════════════════════════════════════╗
║             🤖 DADAbot
║        WhatsApp Multi Device
║             Versione 1.0
╚══════════════════════════════════════╝

👤 Utente : ${nome}
👥 Gruppo : ${gruppo}
📦 Comandi: 21
⚡ Stato  : 🟢 Online
🕒 Uptime : ${ore}h ${minuti}m ${secondi}s
📅 Data   : ${data}
🕘 Ora    : ${ora}

──────────────────────────────────────

『 🎉 𝐃𝐈𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎 』

➜ 🎱 .8ball
➜ 🤗 .abbraccia
➜ ✨ .aura
➜ 🎲 .dado
➜ 🌈 .gay
➜ 🧠 .iq
➜ 💍 .ship
➜ 🧹 .scopa
➜ 💪 .sigma

『 👥 𝐆𝐄𝐒𝐓𝐈𝐎𝐍𝐄 𝐆𝐑𝐔𝐏𝐏𝐎 』

➜ 🔓 .aperto
➜ 🔒 .chiuso
➜ 👋 .welcome on/off
➜ 🛡️ .antilink on/off
➜ 👑 .promuovi
➜ 📉 .degrada
➜ 👢 .elimina

『 🎵 𝐌𝐔𝐒𝐈𝐂𝐀 』

➜ ▶️ .play

『 📊 𝐒𝐓𝐀𝐓𝐈𝐒𝐓𝐈𝐂𝐇𝐄 』

➜ 🏆 .leaderboard

『 ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐙𝐈𝐎𝐍𝐈 』

➜ 📜 .menu
➜ ℹ️ .info
➜ 🏓 .ping
➜ 👑 .owner

╔══════════════════════════════════════╗
║      Powered by DADAbot • v1.0
║         Made with ❤️ by DADA
╚══════════════════════════════════════╝`;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                image,
                caption: menu
            },
            {
                quoted: msg
            }
        );

    }
};