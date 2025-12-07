// frontend/source/portals/account/pages/ManageLocationsPage.jsx - v1.1 (Refatorado)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
// MUDANÇA 1: Importa o CSS com o novo nome de arquivo.
import styles from '../css/ManageLocationsPage.module.css';

// MUDANÇA 2: Nome do componente atualizado para refletir sua função.
const ManageLocationsPage = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoading(true);
            try {
                // A chamada da API para buscar locais já estava correta.
                const response = await api.get('/api/locations/my-locations'); 
                setLocations(response.data); 
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Falha ao buscar os locais.');
                console.error("Erro ao buscar locais:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const handleEdit = (locationId) => {
        // MUDANÇA 3: Navega para a rota de edição de local, seguindo o padrão do App.jsx.
        navigate(`/account/locations/edit/${locationId}`);
    };

    const handleDelete = async (locationId) => {
        // Adicionado um window.confirm para uma melhor UX.
        if (window.confirm(`Tem certeza que deseja excluir este local? A ação não pode ser desfeita.`)) {
            alert(`Funcionalidade de deletar o local ${locationId} ainda não implementada.`);
            // Futura lógica de deleção virá aqui.
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {/* MUDANÇA 4: Título da página padronizado. */}
                <h1>Meus Locais</h1>
                <button 
                    // MUDANÇA 5: Rota do botão atualizada para a criação de um novo local.
                    onClick={() => navigate('/account/locations/new')} 
                    className={styles.submitButton}
                >
                    + Cadastrar Novo Local
                </button>
            </div>

            {isLoading && <p>Carregando locais...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {!isLoading && !error && (
                <table className={styles.clientsTable}>
                    <thead>
                        <tr>
                            <th>Nome do Local</th>
                            <th>Endereço</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.length > 0 ? (
                            locations.map((loc) => (
                                <tr key={loc.id}>
                                    <td>{loc.name || 'Nome não disponível'}</td>
                                    <td>{loc.address?.street || 'Endereço não disponível'}</td>
                                    <td>
                                        {/* A classe statusActive foi adicionada ao novo CSS. */}
                                        <span className={styles.statusActive}>
                                            Ativo
                                        </span>
                                    </td>
                                    <td>
                                        {/* MUDANÇA 6: Botões de ação agora chamam as funções corretas. */}
                                        <button onClick={() => handleEdit(loc.id)} className={styles.actionButton}>Editar</button>
                                        <button onClick={() => handleDelete(loc.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>Excluir</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                    Nenhum local cadastrado. Clique no botão acima para começar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// MUDANÇA 7: Exporta o componente com o novo nome.
export default ManageLocationsPage;
