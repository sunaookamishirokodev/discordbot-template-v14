const { ChannelType, Message } = require("discord.js");
const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");
const prisma = require("../../handlers/database");

const cooldown = new Map();

module.exports = {
    event: "messageCreate",
    /**
     *
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @returns
     */
    run: async (client, message) => {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;

        if (!config.handler.commands.prefix) return;

        const data = await prisma.guild.findUnique({
            where: { id: message.guildId },
            select: { prefix: true },
        });

        const prefix = data?.prefix || config.handler.prefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandInput = args.shift().toLowerCase();

        if (!commandInput.length) return;

        let command =
            client.collection.prefixcommands.get(commandInput) ||
            client.collection.prefixcommands.get(client.collection.aliases.get(commandInput));

        if (command) {
            try {
                if (command.structure?.ownerOnly) {
                    if (message.author.id !== config.users.ownerId) {
                        await message.reply({
                            content: "The bot developer has the only permissions to use this command.",
                            ephemeral: true,
                        });

                        return;
                    }
                }

                if (command.structure?.permissions && !message.member.permissions.has(command.structure?.permissions)) {
                    await message.reply({
                        content: "You do not have the permission to use this command.",
                        ephemeral: true,
                    });

                    return;
                }

                if (command.structure?.developers) {
                    if (!config.users.developers.includes(message.author.id)) {
                        await message.reply({
                            content: "You are not authorized to use this command",
                            ephemeral: true,
                        });

                        return;
                    }
                }

                if (command.structure?.nsfw && !message.channel.nsfw) {
                    await message.reply({
                        content: "The current channel is not a NSFW channel.",
                        ephemeral: true,
                    });

                    return;
                }

                if (command.structure?.cooldown) {
                    const cooldownFunction = () => {
                        let data = cooldown.get(message.author.id);

                        data.push(commandInput);

                        cooldown.set(message.author.id, data);

                        setTimeout(() => {
                            let data = cooldown.get(message.author.id);

                            data = data.filter((v) => v !== commandInput);

                            if (data.length <= 0) {
                                cooldown.delete(message.author.id);
                            } else {
                                cooldown.set(message.author.id, data);
                            }
                        }, command.structure?.cooldown);
                    };

                    if (cooldown.has(message.author.id)) {
                        let data = cooldown.get(message.author.id);

                        if (data.some((v) => v === commandInput)) {
                            await message.reply({
                                content: `Slow down buddy! You're too fast to use this command ${command.structure.cooldown / 1000}s.`,
                                ephemeral: true,
                            });

                            return;
                        } else {
                            cooldownFunction();
                        }
                    } else {
                        cooldown.set(message.author.id, [commandInput]);

                        cooldownFunction();
                    }
                }

                command.run(client, message, args);
            } catch (error) {
                log(error, "err");
            }
        }
    },
};
