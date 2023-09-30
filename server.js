const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const endpoint = process.env.OPENAI_ENDPOINT;
const api_key = process.env.OPENAI_API_KEY;

// Allow cross origin
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Generic Sock, Standard, This sock is very generic and not really that cool');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/sockIdea', async (req, res) => {
    // Extracting size and type from the request body
    const { size, type } = req.body;

    try {
        const response = await axios.post(endpoint, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are going to give sock ideas. You only respond with three values separated by a comma. These are the Name of the sock, The type of sock, and the description of the sock. You never use commas except when separating the values."
                },
                {
                    role: "user",
                    content: `Give me a cool sock idea for a ${type} themed ${size}!`
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            }
        });

        const openAIResponse = response.data.choices[0].message.content;
        res.send(openAIResponse);
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to retrieve data from OpenAI");
    }
});
