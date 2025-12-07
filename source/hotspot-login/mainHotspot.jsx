// lmx-megawifi/frontend/src/hotspot.jsx - v3.0 - USA O COMPONENTE MESTRE
import React from 'react';
import ReactDOM from 'react-dom/client';
import ClientPortal from './styles/modules/components/ClientPortal'; // Importa o novo componente mestre

// A página agora apenas renderiza o componente mestre.
// Como não passamos a propriedade 'previewData', ele automaticamente
// entrará em "Modo Cliente" e buscará os dados da API.
const HotspotClientPage = () => {
    return <ClientPortal />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HotspotClientPage />
  </React.StrictMode>
);
