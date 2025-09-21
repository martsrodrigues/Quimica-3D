import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const PORT = 4005;

// Endpoint para buscar o SDF pelo nome
app.get("/api/pubchem/sdf/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const response = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${name}/SDF`
    );

    if (!response.ok) {
      return res.status(500).send("Erro ao buscar molécula no PubChem");
    }

    const sdfText = await response.text();

    // Enviar como texto simples (não download!)
    res.type("text/plain").send(sdfText);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// Endpoint para informações extra (JSON)
app.get("/api/pubchem/info/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const response = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${name}/JSON`
    );

    if (!response.ok) {
      return res.status(500).send("Erro ao buscar info no PubChem");
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend a correr em http://localhost:${PORT} 🚀`);
});