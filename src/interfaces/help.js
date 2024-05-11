const ExtendedClient = require("../classes/ExtendedClient");
const { EmbedBuilder, userMention, inlineCode, bold } = require("discord.js");
const config = require("../config");
const _ = require("lodash");

/**
 *
 * @param {ExtendedClient} client
 * @param {import("discord.js").Message<true>} message
 * @returns
 */
function HelpInterface(client, message) {
    return new EmbedBuilder()
        .setAuthor({ name: client.user.displayName, iconURL: client.user.avatarURL() })
        .setColor(config.embed.defaultColor)
        // .setFooter({ text: `${_.camelCase(type)} by ${message.author.username}`, iconURL: message.author.avatarURL() })
        // .setDescription(
        //     `${bold("Moderator")}: ${userMention(message.author.id)}.\n${bold("Defendant")}: ${userMention(defendant.id)}.\n${bold("Type")}: ${inlineCode(_.camelCase(type))}.`,
        // )
        .setTimestamp();
}

module.exports = HelpInterface;
