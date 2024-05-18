const { Message } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");
const {
    HelpInterface,
    HelpDetailInterface,
} = require("../../../interfaces/help");
const config = require("../../../config");

module.exports = {
    structure: {
        name: "help",
        description: `Dùng để xem danh sách lệnh/chi tiết lệnh bằng cách sử dụng \`${config.handler.prefix}help <tên lệnh>\``,
        aliases: [],
        cooldown: "5s",
        category: "infomation",
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const cmd = args[0];
        if (!cmd) {
            return await HelpInterface(client, message);
        } else {
            return await HelpDetailInterface(client, message, cmd);
        }
    },
};
