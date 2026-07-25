const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database", "groups.json");

// Carica il database dei gruppi
function loadGroups() {

    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
    }

    return JSON.parse(fs.readFileSync(dbPath, "utf8"));

}

// Salva il database
function saveGroups(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Ottiene il gruppo
function getGroup(id) {

    const db = loadGroups();

    if (!db[id]) {

        db[id] = {
            commands: false,
            welcome: false,
            antilink: false
        };

        saveGroups(db);

    }

    return db[id];

}

// Aggiorna il gruppo
function updateGroup(id, data) {

    const db = loadGroups();

    db[id] = {
        ...db[id],
        ...data
    };

    saveGroups(db);

}

// Attiva/disattiva i comandi
function setCommands(id, value) {

    const group = getGroup(id);

    group.commands = value;

    updateGroup(id, group);

}

// Attiva/disattiva il welcome
function setWelcome(id, value) {

    const group = getGroup(id);

    group.welcome = value;

    updateGroup(id, group);

}

// Attiva/disattiva l'anti-link
function setAntiLink(id, value) {

    const group = getGroup(id);

    group.antilink = value;

    updateGroup(id, group);

}

module.exports = {
    loadGroups,
    saveGroups,
    getGroup,
    updateGroup,
    setCommands,
    setWelcome,
    setAntiLink
};