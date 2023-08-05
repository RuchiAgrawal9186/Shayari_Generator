
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const cors = require("cors")

const app = express();
app.use(cors())
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/jokes', async (req, res) => {
  try {
    let keyword = req.query.keyword;
    let  language = req.query.language;
    const numJokes = 3; // Number of jokes you want to generate

    const jokes = [];

    for (let i = 0; i < numJokes; i++) {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a comedian, so tell me a joke about ${keyword} in ${language}.`,
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const joke = response.data.choices[0].message['content'].trim();
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