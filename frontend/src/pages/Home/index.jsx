import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/trash.svg' 
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();

function logout() {
    localStorage.removeItem('token');
    navigate('/')
  }
  const [users, setUsers] = useState([])
  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')
    setUsers(usersFromApi.data)
  async function getUsers() {
  try {
      const usersFromApi = await api.get('/usuarios')
      setUsers(usersFromApi.data)
  } catch (error) {
      if (error.response && error.response.status === 401) {
          alert("Sua sessão expirou. Por favor, faça login novamente.");

      }
  }
}
  }

  async function createUsers() {
    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
   
    inputName.current.value = ''
    inputAge.current.value = ''
    inputEmail.current.value = ''
    
    getUsers()
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)
    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <button onClick={logout} style={{backgroundColor: '#ff4d4d', marginBottom: '20px'}}>Sair</button>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input placeholder="E-mail" name="email" type="email" ref={inputEmail} />
        <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>

      {users.map((user) => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome:  <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>
            <img src={Trash} width="20" alt="Lixeira" /> 
            
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home