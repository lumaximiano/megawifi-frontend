import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import InputMask from 'react-input-mask';

const EditRouterModal = ({ router, onClose, onSave }) => {
    const [name, setName] = useState(router.name);
    const [mac, setMac] = useState(router.macAddress);
    const [apiIp, setApiIp] = useState(router.apiIp || '');
    const [apiPort, setApiPort] = useState(router.apiPort || '');
    const [apiUser, setApiUser] = useState(router.apiUser || 'megawifi-api-user');
    const [apiPassword, setApiPassword] = useState(router.apiPassword || '');

    const handleSave = () => {
        onSave(router.id, { 
            name, 
            mac_address: mac, 
            api_ip: apiIp, 
            api_port: apiPort, 
            api_user: apiUser, 
            api_password: apiPassword 
        });
    };

    if (!router) return null;

    const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Editar Roteador</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                        <HiX className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="edit-router-name" className={labelClass}>Nome do Roteador</label>
                            <input id="edit-router-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome do Mikrotik" className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="edit-router-mac" className={labelClass}>Endereço MAC</label>
                            <InputMask id="edit-router-mac" mask="**:**:**:**:**:**" value={mac} onChange={e => setMac(e.target.value.toUpperCase())} className={inputClass} placeholder="AA:BB:CC:DD:EE:FF">
                                {(inputProps) => <input {...inputProps} type="text" />}
                            </InputMask>
                        </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Credenciais da API</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="edit-router-ip" className={labelClass}>IP de Acesso (WAN)</label>
                                <input id="edit-router-ip" type="text" value={apiIp} onChange={e => setApiIp(e.target.value)} placeholder="IP de Acesso" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="edit-router-port" className={labelClass}>Porta da API</label>
                                <input id="edit-router-port" type="text" value={apiPort} onChange={e => setApiPort(e.target.value)} placeholder="Padrão: 8728" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="edit-router-user" className={labelClass}>Usuário da API</label>
                                <input id="edit-router-user" type="text" value={apiUser} onChange={e => setApiUser(e.target.value)} placeholder="Usuário da API" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="edit-router-password" className={labelClass}>Senha da API</label>
                                <input id="edit-router-password" type="password" value={apiPassword} onChange={e => setApiPassword(e.target.value)} placeholder="Senha da API" className={inputClass} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button type="button" onClick={handleSave} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRouterModal;
