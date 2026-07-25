const { loadDB } = require("../lib/database");

module.exports = {
    name: "leaderboard",

    async execute(sock, msg) {

const db = loadDB();

const metadata = await sock.groupMetadata(msg.key.remoteJid);

const members = metadata.participants.map(p => p.id);

const totalMembers = members.length;

const classifiedUsers = Object.values(db)
    .filter(user => members.includes(user.jid));

const totalClassified = classifiedUsers.length;

const users = classifiedUsers
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);

        if (users.length === 0) {
            return await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: "❌ Nessun utente presente nella classifica."
                },
                {
                    quoted: msg
                }
            );
        }

let text =
`🏆 TOP 10 DEL GRUPPO

👥 Membri del gruppo: ${totalMembers}
🏆 Utenti classificati: ${totalClassified}

━━━━━━━━━━━━━━━━━━

`;

        const mentions = [];

        users.forEach((user, index) => {

            mentions.push(user.jid);

            const tag = "@" + user.jid.split("@")[0];

            if (index === 0) {

                text += `🥇 1° • ${tag}\n`;
                text += `⭐ Livello ${user.level} • ✨ ${user.xp} XP\n\n`;

            }

            else if (index === 1) {

                text += `🥈 2° • ${tag}\n`;
                text += `⭐ Livello ${user.level} • ✨ ${user.xp} XP\n\n`;

            }

            else if (index === 2) {

                text += `🥉 3° • ${tag}\n`;
                text += `⭐ Livello ${user.level} • ✨ ${user.xp} XP\n\n`;
                text += "━━━━━━━━━━━━━━━━━━\n\n";

            }

            else {

                const emoji = [
                    "4️⃣",
                    "5️⃣",
                    "6️⃣",
                    "7️⃣",
                    "8️⃣",
                    "9️⃣",
                    "🔟"
                ][index - 3];

                text += `${emoji} ${tag} • Lv. ${user.level} • ${user.xp} XP\n`;

            }

        });

        text += "\n━━━━━━━━━━━━━━━━━━\n";
        text += "Powered by DADAbot";

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text,
                mentions
            },
            {
                quoted: msg
            }
        );

    }
};