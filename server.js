const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const endpoint = process.env.OPENAI_ENDPOINT;
const api_key = process.env.OPENAI_API_KEY;

// Allow cross origin
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Generic Sock, Standard, This sock is very generic and not really that cool');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/sockIdea', async (req, res) => {
    try {
        const response = await axios.post(OPENAI_ENDPOINT, {
            prompt: "Your prompt here",
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const openAIResponse = response.data.choices[0].text.trim();
        res.send(openAIResponse);
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to retrieve data from OpenAI");
    }
});
