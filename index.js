
const express = require('express');
// const axios = require('axios');
require('dotenv').config();

const cors = require("cors")

const app = express();
app.use(cors())
const port = process.env.PORT || 8080;

app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/shayri', async (req, res) => {
  try {
    
    const {keyword,language}=req.body
    

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are a poet, so tell me a poet about ${keyword} in ${language}.`,
        max_tokens: 1000,//setting the words limit
        temperature: 1.2,
      });

      const joke = response.data.choices[0].text.trim();

    res.json({ joke });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});