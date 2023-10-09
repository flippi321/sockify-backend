const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const endpoint = process.env.OPENAI_ENDPOINT;
const api_key = process.env.OPENAI_API_KEY;

// Allow cross origin
app.use(cors({
    origin: '*'
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const getSocks = (type, size) => {
    switch(type){
        case("SCI-FI"):
            return ("technical SCI-FI " + size + " using cool futuristic terms describing it's functionality and looks");
        case("Steampunk"):
            return ("steampunk-themed " + size + " incorporating steam techonolgy and cogs. Use a somewhat old english dialect when writing");
        case("Festive"):
            return ("festive " + size + " themed around a holiday or festival. Describe details about the socks and how they corrolate to the given festivity");
        case("Soviet"):
            return ("terrible quality, ironicly bad Soviet " + size + " written in a sterotypically bad Soviet dialect");
    }
    return "pair of normal " + size + " socks. Describe the socks generic and boring details, or lack therof";
};

app.post('/sockIdea', async (req, res) => {
    // Extracting size and type from the request body
    const { size, type } = req.body;

    try {
        const response = await axios.post(endpoint, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are going to give sock ideas structured like this: [Name]; [type]; [slogan]; [description] (With the semicolons). The description has to be 3-5 sentences long and reflect on the quality (Terrible quality socks should be ridiculed). Describe the socks in a cool and unique manner!"
                },
                {
                    role: "user",
                    content: `Give me a cool sock idea for a ${getSocks(type, size)}!`
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
