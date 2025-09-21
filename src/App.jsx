// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [moleculeData, setMoleculeData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMoleculeData = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${query}/JSON`
      );
      const data = await response.json();

      if (!data.PC_Compounds) {
        setMoleculeData(null);
        setLoading(false);
        return;
      }

      const compound = data.PC_Compounds[0];
      const formula =
        compound.props.find((p) => p.urn.label === "Molecular Formula")?.value
          ?.sval || "N/A";
      const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${query}/SDF?record_type=3d`;

      const wikiResp = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`
      );
      const wikiData = await wikiResp.json();

      setMoleculeData({
        name: query,
        formula,
        sdfUrl,
        description: wikiData.extract || "Informação não encontrada.",
        wikipediaUrl: wikiData.content_urls?.desktop?.page || "",
      });
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setMoleculeData(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (moleculeData?.sdfUrl) {
      const viewport = document.getElementById("viewport");
      if (!viewport) return;

      viewport.innerHTML = "";

      const stage = new window.NGL.Stage("viewport", {
        backgroundColor: "white",
      });

      stage
        .loadFile(moleculeData.sdfUrl, { ext: "sdf" })
        .then((comp) => {
          comp.addRepresentation("ball+stick");
          stage.autoView();
        })
        .catch((err) => console.error("Erro ao carregar molécula:", err));
    }
  }, [moleculeData]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔬 Visualizador de Moléculas 3D</h1>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar composto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchMoleculeData}>Pesquisar</button>
      </div>

      <div className="content">
        <div id="viewport" className="viewer"></div>

        <div className="info-panel">
          <h2>Informações</h2>
          {loading ? (
            <p>A carregar...</p>
          ) : moleculeData ? (
            <>
              <h3>{moleculeData.name}</h3>
              <p>
                <b>Fórmula:</b> {moleculeData.formula}
              </p>
              <p>{moleculeData.description}</p>
              {moleculeData.wikipediaUrl && (
                <p>
                  <a
                    href={moleculeData.wikipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver mais na Wikipedia
                  </a>
                </p>
              )}
            </>
          ) : (
            <p>Nenhuma informação encontrada.</p>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>© Criado por Martim Rodrigues</p>
      </footer>
    </div>
  );
}

export default App;