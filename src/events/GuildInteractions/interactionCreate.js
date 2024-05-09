const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../classes/ExtendedClient");

const cooldown = new Map();

module.exports = {
    event: "interactionCreate",
    /**
     *
     * @param {ExtendedClient} client
     * @param {import('discord.js').Interaction} interaction
     * @returns
     */
    run: async (client, interaction) => {
        if (!interaction.isCommand()) return;

        if (config.handler.commands.slash === false && interaction.isChatInputCommand()) return;
        if (config.handler.commands.user === false && interaction.isUserContextMenuCommand()) return;
        if (config.handler.commands.message === false && interaction.isMessageContextMenuCommand()) return;

        const command = client.collection.interactioncommands.get(interaction.commandName);

        if (!command) return;

        try {
            if (command.options?.ownerOnly) {
                if (interaction.user.id !== config.users.ownerId) {
                    await interaction.reply({
                        content: "The bot developer has the only permissions to use this command.",
                        ephemeral: true,
                    });

                    return;
                }
            }

            if (command.options?.developers) {
                if (config.users?.developers?.length > 0 && !config.users?.developers?.includes(interaction.user.id)) {
                    await interaction.reply({
                        content: "You are not authorized to use this command",
                        ephemeral: true,
                    });

                    return;
                } else if (config.users?.developers?.length <= 0) {
                    await interaction.reply({
                        content:
                            "This is a developer only command, but unable to execute due to missing user IDs in configuration file.",

                        ephemeral: true,
                    });

                    return;
                }
            }

            if (command.options?.nsfw && !interaction.channel.nsfw) {
                await interaction.reply({
                    content: "The current channel is not a NSFW channel",
                    ephemeral: true,
                });

                return;
            }

            if (command.options?.cooldown) {
                const setCooldown = (name, time) => {
                    return {
                        name,
                        availableAt: Date.now() + ms(time),
                    };
                };

                if (cooldown.has(interaction.user.id)) {
                    const data = cooldown.get(interaction.user.id);
                    if (data.name === interaction.commandName && data.availableAt <= Date.now()) {
                        await message.reply({
                            content: `Slow down buddy! Try it again in ${time(Date.now() - data.availableAt, "t")}.`,
                        });
                    }
                } else {
                    cooldown.set(interaction.user.id, [setCooldown(interaction.commandName, command.options.cooldown)]);
                }

                setTimeout(() => {
                    let data = cooldown.get(interaction.user.id);

                    if (!data) return;
                    data = data.filter((v) => v.name !== interaction.commandName);

                    if (data.length === 0) {
                        cooldown.delete(interaction.user.id);
                    } else {
                        cooldown.set(interaction.user.id, data);
                    }
                }, ms(command.options.cooldown));

                command.run(client, message, args);
            }

            command.run(client, interaction);
        } catch (error) {
            log(error, "err");
        }
    },
};
