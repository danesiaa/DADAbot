const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode-terminal");

const handler = require("./handler");
const { getGroup } = require("./groups");

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["DADAbot", "Chrome", "1.0.0"],
        printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, qr }) => {

        if (qr) {
            console.clear();
            console.log("📱 Scansiona il QR:\n");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "connecting") {
            console.log("🟡 Connessione...");
        }

        if (connection === "open") {
            console.clear();
            console.log("✅ DADAbot connesso!");
        }

        if (connection === "close") {

            console.log("❌ Connessione chiusa.");
            console.log("🔄 Tentativo di riconnessione tra 5 secondi...");

            setTimeout(() => {
                startBot();
            }, 5000);

        }

    });

    sock.ev.on("group-participants.update", async (update) => {

        try {

            if (update.action === "add") {

                const group = getGroup(update.id);

                if (group.welcome) {

                    const metadata = await sock.groupMetadata(update.id);

                    for (const participant of update.participants) {

                        const user = participant.phoneNumber || participant.id;
                        const number = user.split("@")[0];

                        await sock.sendMessage(update.id, {
                            text:
`╭━━━〔 👋 BENVENUTO/A 〕━━━╮

Ciao @${number}! 👋

Benvenuto/a nel *${metadata.subject        if (connection === "connecting") {
            console.log("🟡 Connessione...");
        }

        if (connection === "open") {
            console.clear();
            console.log("✅ DADAbot connesso!");
        }

        if (connection === "close") {
            console.log("❌ Connessione chiusa.");
        }

    });

    sock.ev.on("group-participants.update", async (update) => {

        try {

            if (update.action === "add") {

                const group = getGroup(update.id);

                if (group.welcome) {

                    const metadata = await sock.groupMetadata(update.id);

                    for (const participant of update.participants) {

                        const user = participant.phoneNumber || participant.id;
                        const number = user.split("@")[0];

                        await sock.sendMessage(update.id, {
                            text:
`╭━━━〔 👋 BENVENUTO/A 〕━━━╮

Ciao @${number}! 👋

Benvenuto/a nel *${metadata.subject}*! ❤️

Per presentarti al meglio, inviaci:

📸 Una foto a visualizzazione unica
👤 Nome
🎂 Età
📍 Provenienza

📖 Le regole del gruppo sono nella descrizione.

Ti auguriamo una buona permanenza e buon divertimento! 🎉

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`,
                            mentions: [user]
                        });

                    }

                }

            }

            const botIds = [
                sock.user.id,
                sock.user.id.split(":")[0] + "@s.whatsapp.net",
                sock.user.id.split(":")[0] + "@lid"
            ];

            const isBot = update.participants.some(participant => {

                const id = participant.phoneNumber || participant.id;

                return botIds.includes(id);

            });

            if (isBot && update.action === "promote") {

                await sock.sendMessage(update.id, {
                    text:
`🤖 DADAbot ora è amministratore.

Grazie per avermi promosso! 🚀

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
                });

            }
            if (isBot && update.action === "demote") {

                await sock.sendMessage(update.id, {
                    text:
`🤖 DADAbot non è più amministratore.

Alcuni comandi potrebbero non funzionare.

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`
                });

            }

        } catch (err) {
            console.log(err);
        }

    });

    sock.ev.on("messages.upsert", async ({ messages }) => {

        const msg = messages[0];

        if (!msg) return;

        try {
            await handler(sock, msg);
        } catch (err) {
            console.log(err);
        }

    });

    return sock;

}

module.exports = startBot;
