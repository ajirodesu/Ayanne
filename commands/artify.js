const axios = require('axios');

module.exports = {
  name: 'artify',
  adminOnly: false,
  ownerOnly: false,
  category: 'Fun',
  description: 'Apply the artify effect to an image or your profile picture',
  guide: 'Reply to an image with /artify or use /artify to apply the artify effect to your profile picture.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;

    // Check if the message is a reply to an image
    let imageUrl;
    if (msg.reply_to_message && msg.reply_to_message.photo) {
      // Get the file ID of the image from the replied message
      const fileId = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id;

      // Get the file URL for the replied image
      const fileInfo = await bot.getFile(fileId);
      imageUrl = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.file_path}`;
    } else {
      // Use the user's profile picture if no image is replied to
      const userId = msg.from.id;
      const profilePhotos = await bot.getUserProfilePhotos(userId);

      if (profilePhotos.total_count > 0) {
        // Get the file ID of the user's profile picture
        const fileId = profilePhotos.photos[0][profilePhotos.photos[0].length - 1].file_id;

        // Get the file URL for the profile picture
        const fileInfo = await bot.getFile(fileId);
        imageUrl = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.file_path}`;
      } else {
        return bot.sendMessage(chatId, 'Please reply with an image or make sure you have a profile picture.');
      }
    }

    // Build the API URL with the image URL and API key
    const apiUrl = `https://api.elianabot.xyz/fun/artify.php?imageurl=${encodeURIComponent(imageUrl)}&api=EYCCLCALSPITLAG`;

    try {
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      // Send the artified image received from the API
      await bot.sendPhoto(chatId, imageBuffer, { caption: 'Here is your artified image!' });
    } catch (error) {
      console.error('Error in artify command:', error);
      bot.sendMessage(chatId, 'An error occurred while processing your request.');
    }
  }
};
