const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database", "muted.json");

function loadMuted() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
    }

    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveMuted(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function muteUser(group, user) {

    const db = loadMuted();

    if (!db[group]) db[group] = [];

    if (!db[group].includes(user)) {
        db[group].push(user);
    }

    saveMuted(db);

}

function unmuteUser(group, user) {

    const db = loadMuted();

    if (!db[group]) return;

    db[group] = db[group].filter(x => x !== user);

    saveMuted(db);

}

function isMuted(group, user) {

    const db = loadMuted();

    if (!db[group]) return false;

    return db[group].includes(user);

}

module.exports = {
    muteUser,
    unmuteUser,
    isMuted
};