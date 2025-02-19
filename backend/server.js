const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('./config');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  console.log("Received message:", message); // Log received message

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: message,
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("OpenAI API response:", response.data); // Log OpenAI API response
    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    res.status(500).send('Error communicating with OpenAI API');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
