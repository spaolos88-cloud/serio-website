const axios = require('axios');
const openaiService = require('./openai.cjs');
const bitrixService = require('./bitrix.cjs');

async function handleMessage(senderId, message) {
    if (message.text) {
        console.log(`Received message from ${senderId}: ${message.text}`);

        // 1. Get AI response
        const aiResponse = await openaiService.getChatResponse(message.text);

        // 2. Send response back to Messenger
        await sendMessage(senderId, aiResponse);

        // 3. Sync to Bitrix24
        await bitrixService.syncToBitrix({
            user_id: senderId,
            message: message.text,
            reply: aiResponse,
            timestamp: new Date().toISOString()
        });
    }
}

async function sendMessage(recipientId, text) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`,
            {
                recipient: { id: recipientId },
                message: { text: text }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending Messenger message:', error);
    }
}

module.exports = { handleMessage };
