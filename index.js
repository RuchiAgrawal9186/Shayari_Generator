
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

app.post('/jokes', async (req, res) => {
  try {
    // let keyword = req.query.keyword;
    // let  language = req.query.language;
    const {keyword,language}=req.body
    const numJokes = 3; // Number of jokes you want to generate

    const jokes = [];

    for (let i = 0; i < numJokes; i++) {

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are a comedian, so tell me a joke about ${keyword} in ${language}.`,
        max_tokens: 1000,//setting the words limit
        temperature: 1.2,
      });

      const joke = response.data.choices[0].text.trim();
      jokes.push(joke);

    }
    const jokesText = jokes.join('\n\n');

    res.json({ jokesText });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});