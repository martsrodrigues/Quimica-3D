// server/index.js (CommonJS)
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve a pasta 'dist' gerada pelo vite build
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Exemplo de endpoint que busca SDF do PubChem e devolve texto
app.get('/api/pubchem/sdf/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/SDF`;
    const response = await fetch(url); // Node 18 tem fetch nativo
    if (!response.ok) return res.status(response.status).send('Not found');
    const text = await response.text();
    res.type('text/plain').send(text);
  } catch (err) {
    console.error('Erro PubChem SDF:', err);
    res.status(500).send('Erro a buscar SDF');
  }
});

// Outras APIs que precises, por exemplo JSON com info do composto
app.get('/api/pubchem/json/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/JSON`;
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).send({ error: 'Not found' });
    const json = await response.json();
    res.json(json);
  } catch (err) {
    console.error('Erro PubChem JSON:', err);
    res.status(500).send({ error: 'Erro a buscar JSON' });
  }
});

// SPA fallback (so the front-end routing works)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Porta: Render define automaticamente process.env.PORT
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});