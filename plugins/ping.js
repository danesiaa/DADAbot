module.exports = {
    name: "ping",

    async execute(sock, msg) {

        const start = Date.now();

        const sent = await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: "🏓 Calcolo del ping..."
            },
            {
                quoted: msg
            }
        );

        const end = Date.now();

        const ping = end - start;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`╭━━━〔 🏓 PING 〕━━━╮

🤖 DADAbot è operativo!

⚡ Ping: ${ping} ms

━━━━━━━━━━━━━━━━━━
Powered by DADAbot`,
                edit: sent.key
            }
        );

    }
};