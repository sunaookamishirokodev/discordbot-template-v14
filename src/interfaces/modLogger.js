const ExtendedClient = require("../classes/ExtendedClient");
const { EmbedBuilder, userMention, inlineCode, bold } = require("discord.js");
const config = require("../config");
const _ = require("lodash");

/**
 *
 * @param {ExtendedClient} client
 * @param {import("discord.js").User} mod
 * @param {"ban" | "kick" | "mute" | "warn"} type
 * @param {import('discord.js').User} defendant
 * @returns
 */
function ModLoggerInterface(client, mod, defendant, type) {
    return new EmbedBuilder()
        .setAuthor({ name: client.user.displayName, iconURL: client.user.avatarURL() })
        .setColor(config.embed.defaultColor)
        .setFooter({ text: `${_.camelCase(type)} by ${mod.displayName}`, iconURL: mod.avatarURL() })
        .setDescription(
            `${bold("Moderator")}: ${userMention(mod.id)}.\n${bold("Defendant")}: ${userMention(defendant.id)}.\n${bold("Type")}: ${inlineCode(_.camelCase(type))}.`,
        )
        .setTimestamp();
}

module.exports = ModLoggerInterface;
