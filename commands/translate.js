//If You Need Help https://discord.gg/thailandcodes (This Project Was Made By Shadow)
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('ترجمة النص بين العربية والإنجليزية فقط'),
  async execute(interaction) {
    const userId = interaction.user.id;

    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('ترجمة النصوص')
      .setDescription('أرسل النص الذي تريد ترجمته (عربي أو إنجليزي).')
      .setFooter({ text: 'لديك دقيقتان لإرسال النص' });

    await interaction.reply({ embeds: [embed], ephemeral: true });

    const messageCollector = interaction.channel.createMessageCollector({
      filter: (msg) => msg.author.id === userId,
      max: 1,
      time: 2 * 60 * 1000,
    });

    messageCollector.on('collect', async (message) => {
      const text = message.content;
      message.delete();

      let targetLang = /[a-zA-Z]/.test(text) ? 'ar' : 'en'; 

      try {
        const result = await translate(text, { to: targetLang });
        const translatedEmbed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle('الترجمة')
          .setDescription(`**النص الأصلي:**\n${text}\n\n**الترجمة:**\n${result.text}`)
          .setFooter({ text: `تم الترجمة إلى ${targetLang === 'ar' ? 'العربية' : 'الإنجليزية'}` });

        await interaction.followUp({ embeds: [translatedEmbed], ephemeral: true });
      } catch {
        await interaction.followUp({ content: 'حدث خطأ أثناء الترجمة. حاول لاحقًا.', ephemeral: true });
      }
    });

    messageCollector.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'انتهى الوقت لإرسال النص.', ephemeral: true });
      }
    });
  },
};
//If You Need Help https://discord.gg/thailandcodes (This Project Was Made By Shadow)