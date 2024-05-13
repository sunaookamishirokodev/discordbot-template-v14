const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");

module.exports = {
    structure: new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
    options: {
        cooldown: "5s",
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.reply(
            `🏓Latency is ${Date.now() - interaction.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms`,
        );
    },
};
