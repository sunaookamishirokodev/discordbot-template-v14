const config = require("../../config");
const ExtendedClient = require("../../classes/ExtendedClient");
const UserLoggerInterface = require("../../interfaces/userLogger");

module.exports = {
    event: "messageDelete",
    /**
     *
     * @param {ExtendedClient} client
     * @param {import('discord.js').Message} message
     * @returns
     */
    run: async (client, message) => {
        if (!(config.channels.modLogs.enabled && config.channels.modLogs.channel)) return;

        const modLogsChannel = client.channels.cache.get(config.channels.modLogs.channel);

        if (!modLogsChannel || modLogsChannel.guildId !== message.guild.id) return;

        if (message.author.bot) return;

        const embed = UserLoggerInterface(client, message, null, "delete");

        try {
            await modLogsChannel.send({
                embeds: [embed],
            });
        } catch (err) {
            console.error(err);
        }
    },
};
