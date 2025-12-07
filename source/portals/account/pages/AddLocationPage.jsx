// frontend/source/portals/account/pages/AddLocationPage.jsx - v1.0

import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importa o componente de formulário que você já tem
import AddLocationForm from '../components/AddLocationForm'; 
// Reutiliza o mesmo CSS da página de edição, que tem um estilo de container de formulário
import styles from '../../../styles/FormPage.module.css'; 

// Esta é a PÁGINA que o App.jsx importa.
const AddLocationPage = () => {
    const navigate = useNavigate();

    // Pega os dados do usuário logado do localStorage para obter o ID da conta.
    const user = JSON.parse(localStorage.getItem('user'));
    const accountId = user?.accountId;

    // Esta função será chamada pelo componente do formulário quando o local for criado com sucesso.
    const handleAddSuccess = () => {
        // Navega de volta para a lista de locais após um pequeno atraso.
        setTimeout(() => {
            navigate('/account/locations');
        }, 1500);
    };

    return (
        // Usamos um container genérico para a página de formulário.
        <div className={styles.formContainer}>
            {/* O título da página fica aqui, fora do formulário. */}
            <h1 className={styles.title}>Cadastrar Novo Local</h1>
            <p className={styles.subtitle}>Preencha os dados do seu novo estabelecimento ou unidade.</p>
            
            {/* 
              Renderiza o seu componente de formulário, passando as props necessárias:
              - accountId: Para que o backend saiba a qual conta este local pertence.
              - onAddSuccess: A função para ser chamada após o sucesso, para que a página possa redirecionar o usuário.
            */}
            <AddLocationForm 
                accountId={accountId} 
                onAddSuccess={handleAddSuccess} 
            />
        </div>
    );
};

export default AddLocationPage;
