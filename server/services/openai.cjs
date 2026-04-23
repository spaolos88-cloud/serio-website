const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getChatResponse(userMessage) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant for Serio Website." },
                { role: "user", content: userMessage },
            ],
            temperature: 0,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return "I'm sorry, I'm having trouble thinking right now.";
    }
}

module.exports = { getChatResponse };
