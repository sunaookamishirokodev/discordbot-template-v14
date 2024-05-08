const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");

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
                const isGlobalCooldown = command.options.globalCooldown;
                const cooldownKey = isGlobalCooldown ? "global_" + command.structure.name : interaction.user.id;
                const cooldownFunction = () => {
                    let data = cooldown.get(cooldownKey);

                    data.push(interaction.commandName);

                    cooldown.set(cooldownKey, data);

                    setTimeout(() => {
                        let data = cooldown.get(cooldownKey);

                        data = data.filter((v) => v !== interaction.commandName);

                        if (data.length <= 0) {
                            cooldown.delete(cooldownKey);
                        } else {
                            cooldown.set(cooldownKey, data);
                        }
                    }, command.options.cooldown);
                };

                if (cooldown.has(cooldownKey)) {
                    let data = cooldown.get(cooldownKey);

                    if (data.some((v) => v === interaction.commandName)) {
                        const cooldownMessage = isGlobalCooldown
                            ? `Slow down buddy! This command is on a global cooldown ${command.options.cooldown / 1000}s.`
                            : `Slow down buddy! You're too fast to use this command ${command.options.cooldown / 1000}s.`;

                        await interaction.reply({
                            content: cooldownMessage,
                            ephemeral: true,
                        });

                        return;
                    } else {
                        cooldownFunction();
                    }
                } else {
                    cooldown.set(cooldownKey, [interaction.commandName]);
                    cooldownFunction();
                }
            }

            command.run(client, interaction);
        } catch (error) {
            log(error, "err");
        }
    },
};
