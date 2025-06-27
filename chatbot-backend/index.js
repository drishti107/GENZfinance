const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }]
        });

        const reply = aiResponse.choices[0].message.content.trim();
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI Response Failed' });
    }
});

app.listen(PORT, () => console.log(`Chatbot Backend running on port ${PORT}`));
