import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await api.post('/login', {
                email: emailRef.current.value,
                password: passwordRef.current.value
            });
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch (err) {
            alert("E-mail ou senha inválidos");
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleLogin}>
                <h1>Bem-vindo de volta!</h1>
                <input placeholder="E-mail" ref={emailRef} required />
                <input placeholder="Senha" type="password" ref={passwordRef} required />
                <button type="submit" className="primary-btn">Entrar</button>
                <button type="button" className="secondary-btn" onClick={() => navigate('/cadastro')}>Criar nova conta</button>
            </form>
        </div>
    );
}
export default Login;