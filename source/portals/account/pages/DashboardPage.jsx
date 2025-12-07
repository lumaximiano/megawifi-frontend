// frontend/src/pages/DashboardPage.jsx - CÓDIGO COMPLETO E LIMPO

import React from 'react';
import styles from '../css/DashboardPage.module.css'; // Vamos criar um CSS para ele

const DashboardPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao Painel MEGAWIFI</h1>
      <p className={styles.subtitle}>
        Aqui você terá uma visão geral e consolidada do seu sistema.
      </p>
      <div className={styles.content}>
        {/* 
          Futuramente, aqui entrarão os componentes de gráficos e estatísticas.
          Ex: <ResumoDeVendas />, <GraficoDeConexoes />, <ClientesAtivos /> 
        */}
        <p>O conteúdo do dashboard, como gráficos e resumos, será adicionado aqui em breve.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
