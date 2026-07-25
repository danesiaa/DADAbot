const fs = require("fs");
const path = require("path");

const { getUser, updateUser } = require("./database");
const { getGroup } = require("./groups");
const { isMuted } = require("./muted");
const commands = new Map();

const pluginsPath = path.join(__dirname, "..", "plugins");

const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith(".js"));

for (const file of files) {
    const plugin = require(path.join(pluginsPath, file));

    if (plugin.name && plugin.execute) {
        commands.set(plugin.name.toLowerCase(), plugin);
        console.log("✅ Plugin caricato:", plugin.name);
    }
}

module.exports = async (sock, msg) => {

    if (!msg.message) return;
    if (msg.key.fromMe) return;

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

    // Ottiene l'ID corretto dell'utente
    const id =
        msg.key.participant ||
        msg.message?.extendedTextMessage?.contextInfo?.participant ||
        msg.key.remoteJid;

    const name = msg.pushName || "Utente";

    const user = getUser(id, name);
// ===== SISTEMA MUTE =====
if (msg.key.remoteJid.endsWith("@g.us")) {

    if (isMuted(msg.key.remoteJid, id)) {

        try {

            await sock.sendMessage(msg.key.remoteJid, {
                delete: msg.key
            });

        } catch {}

        return;

    }

}
    // Aggiorna il nome se cambia
    user.name = name;

    // Sistema XP
    user.messages += 1;
    user.xp += 5;

    // Sistema livelli (temporaneo)
    const newLevel = Math.floor(user.xp / 100) + 1;

    if (newLevel > user.level) {
        user.level = newLevel;
    }

updateUser(id, user);

// ==========================
// SISTEMA ANTI-LINK
// ==========================

if (msg.key.remoteJid.endsWith("@g.us")) {

    const group = getGroup(msg.key.remoteJid);

    if (group.antilink) {

        const regex = /(chat\.whatsapp\.com|whatsapp\.com\/channel)/i;

        if (regex.test(text)) {

console.log("🚫 Link WhatsApp rilevato.");

const metadata = await sock.groupMetadata(msg.key.remoteJid);

const sender =
    msg.key.participant ||
    msg.key.remoteJid;

const participant = metadata.participants.find(p =>
    p.id === sender ||
    p.phoneNumber === sender
);

if (participant?.admin) {

    console.log("👮 Admin rilevato, ignorato.");

    return;

}

console.log("👤 Utente normale.");

// Elimina il messaggio
try {

    await sock.sendMessage(
        msg.key.remoteJid,
        {
            delete: msg.key
        }
    );

    console.log("🗑️ Messaggio eliminato.");

} catch (err) {

    console.log("❌ Errore eliminazione:", err);

}

// Espulsione
try {

    await sock.groupParticipantsUpdate(
        msg.key.remoteJid,
        [sender],
        "remove"
    );

    console.log("👢 Utente espulso.");

    await sock.sendMessage(
        msg.key.remoteJid,
        {
            text:
`🚫 *ANTI-LINK*

@${sender.split("@")[0]} ha inviato un link WhatsApp.

🗑️ Messaggio eliminato.
👢 Utente espulso.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`,
            mentions: [sender]
        }
    );

} catch (err) {

    console.log("❌ Errore espulsione:", err);

}

return;

        }

    }

}

// Controlla se è un comando
if (!text.startsWith(".")) return;

    const args = text.slice(1).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    const plugin = commands.get(command);
    if (plugin?.admin && msg.key.remoteJid.endsWith("@g.us")) {

    const metadata = await sock.groupMetadata(msg.key.remoteJid);

    const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id);

    const sender =
        msg.key.participant ||
        msg.message?.extendedTextMessage?.contextInfo?.participant ||
        msg.key.remoteJid;

    if (!admins.includes(sender)) {

        return await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`❌ Questo comando può essere utilizzato solo dagli amministratori del gruppo.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
            },
            {
                quoted: msg
            }
        );

    }

}

    if (!plugin) return;

    try {
        await plugin.execute(sock, msg, args);
    } catch (err) {
        console.log(err);

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: "❌ Errore durante l'esecuzione del comando."
            },
            {
                quoted: msg
            }
        );
    }

};