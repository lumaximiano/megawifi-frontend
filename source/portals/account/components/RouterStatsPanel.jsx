import React from 'react';
import { HiOutlineClock, HiOutlineExclamationCircle, HiOutlineChip, HiOutlineGlobe, HiOutlineCalendar, HiOutlineTrendingUp } from 'react-icons/hi';

const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatUptime = (uptimeStr) => {
    if (!uptimeStr) return 'N/A';
    let days = 0, hours = 0, minutes = 0;
    if (uptimeStr.includes('w')) { const parts = uptimeStr.split('w'); days += parseInt(parts[0]) * 7; uptimeStr = parts[1] || ''; }
    if (uptimeStr.includes('d')) { const parts = uptimeStr.split('d'); days += parseInt(parts[0]); uptimeStr = parts[1] || ''; }
    if (uptimeStr.includes('h')) { const parts = uptimeStr.split('h'); hours = parseInt(parts[0]); uptimeStr = parts[1] || ''; }
    if (uptimeStr.includes('m')) { const parts = uptimeStr.split('m'); minutes = parseInt(parts[0]); }
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim() || 'Menos de 1m';
};

const StatCard = ({ icon, label, value, children }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-start gap-4">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
            {icon}
        </div>
        <div>
            <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
            {children}
        </div>
    </div>
);

const RouterStatsPanel = ({ router, stats, error, loading }) => {
    if (!router) return null;

    if (loading) {
        return (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner text-center text-gray-500">
                <HiOutlineClock className="h-6 w-6 mx-auto animate-spin mb-2" />
                Carregando estatísticas de <strong>{router.name}</strong>...
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 bg-red-50 p-6 rounded-lg shadow-inner text-center text-red-600">
                <HiOutlineExclamationCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">{error}</p>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const totalMemory = parseFloat(stats.totalMemory);
    const freeMemory = parseFloat(stats.freeMemory);
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detalhes de: {router.name}</h3>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard icon={<HiOutlineGlobe className="h-6 w-6" />} label="Uptime" value={formatUptime(stats.uptime)} />
                <StatCard icon={<HiOutlineChip className="h-6 w-6" />} label="Uso de CPU" value={`${stats.cpuLoad}%`} />
                <StatCard icon={<HiOutlineTrendingUp className="h-6 w-6" />} label="Memória Utilizada">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${memoryUsagePercentage}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatBytes(usedMemory)} de {formatBytes(totalMemory)}</p>
                </StatCard>
                <StatCard icon={<HiOutlineCalendar className="h-6 w-6" />} label="Data no Roteador" value={stats.date} />
                <StatCard icon={<HiOutlineClock className="h-6 w-6" />} label="Hora no Roteador" value={stats.time ? stats.time.substring(0, 5) : 'N/A'} />
            </dl>
        </div>
    );
};

export default RouterStatsPanel;
