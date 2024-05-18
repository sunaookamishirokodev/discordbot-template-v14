const { ChannelType, Message, time } = require("discord.js");
const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../classes/ExtendedClient");
const ms = require("ms");

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

        const data = await client.prisma.guild.findUnique({
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
                        return await message.reply({
                            content: "The bot developer has the only permissions to use this command.",
                        });
                    }
                }

                if (command.structure?.permissions && !message.member.permissions.has(command.structure?.permissions)) {
                    return await message.reply({
                        content: "You do not have the permission to use this command.",
                    });
                }

                if (command.structure?.developers) {
                    if (!config.users.developers.includes(message.author.id)) {
                        return await message.reply({
                            content: "You are not authorized to use this command",
                        });
                    }
                }

                if (command.structure?.nsfw && !message.channel.nsfw) {
                    return await message.reply({
                        content: "The current channel is not a NSFW channel.",
                    });
                }

                if (command.structure?.cooldown) {
                    const setCooldown = (name, time) => {
                        return {
                            name,
                            availableAt: Date.now() + ms(time),
                        };
                    };

                    if (cooldown.has(message.author.id)) {
                        let data = cooldown.get(message.author.id);
                        data = data.filter((d) => d.name === commandInput);
                        data = data[0];
                        if (data?.availableAt >= Date.now()) {
                            await message
                                .reply({
                                    content: `Slow down buddy! Try it again in ${time(Math.floor(data.availableAt / 1000), "R")}.`,
                                })
                                .then((m) => setTimeout(() => m.delete(), data.availableAt - Date.now()));

                            return;
                        }
                    } else {
                        cooldown.set(message.author.id, [setCooldown(commandInput, command.structure.cooldown)]);
                    }

                    setTimeout(() => {
                        let data = cooldown.get(message.author.id);

                        if (!data) return;
                        data = data.filter((v) => v.name !== commandInput);

                        if (data.length === 0) {
                            cooldown.delete(message.author.id);
                        } else {
                            cooldown.set(message.author.id, data);
                        }
                    }, ms(command.structure.cooldown));

                    command.run(client, message, args);
                }
            } catch (error) {
                log(error, "err");
            }
        }
    },
};
