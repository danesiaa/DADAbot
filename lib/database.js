const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database", "users.json");

function loadDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
    }

    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function getUser(id, name = "Utente") {

    const db = loadDB();

    if (!db[id]) {

        db[id] = {
            jid: id,
            name: name,
            messages: 0,
            warns: 0,
            xp: 0,
            level: 1
        };

        saveDB(db);

    }

    return db[id];

}

function updateUser(id, data) {

    const db = loadDB();

    db[id] = {
        ...db[id],
        ...data,
        jid: id
    };

    saveDB(db);

}

module.exports = {
    loadDB,
    saveDB,
    getUser,
    updateUser
};