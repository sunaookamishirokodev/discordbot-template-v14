const {
    Client,
    Partials,
    Collection,
    ActivityType,
    PresenceUpdateStatus,
} = require("discord.js");
const config = require("../config");
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const components = require("../handlers/components");
const { PrismaClient } = require("@prisma/client");
const _ = require("lodash");
const { permissionsNames, log } = require("../functions");

const prisma = new PrismaClient();
const ExtendedClient = class extends Client {
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
        this.prisma = prisma;
        commands(this);
        events(this);
        components(this);
        const categories = {};
        const cmds = {};

        this.collection.prefixcommands.mapValues((cmd) => {
            if (!cmd.structure.category)
                log(`Unable load category of ${cmd.structure.name}`, "err");
            if (!categories[cmd.structure?.category || "others"])
                categories[cmd.structure?.category || "others"] = [];

            const structure = {
                name: cmd.structure.name,
                desc: cmd.structure?.description || "no description available.",
                aliases:
                    cmd.structure?.aliases && cmd.structure.aliases.length !== 0
                        ? cmd.structure.aliases.map((alias) => alias)
                        : "no alias available",
                category:
                    cmd.structure?.category || "no category available",
                cooldown: cmd.structure.cooldown || "no cooldown available",
                permissions:
                    cmd.structure?.permissions &&
                    cmd.structure.permissions.length !== 0
                        ? permissionsNames(cmd.structure.permissions)
                              .map((perm) => _.startCase(perm))
                              .join(", ")
                        : "everyone",
                nsfw: cmd.structure?.nsfw ? "yes" : "no"
            };

            categories[cmd.structure.category].push(structure);
            cmds[cmd.structure.name] = structure;
            cmd.structure?.aliases?.forEach((alias) => {
                cmds[alias] = structure;
            });
        });

        this.categories = categories;
        this.cmds = cmds;
        await this.login(process.env.CLIENT_TOKEN || config.client.token);
        await this.application.fetch();
        this.user.setActivity("xD", {
            type: ActivityType.Streaming,
            url: "https://twitch.com/abc",
            state: "xD",
        });
        this.user.setStatus(PresenceUpdateStatus.Online);

        if (config.handler.deploy) deploy(this, config);
    };
};

module.exports = ExtendedClient;
