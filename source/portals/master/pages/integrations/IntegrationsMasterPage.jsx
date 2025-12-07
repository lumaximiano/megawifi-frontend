// frontend/src/pages/IntegrationsMasterPage.jsx - v2 - ADICIONADO CARD DA STRIPE

import React from 'react';
import styles from '@css/IntegrationsMasterPage.module.css'; // CSS específico
import { HiOutlineMail, HiOutlineChatAlt2, HiOutlineCreditCard } from 'react-icons/hi';

// --- Componente para o Card de Integração ---
const IntegrationCard = ({ title, description, icon, fields, status }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>{icon}</div>
                <div className={styles.cardTitleContainer}>
                    <h2>{title}</h2>
                    <span className={`${styles.status} ${status === 'conectado' ? styles.statusConnected : styles.statusDisconnected}`}>
                        {status}
                    </span>
                </div>
            </div>
            <p className={styles.cardDescription}>{description}</p>
            <form className={styles.form}>
                {fields.map(field => (
                    <div className={styles.formGroup} key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <input
                            type={field.type}
                            id={field.id}
                            placeholder={field.placeholder}
                            // No futuro, o valor virá do estado do componente
                        />
                    </div>
                ))}
                <button type="submit" className={styles.saveButton} onClick={(e) => e.preventDefault()}>
                    Salvar
                </button>
            </form>
        </div>
    );
};

const IntegrationsMasterPage = () => {
    // --- DADOS FALSOS (MOCK DATA) ---
    const integrations = [
        {
            id: 'stripe',
            title: 'Pagamentos (Stripe)',
            description: 'Integração para cobrança recorrente de assinaturas dos seus clientes. Essencial para automatizar o faturamento.',
            icon: <HiOutlineCreditCard />,
            status: 'não configurado',
            fields: [
                { id: 'stripe_pk', label: 'Chave Publicável (Publishable Key)', type: 'text', placeholder: 'pk_test_...' },
                { id: 'stripe_sk', label: 'Chave Secreta (Secret Key)', type: 'password', placeholder: '••••••••••••••••••••' },
            ],
        },
        {
            id: 'email',
            title: 'Gateway de E-mail',
            description: 'Serviço para envio de e-mails transacionais, como boas-vindas e redefinição de senha. Recomendado: Resend, SendGrid.',
            icon: <HiOutlineMail />,
            status: 'conectado',
            fields: [
                { id: 'email_api_key', label: 'Chave de API (API Key)', type: 'password', placeholder: '••••••••••••••••••••' },
            ],
        },
        {
            id: 'sms',
            title: 'Gateway de SMS',
            description: 'Serviço para envio de SMS, usado para autenticação ou notificações futuras. Recomendado: Twilio.',
            icon: <HiOutlineChatAlt2 />,
            status: 'não configurado',
            fields: [
                { id: 'sms_account_sid', label: 'Account SID', type: 'text', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxx' },
                { id: 'sms_auth_token', label: 'Auth Token', type: 'password', placeholder: '••••••••••••••••••••' },
            ],
        },
    ];

    return (
        <div className={styles.integrationsContainer}>
            <h1 className={styles.pageTitle}>Integrações da Plataforma</h1>
            <div className={styles.cardsGrid}>
                {integrations.map(int => (
                    <IntegrationCard
                        key={int.id}
                        title={int.title}
                        description={int.description}
                        icon={int.icon}
                        fields={int.fields}
                        status={int.status}
                    />
                ))}
            </div>
        </div>
    );
};

export default IntegrationsMasterPage;
