import React, { useState, useEffect } from 'react';
import api from '@api/axiosConfig';
import styles from '@css/ServerStatusPage.module.css';
import {
    // MUDANÇA: Usaremos AreaChart para um visual melhor
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';

// Componente para o Medidor Circular (sem alterações)
const Gauge = ({ value, label, color }) => (
    <div className={styles.gaugeCard}>
        <ResponsiveContainer width="100%" height={150}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value }]} startAngle={180} endAngle={0} barSize={30}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" angleAxisId={0} fill={color} cornerRadius={10} />
                <text x="50%" y="70%" textAnchor="middle" fontSize="2rem" fontWeight="bold" fill="#2d3748">{`${value}%`}</text>
            </RadialBarChart>
        </ResponsiveContainer>
        <span className={styles.gaugeLabel}>{label}</span>
    </div>
);

// MUDANÇA: Tooltip customizado para melhor leitura
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipLabel}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>
                        {`${p.name}: ${p.value}${p.unit || ''}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


const ServerStatusPage = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/server/status');
                setStatus(response.data);
            } catch (err) {
                setError('Não foi possível carregar os dados do servidor.');
                setStatus(getMockData());
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !status) return <div className={styles.loading}>Carregando dados do servidor...</div>;
    if (error && !status) return <div className={styles.error}>{error}</div>;

    const cpuUsage = status?.current.cpu.toFixed(1);
    const ramUsage = ((status?.current.ram.used / status?.current.ram.total) * 100).toFixed(1);
    const diskUsage = ((status?.current.disk.used / status?.current.disk.total) * 100).toFixed(1);

    return (
        <div className={styles.statusPage}>
            <div className={styles.header}>
                <h1 className={styles.title}>Status do Servidor</h1>
            </div>

            <div className={styles.gaugeGrid}>
                <Gauge value={cpuUsage} label="Uso de CPU" color="#3182ce" />
                <Gauge value={ramUsage} label="Uso de RAM" color="#38a169" />
                <Gauge value={diskUsage} label="Uso de Disco" color="#dd6b20" />
                <div className={`${styles.gaugeCard} ${styles.uptimeCard}`}>
                    <span className={styles.uptimeValue}>{status?.current.uptime}</span>
                    <span className={styles.uptimeLabel}>Uptime do Servidor</span>
                </div>
            </div>

            {/* MUDANÇA: Gráficos de Área Refinados */}
            <div className={styles.chartSection}>
                <h2 className={styles.chartTitle}>Histórico de CPU e Processos (Última Hora)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={status?.history.cpu}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3182ce" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" unit="%" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="usage" name="CPU" unit="%" stroke="#3182ce" strokeWidth={2} fill="url(#colorCpu)" />
                        <Area yAxisId="right" type="monotone" dataKey="processes" name="Processos" stroke="#a0aec0" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartSection}>
                <h2 className={styles.chartTitle}>Histórico de Tráfego de Rede (Última Hora)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={status?.history.network}>
                        <defs>
                            <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38a169" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#38a169" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#dd6b20" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#dd6b20" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis unit=" Mbps" tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="download" name="Download" unit=" Mbps" stroke="#38a169" strokeWidth={2} fill="url(#colorDownload)" />
                        <Area type="monotone" dataKey="upload" name="Upload" unit=" Mbps" stroke="#dd6b20" strokeWidth={2} fill="url(#colorUpload)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Função de dados mockados (sem alterações)
const getMockData = () => {
    const generateHistory = (key1, key2, max1, max2) => {
        let data = [];
        for (let i = 59; i >= 0; i--) {
            data.push({
                time: `${i} min atrás`,
                [key1]: parseFloat((Math.random() * max1).toFixed(1)),
                [key2]: Math.floor(Math.random() * max2),
            });
        }
        return data;
    };
    return {
        current: {
            cpu: Math.random() * 100,
            ram: { used: 8.2, total: 16.0 },
            disk: { used: 150.5, total: 500.0 },
            uptime: "15d 4h 32m",
        },
        history: {
            cpu: generateHistory('usage', 'processes', 80, 250),
            network: generateHistory('download', 'upload', 500, 150),
        }
    };
};

export default ServerStatusPage;
