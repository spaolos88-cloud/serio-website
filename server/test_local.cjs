require('dotenv').config();
const messengerService = require('./services/messenger.cjs');

// Mock local test
async function test() {
    console.log("Starting local test...");
    await messengerService.handleMessage('test_user_id', { text: 'Hello, I need help with Serio products.' });
    console.log("Test completed.");
}

test();
