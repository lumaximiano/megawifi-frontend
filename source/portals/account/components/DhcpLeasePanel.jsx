import React from 'react';
import { HiOutlineExclamationCircle, HiOutlineClock } from 'react-icons/hi';

const DhcpLeasePanel = ({ leases, error, loading }) => {
    
    const renderContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="4" className="px-6 py-10 text-center">
                        <div className="flex justify-center items-center gap-2 text-gray-500">
                            <HiOutlineClock className="h-5 w-5 animate-spin" />
                            <span>Carregando clientes conectados...</span>
                        </div>
                    </td>
                </tr>
            );
        }
        
        if (error) {
            return (
                <tr>
                    <td colSpan="4" className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center gap-2 text-red-500">
                            <HiOutlineExclamationCircle className="h-8 w-8" />
                            <span className="font-medium">{error}</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!leases || leases.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                        Nenhum cliente conectado encontrado na rede DHCP.
                    </td>
                </tr>
            );
        }

        return leases.map(lease => (
            <tr key={lease.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{lease.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{lease.macAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{lease.hostName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lease.status}</td>
            </tr>
        ));
    };

    return (
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Clientes Conectados (DHCP)</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço IP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço MAC</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Host</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderContent()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DhcpLeasePanel;
