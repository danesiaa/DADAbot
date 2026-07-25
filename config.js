require("dotenv").config();

module.exports = {
    BOT_NAME: "DADAbot",
    OWNER_NAME: "Mirko",
    PREFIX: ".",

    SESSION_ID: process.env.SESSION_ID || "",
    PORT: process.env.PORT || 3000
};