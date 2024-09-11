const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/query', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'llama-3.1-sonar-large-128k-online',  // Use a valid model name
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }, {
      headers: {
        'Authorization': `Bearer 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`,  // Directly use the API key
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});