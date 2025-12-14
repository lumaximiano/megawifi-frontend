import React, { useState } from 'react';
import { HiOutlineUserCircle, HiOutlineLockClosed, HiOutlinePhotograph } from 'react-icons/hi';

const ConfigurationAccountPage = () => {
    // Estados de exemplo para os formulários
    const [profile, setProfile] = useState({ name: 'Minha Empresa de Wi-Fi' });
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
    const [logo, setLogo] = useState(null);

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
                <p className="mt-1 text-gray-500">Gerencie as informações e a personalização da sua conta.</p>
            </div>

            {/* Layout de coluna única, simples e direto */}
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Card 1: Perfil da Conta */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Perfil da Conta</h3>
                    </div>
                    <form className="p-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                            <input type="text" name="name" id="name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </form>
                    <div className="bg-gray-50 px-6 py-4 text-right rounded-b-lg">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Salvar Perfil
                        </button>
                    </div>
                </div>

                {/* Card 2: Alterar Senha */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
                    </div>
                    <form className="p-6 space-y-4">
                        <div>
                            <label htmlFor="current" className="block text-sm font-medium text-gray-700">Senha Atual</label>
                            <input type="password" name="current" id="current" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="new" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                            <input type="password" name="new" id="new" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                            <input type="password" name="confirm" id="confirm" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </form>
                    <div className="bg-gray-50 px-6 py-4 text-right rounded-b-lg">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Atualizar Senha
                        </button>
                    </div>
                </div>

                {/* Card 3: Logotipo da Marca */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Logotipo da Marca</h3>
                    </div>
                    <form className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                                {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <HiOutlinePhotograph className="h-12 w-12 text-gray-400" />}
                            </div>
                            <div>
                                <input type="file" id="logo-upload" className="hidden" onChange={handleLogoChange} accept="image/png, image/jpeg" />
                                <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Escolher Arquivo
                                </label>
                                <p className="text-xs text-gray-500 mt-2">PNG ou JPG. O logo aparecerá nas telas de hotspot.</p>
                            </div>
                        </div>
                    </form>
                    <div className="bg-gray-50 px-6 py-4 text-right rounded-b-lg">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Salvar Logotipo
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ConfigurationAccountPage;
