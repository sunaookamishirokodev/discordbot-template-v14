const { CLIENT_TOKEN, CLIENT_ID, GUILD_ID, LOGGER_CHANNEL_ID } = process.env;

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
            message: true
        },
    },
    users: {
        developers: ["345876818328420362", "1216624112139632711"],
        ownerId: "345876818328420362",
    },
    channels: {
        modLogs: {
            enabled: true,
            channel: LOGGER_CHANNEL_ID,
        },
    },
    development: {
        enabled: false,
        guild: GUILD_ID,
    },
};
