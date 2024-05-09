const { Client, Partials, Collection, ActivityType, PresenceUpdateStatus } = require("discord.js");
const config = require("../config");
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const components = require("../handlers/components");

module.exports = class extends Client {
    collection = {
        interactioncommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection(),
        },
    };
    applicationcommandsArray = [];

    constructor() {
        super({
            intents: 3276799,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User,
                Partials.ThreadMember,
            ],
        });
    }

    start = async () => {
        commands(this);
        events(this);
        components(this);
        await this.login(process.env.CLIENT_TOKEN || config.client.token);
        await this.application.fetch();
        this.user.setActivity("Furina Code Dạo", {
            type: ActivityType.Streaming,
            url: "https://github.com/furinadeveloper",
            state: "Chilling with Furina"
        });
        this.user.setStatus(PresenceUpdateStatus.Online);

        if (config.handler.deploy) deploy(this, config);
    };
};
