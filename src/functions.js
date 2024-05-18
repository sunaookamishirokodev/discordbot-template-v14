const chalk = require("chalk");
const { PermissionsBitField } = require("discord.js");

/**
 * Logs a message with optional styling.
 *
 * @param {string} string - The message to log.
 * @param {'info' | 'err' | 'warn' | 'done' | undefined} style - The style of the log.
 */
const log = (string, style) => {
    const styles = {
        info: { prefix: chalk.blue("[INFO]"), logFunction: console.log },
        err: { prefix: chalk.red("[ERROR]"), logFunction: console.error },
        warn: { prefix: chalk.yellow("[WARNING]"), logFunction: console.warn },
        done: { prefix: chalk.green("[SUCCESS]"), logFunction: console.log },
    };

    const selectedStyle = styles[style] || { logFunction: console.log };
    selectedStyle.logFunction(`${selectedStyle.prefix || ""} ${string}`);
};

/**
 * Whenever a string is a valid snowflake (for Discord).

 * @param {string} id 
 * @returns {boolean}
 */
const isSnowflake = (id) => {
    return /^\d+$/.test(id);
};

/**
 *
 * @param {PermissionsBitField} permissions
 * @returns
 */

const permissionsNames = (permissions) => {
    const result = [];

    for (const perm of Object.keys(PermissionsBitField.Flags)) {
        if (PermissionsBitField.Flags[perm] === permissions) {
            result.push(perm);
        }
    }
    return result;
};

module.exports = {
    log,
    isSnowflake,
    permissionsNames,
};
