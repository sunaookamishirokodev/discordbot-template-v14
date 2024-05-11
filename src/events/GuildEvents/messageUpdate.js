const config = require("../../config");
const ExtendedClient = require("../../classes/ExtendedClient");
const UserLoggerInterface = require("../../interfaces/userLogger");

module.exports = {
    event: "messageUpdate",
    /**
     *
     * @param {ExtendedClient} client
     * @param {import('discord.js').Message} oldMessage
     * @param {import('discord.js').Message} newMessage
     * @returns
     */
    run: async (client, oldMessage, newMessage) => {
        if (!(config.channels.modLogs.enabled && config.channels.modLogs.channel)) return;

        const modLogsChannel = client.channels.cache.get(config.channels.modLogs.channel);

        if (!modLogsChannel || modLogsChannel.guildId !== newMessage.guildId) return;

        if (oldMessage.author.bot || newMessage.author.bot) return;

        const embed = UserLoggerInterface(client, oldMessage, newMessage, "update");

        try {
            await modLogsChannel.send({
                embeds: [embed],
            });
        } catch (err) {
            console.error(err);
        }
    },
};
