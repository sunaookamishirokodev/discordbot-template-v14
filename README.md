# <samp>DiscordJS-V14-Bot-Template</samp> v2

A simplified and popular Discord bot commands & events handler built with discord.js version 14 and written in JavaScript. This handler can load up to 4 different types of commands: Prefix, Slash, User context, and Message context. It can also handle components, including Buttons, Modals, Select menus (any type), and autocomplete.

Did you like my project? Click on the star button (⭐️) right above your screen, thank you!

## Features
- Using latest [discord.js v14.x version](https://github.com/discordjs/discord.js/releases).
- Supports all possible type of commands.
    - Message commands (AKA: Prefix commands).
    - Application commands:
        - Chat Input
        - User context
        - Message context
- Components Handler.
    - Buttons
    - Select menus
    - Modals
    - Autocomplete
- Easy and simple to use.
- Advanced command options ([click here](#command-options)).
- Updated to latest discord.js version.
- Included a database: all database prisma support.

## Commands, events, and components structure

This Discord bot template uses CommonJS modules. You cannot use `import`, `export`, or any related keywords from the ES6 modules.


### Prefix commands:
```ts
module.exports = {
    structure: {
        name: string,
        description: string,
        aliases: string[],
        permissions?: PermissionResolvable,
        cooldown?: "5s" | "1d" | ...,
        ownerOnly?: boolean,
        developers?: boolean,
        nsfw?: boolean
    },
    run: (client, message, args) => void
};
```

### Slash/User/Message context commands:
```ts
module.exports = {
    structure: SlashCommandBuilder | ContextMenuCommandBuilder,
    options?: {
        cooldown?: number,
        globalCooldown?: boolean,
        ownerOnly?: boolean,
        developers?: boolean,
        nsfw?: boolean
    },
    run: (client, interaction) => void
};
```

### Event listener:

The `...args` is a spread operator of arguments from the event chosen. For an example, if the event is **'messageCreate'**, the first argument is going to be type of **Message**.

```ts
module.exports = {
    event: string,
    once?: boolean,
    run: (client, ...args) => void
};
```

### Component:

The `interaction` is the interaction of the component. For an example, if the custom ID is from a button, the interaction is type of ButtonInteraction.

```ts
module.exports = {
    customId: string,
    options?: {
        public?: boolean
    },
    run: (client, interaction) => void
};
```

## Requirements
### Packages:
- **chalk** v2.4.2
- **discord.js** v^14.13.0
- **dotenv** v^latest
- **prisma** v^latest
- **@prisma/client** v^latest

> [!WARNING]
> Installing any version from the package `chalk` that is over **v2.4.2** will throw an error that you must enable ES6 modules, while this handler uses CommonJS modules.

### Platforms:
- **Node.js** v16.9.0 or newer

## Setup
1. Install Visual Studio Code.
2. Download this project as a **.zip** file: [Click here](https://github.com/TFAGaming/DiscordJS-V14-Bot-Template/archive/refs/heads/main.zip)
3. Extract the .zip file into a normal folder.
4. Open VSCode, click on **Open Folder**, and select the new created folder.
5. Go to `src/` and rename `example.config.js` to `config.js` and fill all the required values. You can use ENV instead of `config.js` to keep your bot token and ID, and your database URL in a secured place by renaming the file `.env.example` to `.env` and filling all required values.

> [!CAUTION]
> Sharing your Discord bot's token with anyone is a very risky move since you'll allow them to use your bot. This is also a dangerous move for the database; we don't recommend using any public URIs or sharing your database connection URL.

6. Initialize a new npm package:

```
npm init -y
```

7. Install all [required packages](#packages):

```
npm install chalk@2.4.2 discord.js@latest dotenv prisma @prisma/client
```

8. To start your bot, run `node .` or `npm run start`.
9. Enjoy. =)

## Command options
The command options, each property is optional, which means it's allowed to provide an `undefined` value to one of these properties below.

- `permissions` (**PermissionFlagsBits** | **string**): The required permissions for the command, available to message commands only.
- `cooldown` (**string**): The cooldown of the command.
- `developers` (**boolean**): Determines whether the command is executable only to the developers of the bot.
- `nsfw` (**boolean**): Determines whether this command is executable only in NSFW channels.

## Component options
The component options, each property is optional which means it's allowed to provide an `undefined` value to one of these properties below.

- `public` (**boolean**): If set to true, the component will be available to everyone (default), if set to false, the component will be available to the component owner (original interaction user) only.

## FAQs
### 1. I'm getting this error: "Unable to load application commands to Discord API"
- The bot token and/or bot ID are invalid.
- The bot token and bot ID are not from the same Discord bot.
- Too many application commands.
    - 100 Global Chat input (AKA: Slash) commands.
    - 5 Global User context commands.
    - 5 Global Message context commands.
- Invalid application command structure.
    - Missing description, type, or any required properties for a command.
    - The command cannot be modified.
- The Discord API has an issue ([Verify Discord status](https://discordstatus.com/)).

[Learn more...](https://discord.com/developers/docs/interactions/application-commands#registering-a-command)

### 2. I'm unable to view any application commands, no errors in console?
This is a common problem for developers, to fix this issue, restart the Discord app or go in a different text channel.

## Contributors
Thank you to all the people who contributed to **DiscordJS-V14-Bot-Template**!

<img src="https://contrib.rocks/image?repo=TFAGaming/DiscordJS-V14-Bot-Template">

## Support
Join our Discord server if you need any help!

<a href="https://discord.gg/E6VFACWu5V">
  <img src="https://discord.com/api/guilds/918611797194465280/widget.png?style=banner3">
</a>

## License
[**GPL-3.0**](./LICENSE), General Public License v3