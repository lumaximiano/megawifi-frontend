// frontend/src/api/axiosConfig.js - v2.0 (Corrigido e Limpo)

import axios from 'axios';

// 1. Cria uma instância dedicada do Axios com a URL base do seu backend.
//    Isso garante que todas as chamadas feitas com `api` sejam direcionadas
//    para o servidor correto (ex: http://localhost:3001 ), resolvendo o erro 404.
const api = axios.create({
  baseURL: 'http://localhost:3001', // IMPORTANTE: Use o endereço do seu backend aqui.
} );

// 2. Aplica o interceptor de requisição APENAS na instância `api`.
//    Isso é mais seguro e evita aplicar o interceptor em outras chamadas Axios
//    que você possa ter (como a do ViaCEP).
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição, ele é rejeitado.
    return Promise.reject(error);
  }
);

// 3. (Opcional, mas recomendado) Interceptor de resposta para erros globais.
//    Este interceptor pode, por exemplo, deslogar o usuário automaticamente
//    se o token expirar (erro 401).
api.interceptors.response.use(
  (response) => response, // Se a resposta for boa, não faz nada.
  (error) => {
    if (error.response && error.response.status === 401) {
      // Exemplo: Token inválido ou expirado.
      localStorage.removeItem('token');
      // Redireciona para a página de login para evitar que o usuário fique "preso".
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


// 4. Exporta a instância `api` configurada para ser usada em todo o projeto.
export default api;
