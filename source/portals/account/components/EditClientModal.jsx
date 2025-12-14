import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';

const EditClientModal = ({ item, onSuccess, onClose, isSuperAdminView }) => {
    const [formData, setFormData] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                companyName: item.companyName || '',
                ownerName: item.ownerName || '',
                ownerEmail: item.ownerEmail || '',
                name: item.name || '',
                address: item.address || '',
            });
            setNewPassword('');
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            let dataToSend = {};
            if (isSuperAdminView) {
                dataToSend = {
                    companyName: formData.companyName,
                    ownerName: formData.ownerName,
                    ownerEmail: formData.ownerEmail,
                };
            } else {
                dataToSend = {
                    name: formData.name,
                    address: formData.address,
                };
            }

            if (newPassword) {
                dataToSend.newPassword = newPassword;
            }

            // Simulação da chamada da API
            // await api.put(`/api/clients/${item.id}`, dataToSend);
            console.log("Enviando para API:", dataToSend);

            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Falha ao atualizar. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFormFields = () => {
        const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";
        const labelClass = "block text-sm font-medium text-gray-700";

        if (isSuperAdminView) {
            return (
                <>
                    <div>
                        <label htmlFor="companyName" className={labelClass}>Nome da Empresa</label>
                        <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="ownerName" className={labelClass}>Nome do Responsável</label>
                        <input id="ownerName" type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="ownerEmail" className={labelClass}>E-mail de Contato</label>
                        <input id="ownerEmail" type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className={labelClass}>Redefinir Senha</label>
                        <input id="newPassword" type="password" placeholder="Deixe em branco para não alterar" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div>
                        <label htmlFor="name" className={labelClass}>Nome do Cliente</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="address" className={labelClass}>Endereço</label>
                        <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} />
                    </div>
                </>
            );
        }
    };

    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Editar {isSuperAdminView ? 'Usuário' : 'Cliente'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                        <HiX className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {renderFormFields()}
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled={isSubmitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;
