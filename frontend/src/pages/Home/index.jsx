import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  async function getUsers() {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
          logout();
      }
    }
  }

  async function deleteUser(id) {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
        try {
            await api.delete(`/usuarios/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            alert("Erro ao deletar usuário.");
        }
    }
  }

  useEffect(() => { getUsers() }, []);

  return (
    <div className='home-container'>
      <div className="home-header">
          <button onClick={logout} className="logout-btn">Sair</button>
          <h1>Usuários</h1>
      </div>

      <div className="users-list">
        {users.length === 0 && <p style={{color: '#666'}}>Nenhum usuário encontrado.</p>}
        
        {users.map(user => (
          <div key={user.id} className='user-card'>
              <div className="user-info">
                  <strong>{user.name}</strong>
                  <p>{user.age} anos</p>
                  <p>{user.email}</p>
              </div>
              
              <button onClick={() => deleteUser(user.id)} className="delete-btn" title="Deletar usuário">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;