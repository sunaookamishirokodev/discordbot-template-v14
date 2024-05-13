const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AttachmentBuilder } = require("discord.js");
const ExtendedClient = require("../../../classes/ExtendedClient");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Execute some codes.")
        .addStringOption((option) =>
            option.setName("code").setDescription("The code to be executed.").setRequired(true),
        ),
    options: {
        ownerOnly: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction<true>} interaction
     */
    run: async (client, interaction) => {
        const code = interaction.options.getString("code");
        console.log(code)
        const resultEmbed = new EmbedBuilder()
            .setFooter({
                text: `Gỡ lỗi cho ${client.user.username}`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setColor("Random")
            .setTimestamp();

        const speed = Date.now() - interaction.createdTimestamp;

        try {
            const executed = await eval(code);
            resultEmbed
                .setAuthor({
                    name: `Đã thành công!`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                    {
                        name: "・Type",
                        value: `\`\`\`prolog\n${typeof executed}\`\`\``,
                    },
                    {
                        name: "・Speed",
                        value: `\`\`\`ytml\n${speed}ms\`\`\``,
                    },
                    {
                        name: `・Code`,
                        value: `\`\`\`js\n${code}\`\`\``,
                    },
                    {
                        name: `・Output`,
                        value: `\`\`\`js\n${inspect(executed, { depth: 0 })}\`\`\``,
                    },
                );
        } catch (error) {
            resultEmbed
                .setAuthor({
                    name: `Đã thất bại.`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                    {
                        name: `・Code`,
                        value: `\`\`\`js\n${code}\`\`\``,
                    },
                    {
                        name: `・Error`,
                        value: `\`\`\`js\n${error.name}: ${error.message}\`\`\``,
                    },
                );
        }

        try {
            await interaction.reply({ embeds: [resultEmbed] });
        } catch (error) {
            console.error(error);
        }
    },
};
