const ExtendedClient = require("../classes/ExtendedClient");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");
const _ = require("lodash");
const helpEmojis = require("../data/helpEmojis.json");

/**
 *
 * @param {ExtendedClient} client
 * @param {import("discord.js").Message<true>} message
 * @returns
 */
async function HelpInterface(client, message) {
    const content = Object.keys(client.categories).map((cmd) => {
        const _cmd = client.categories[cmd].map((_c) => `\`${_c.name}\``);

        return {
            name: `${helpEmojis[cmd]} **|** ${_.startCase(cmd)}.`,
            value: _cmd.join(" "),
        };
    });

    return await message.reply({
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                    name: client.user.displayName + " - Command list",
                    iconURL: client.user.displayAvatarURL(),
                })
                .setColor(config.embed.defaultColor)
                .addFields(content)
                .setFooter({
                    text: `Requested by ${message.author.displayName}`,
                    iconURL: message.author.avatarURL(),
                })
                .setTimestamp(),
        ],
    });
}

/**
 *
 * @param {ExtendedClient} client
 * @param {import("discord.js").Message<true>} message
 * @param {string} cmd
 * @returns
 */
async function HelpDetailInterface(client, message, cmd) {
    const _cmd = client.cmds[cmd];
    if (!_cmd) {
        return await message.reply({
            content: "Command not found",
        });
    }

    const content = [
        `**Name:** ${_cmd.name}`,
        `**Aliases:** ${_cmd.aliases}`,
        `**Description:** ${_cmd.desc}`,
        `**Nsfw:** ${_cmd.nsfw}`,
        `**Category:** ${_cmd.category}`,
        `**Permissions:** ${_cmd.permissions}`,
        `**Cooldown:** ${_cmd.cooldown}`,
    ];

    return await message.reply({
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                    name: `Command detail - ${cmd}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setColor(config.embed.defaultColor)
                .setDescription(content.join("\n"))
                .setFooter({
                    text: `Requested by ${message.author.displayName}`,
                    iconURL: message.author.avatarURL(),
                })
                .setTimestamp(),
        ],
    });
}

module.exports = {
    HelpInterface,
    HelpDetailInterface,
};
