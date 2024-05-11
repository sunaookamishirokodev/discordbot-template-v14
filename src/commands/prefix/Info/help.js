const { Message, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");
const config = require("../../../config");
const prisma = require("../../../handlers/database");

module.exports = {
    structure: {
        name: "help",
        aliases: [],
        cooldown: "5s",
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const data = await prisma.guild.findUnique({
            where: { id: message.guildId },
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

        await message.reply({
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
