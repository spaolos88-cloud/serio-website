const axios = require('axios');

async function syncToBitrix(data) {
    try {
        const response = await axios.post(process.env.BITRIX_WEBHOOK_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error syncing to Bitrix24:', error);
        throw error;
    }
}

module.exports = { syncToBitrix };
