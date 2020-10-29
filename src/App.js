import React, { useEffect, useState } from "react";
import api from './services/api';

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState();
  const [url, setUrl] = useState();
  const [techs, setTechs] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    api.get('/repositories').then(({ data }) => {
      setRepositories(data);
    })
  }, [])

  async function handleAddRepository() {
    setError(null);
    // if (!title) {
    //   setError('Valores inválidos');
    //   return;
    // }
    const { data } = await api.post('/repositories', { title, url, techs });
    setRepositories([...repositories, data]);
  }

  async function handleRemoveRepository(id) {
    setError(null);
    const response = await api.delete(`/repositories/${id}`);
    if (response.status === 204) {
      const index = repositories.findIndex(repo => repo.id === id);
      console.log(index);
      if (index >= 0) {
        setRepositories(repositories.filter(r => r.id !== id));
      } else
        setError("Erro ao exluir");
    }
  }

  return (
    <div>
      <table border="1" >
        <tbody data-testid="repository-list">
          {repositories.map(repo =>
            <tr key={repo.id}>
              <td><h1>{repo.title}</h1></td>
              <td>
                {repo.techs.map(tech => <span className="tech" key={tech}>{tech}</span>)}
              </td>
              <td>
                <button className="remover" onClick={() => handleRemoveRepository(repo.id)}>
                  Remover
            </button>
              </td>
            </tr>)}
        </tbody>
      </table>

      <div className="repository-form">
        <label htmlFor="title">
          Titablee:
        <input type="text" id="title"
            onChange={e => { setTitle(e.target.value) }} />
        </label>
        <label htmlFor="url">
          Url:
        <input type="text" id="url"
            onChange={e => { setUrl(e.target.value) }} />
        </label>
        <label htmlFor="techs">
          Techs (Comma sepparated):
        <input type="text" id="techs"
            onChange={e => { setTechs(e.target.value.split(',')) }} />
        </label>
        <button className="adicionar" onClick={handleAddRepository}>Adicionar</button>
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
}

export default App;
