const ExtendedClient = require("../classes/ExtendedClient");
const { EmbedBuilder, userMention, inlineCode, bold, codeBlock } = require("discord.js");
const config = require("../config");
const _ = require("lodash");

/**
 *
 * @param {ExtendedClient} client
 * @param {import('discord.js').Message<true>} oldMessage
 * @param {import('discord.js').Message<true> | null} newMessage
 * @param {"delete" | "update" | "badword" | "massEmoji"} type
 * @returns
 */
function UserLoggerInterface(client, oldMessage, newMessage, type) {
    let detailLogger;

    switch (type) {
        case "delete":
            detailLogger = `${bold("Message")}:\n${codeBlock(oldMessage.content)}`;
            break;

        case "update":
            detailLogger = `${bold("Message before")}:\n${codeBlock(oldMessage.content)}\n${bold("Message after")}:\n${codeBlock(newMessage?.content)}`;
            break;

        case "badword":
            detailLogger = `${bold("Content")}:\n${codeBlock(oldMessage.content)}`;
            break;

        case "massEmoji":
            detailLogger = `${bold("Content")}:\n${codeBlock(oldMessage.content)}`;
            break;

        default:
            throw Error("Invalid type!");
    }

    return new EmbedBuilder()
        .setAuthor({ name: client.user.displayName, iconURL: client.user.avatarURL() })
        .setColor(config.embed.defaultColor)
        .setFooter({ text: `Performed by ${oldMessage.author.username}`, iconURL: oldMessage.author.avatarURL() })
        .setDescription(
            `${bold("User")}: ${userMention(oldMessage.author.id)}.\n${bold("Type")}: ${inlineCode(_.camelCase(type))}.\n${detailLogger}`,
        )
        .setTimestamp();
}

module.exports = UserLoggerInterface;
