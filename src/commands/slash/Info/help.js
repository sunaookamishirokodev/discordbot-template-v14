const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");
const config = require("../../../config");
const prisma = require("../../../handlers/database");

module.exports = {
    structure: new SlashCommandBuilder().setName("help").setDescription("View all the possible commands!"),
    options: {
        cooldown: "5s",
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.deferReply();

        const data = await prisma.guild.findUnique({
            where: { id: interaction.guildId },
            select: { prefix: true },
        });

        const prefix = data?.prefix || config.handler.prefix;

        const mapIntCmds = client.applicationcommandsArray.map(
            (v) => `\`${v.type === 2 || v.type === 3 ? "" : "/"}${v.name}\`: ${v.description || "(No description)"}`,
        );
        const mapPreCmds = client.collection.prefixcommands.map(
            (v) =>
                `\`${prefix}${v.structure.name}\` (${v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(", ") : "None"}): ${v.structure.description || "(No description)"}`,
        );

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Help command")
                    .addFields(
                        { name: "Slash commands", value: `${mapIntCmds.join("\n")}` },
                        { name: "Prefix commands", value: `${mapPreCmds.join("\n")}` },
                    ),
            ],
        });
    },
};
