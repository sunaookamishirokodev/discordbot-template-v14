const { Message, PermissionFlagsBits } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");
const config = require("../../../config");
const prisma = require("../../../handlers/database");

module.exports = {
    structure: {
        name: "prefix",
        aliases: [],
        permissions: PermissionFlagsBits.Administrator,
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const type = args[0];

        switch (type) {
            case "set": {
                const prefix = args[1];

                if (!prefix) {
                    await message.reply({
                        content: "You need to provide the prefix as a second parameter.",
                    });

                    return;
                }

                try {
                    const data = await prisma.guild.upsert({
                        where: { id: message.guildId },
                        create: { id: message.guildId, prefix },
                        update: { prefix },
                        select: { prefix: true },
                    });

                    await message.reply({
                        content: `The prefix has been changed to \`${data.prefix}\`.`,
                    });
                } catch (error) {
                    console.error(error);
                }

                break;
            }

            case "reset": {
                const prefix = config.handler.prefix;
                await prisma.guild.upsert({
                    where: { id: message.guildId },
                    create: { id: message.guildId, prefix },
                    update: { prefix },
                    select: { prefix: true },
                });

                await message.reply({
                    content: `The new prefix on this server is: \`${prefix}\` (default).`,
                });

                break;
            }

            default: {
                await message.reply({
                    content: "Allowed methods: `set`, `reset`",
                });

                break;
            }
        }
    },
};
