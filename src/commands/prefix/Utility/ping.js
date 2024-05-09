const { Message } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");

module.exports = {
    structure: {
        name: "ping",
        aliases: [],
        cooldown: "5s",
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        await message.reply({
            content: "Pong! " + client.ws.ping,
        });
    },
};
