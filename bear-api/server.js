// server.js
const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

app.get('/api/bear/:name', async (req, res) => {
  const bearName = req.params.name;
  const cacheKey = `bear_${bearName}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(`${WIKIPEDIA_API_URL}${bearName}`);
    const data = response.data;
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Wikipedia' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});