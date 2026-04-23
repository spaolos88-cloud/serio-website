require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const messengerService = require('./services/messenger.cjs');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// Webhook verification
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhook_event = entry.messaging[0];
            console.log(webhook_event);

            if (webhook_event.message) {
                messengerService.handleMessage(webhook_event.sender.id, webhook_event.message);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
