import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../Contexts/ThemeContext'

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { theme, toggleTheme } = useTheme();

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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={logout} className="logout-btn">Sair</button>
              
              <button 
                onClick={toggleTheme} 
                style={{
                    background: 'transparent', 
                    border: '1px solid var(--neutral-gray)', 
                    color: 'var(--text-primary)',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
              >
                {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
              </button>
          </div>
          <h1>Usuários</h1>
      </div>

      <div className="users-list">
        {users.length === 0 && <p style={{color: 'var(--neutral-gray)'}}>Nenhum usuário encontrado.</p>}
        
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