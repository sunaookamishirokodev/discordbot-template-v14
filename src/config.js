const { CLIENT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

module.exports = {
  client: {
    token: CLIENT_TOKEN,
    id: CLIENT_ID,
  },
  handler: {
    prefix: "shu?",
    deploy: true,
    commands: {
      prefix: true,
      slash: true,
    },
  },
  users: {
    developers: ["345876818328420362", "1216624112139632711"],
    ownerId: "345876818328420362",
  },
  channels: {
    modLogs: {
      enabled: false,
      channel: "The moderation-logs channel",
    },
  },
  development: {
    enabled: false,
    guild: GUILD_ID,
  },
};