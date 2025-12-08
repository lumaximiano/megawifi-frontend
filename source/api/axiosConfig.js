import axios from 'axios';

// 1. Lê a URL da API da variável de ambiente.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 2. Interceptor para adicionar o token de autenticação em todas as requisições.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de resposta para tratar erros globais, como token expirado (401).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 4. Exporta a instância `api` pronta para ser usada em qualquer lugar.
export default api;
