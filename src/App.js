import React, {useState,useEffect} from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [title,setTitle] = useState('');
  const [url,setUrl] = useState('');
  const [techs,setTechs] = useState('');
  const [repositories,setRepositories] = useState([]);

  async function handleAddRepository() {
    const response = await api.post('/repositories',{
      title,
      url,
      techs: techs.split(',')
    });
    
    if (response.status === 200)
      setRepositories([response.data,...repositories]);
  }

  async function handleRemoveRepository(id) {
    const projectIndex = repositories.findIndex(project => project.id === id);
    const response = await api.delete(`/repositories/${id}`);
    const updateRepository = repositories;
    if (response.status === 204){
      updateRepository.splice(projectIndex,1);
      console.log(updateRepository);
      setRepositories([...updateRepository]);
    }      
  }

  useEffect(()=>{
    console.log(repositories);
  },[repositories])

  useEffect(()=>{
    async function fetchData() {
      const response = await api.get('/repositories');
      setRepositories(response.data);
    }
    fetchData();
  },[]);

  return (
    <div>
      <input 
        onChange={e => setTitle(e.target.value)} 
        value={title} 
        placeholder="Informe o título do projeto"        
      />
      <input 
        onChange={e => setUrl(e.target.value)} 
        value={url} 
        placeholder="Informe a url do projeto"        
      />
      <input 
        onChange={e => setTechs(e.target.value)} 
        value={techs} 
        placeholder="Informe as technologias separadas por vírgula"        
      />
      <ul 
        data-testid="repository-list" 
        style={{
          width: '200px',
        }}>
        {repositories.map(repository => ( 
            <li key={repository.id}>
              {repository.title}
              <button 
                onClick={() => handleRemoveRepository(repository.id)}
              >
                Remover
              </button>
            </li>
          )
        )}
      </ul>

      <button 
        onClick={handleAddRepository}        
      >
        Adicionar
      </button>
    </div>
  );
}

export default App;
