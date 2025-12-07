// frontend/src/pages/LoginPage.jsx - CORREÇÃO FINAL PARA O PROXY

import React, { useState } from 'react';
import api from '@api/axiosConfig';
import styles from '@global-pages/LoginPage.module.css';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // ==================================================
            // CORREÇÃO FINAL: Adicionamos o prefixo '/api' de volta.
            // Agora que não há baseURL, o Axios fará a chamada para '/api/auth/login'.
            // O proxy do Vite irá interceptar '/api' e redirecionar para o backend.
            // ==================================================
            const response = await api.post('/api/auth/login', { email, password });

            const { token, user } = response.data;

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                onLoginSuccess();
            } else {
                setError('Resposta do servidor inválida.');
            }
        } catch (err) {
            console.error("FALHA no login:", err);
            const errorMessage = err.response?.data?.message || 'Credenciais inválidas ou erro no servidor.';
            setError(errorMessage);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>MEGAWIFI</h1>
                <p className={styles.subtitle}>Faça login para acessar o painel de controle.</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        required
                    />
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Conectar
                    </button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
