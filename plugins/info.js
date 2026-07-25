const { getUser } = require("../lib/database");

module.exports = {
    name: "info",

    async execute(sock, msg) {

        let jid = msg.key.participant || msg.key.remoteJid;

        // Se viene menzionato un utente
        if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            jid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        const user = getUser(jid);
        const name = user.name || "Utente";

        // ===== BADGE =====
        let badge = "";

        // Founder (tu)
        if (name === "Dada🕷️") {
            badge = "\n👑 Founder";
        }

        // ===== BARRA XP =====
        const xpPerLevel = 100;

        const currentXP = user.xp % xpPerLevel;
        const percent = Math.floor((currentXP / xpPerLevel) * 100);

        const filled = Math.floor(percent / 10);
        const empty = 10 - filled;

        const bar = "█".repeat(filled) + "░".repeat(empty);

        const text =
`╭━━━〔 👤 INFO UTENTE 〕━━━╮

👤 Nome: ${name}${badge}

━━━━━━━━━━━━━━━━━━

💬 Messaggi: ${user.messages}
⚠️ Warn: ${user.warns}

⭐ Livello: ${user.level}
📈 ${bar} ${percent}%

✨ XP: ${currentXP} / ${xpPerLevel}

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text
            },
            {
                quoted: msg
            }
        );

    }
};