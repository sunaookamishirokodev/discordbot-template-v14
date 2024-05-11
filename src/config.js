const { CLIENT_TOKEN, CLIENT_ID, GUILD_ID, MOD_LOGGER_CHANNEL_ID, USER_LOGGER_CHANNEL_ID } = process.env;

module.exports = {
    client: {
        token: CLIENT_TOKEN,
        id: CLIENT_ID,
    },
    handler: {
        prefix: "f?",
        deploy: true,
        commands: {
            prefix: true,
            slash: true,
            user: true,
            message: true,
        },
    },
    embed: {
        defaultColor: "#00FFFF",
    },
    users: {
        developers: ["345876818328420362", "1216624112139632711"],
        ownerId: "345876818328420362",
    },
    channels: {
        modLogs: {
            enabled: true,
            channel: MOD_LOGGER_CHANNEL_ID,
        },
        userLogs: {
            enabled: true,
            channel: USER_LOGGER_CHANNEL_ID,
        },
    },
    development: {
        enabled: false,
        guild: GUILD_ID,
    },
};
