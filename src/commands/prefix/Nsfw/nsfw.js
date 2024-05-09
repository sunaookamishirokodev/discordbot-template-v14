const { Message, PermissionFlagsBits } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");

module.exports = {
    structure: {
        name: "nsfw",
        aliases: ["ns"],
        permissions: PermissionFlagsBits.SendMessages,
        cooldown: "5s",
        nsfw: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        await message.reply({
            content: "NSFW Command",
        });
    },
};
