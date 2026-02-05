import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './style.css';

function Login() {
    const emailRef = useRef();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await api.post('/login', {
                email: emailRef.current.value
            });
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (error) {
            alert('Falha no login: ' + (error.response?.data?.error || 'Erro ao conectar'));
        }
    }
    return (
        <div className='container'>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <input placeholder="E-mail" type="email" ref={emailRef} required />
                <button type='submit'>Entrar</button>
            </form>
        </div>
    );
}

export default Login;