import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCdnUrl } from '../utils/cdn';

const Dashboard = () => {
  const [stats, setStats] = useState({ rute: 0, armada: 0, jadwal: 0 });
  const [armadas, setArmadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ruteRes, armadaRes, jadwalRes] = await Promise.all([
          axios.get(`${apiUrl}/rutes`),
          axios.get(`${apiUrl}/armadas`),
          axios.get(`${apiUrl}/jadwals`),
        ]);
        
        setStats({
          rute: ruteRes.data.length,
          armada: armadaRes.data.length,
          jadwal: jadwalRes.data.length
        });
        setArmadas(armadaRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [apiUrl]);

  return (
    <div>
      <h1>Dashboard Monitoring</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Selamat datang di Sistem Monitoring Feeder Kota.
      </p>

      {loading ? (
        <p>Loading data API...</p>
      ) : (
        <div className="dashboard-grid">
          <div className="stat-card glass-panel">
            <span className="stat-title">Total Rute</span>
            <span className="stat-value">{stats.rute}</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-title">Armada Aktif</span>
            <span className="stat-value">{stats.armada}</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-title">Jadwal Operasional</span>
            <span className="stat-value">{stats.jadwal}</span>
          </div>
        </div>
      )}

      <h2>Status Sistem</h2>
      <div className="recent-list glass-panel" style={{ padding: '1.5rem' }}>
        <div className="list-item">
          <div>
            <div className="item-title">Koneksi Database</div>
            <div className="item-subtitle">MySQL Backend Terhubung</div>
          </div>
          <span className="badge success">Online</span>
        </div>
        <div className="list-item">
          <div>
            <div className="item-title">AWS S3 Storage</div>
            <div className="item-subtitle">Integrasi Bucket untuk media armada</div>
          </div>
          <span className="badge success">Ready</span>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem' }}>Monitoring Armada Semi Real-Time</h2>
      <div className="glass-panel table-container" style={{ padding: '1.5rem', marginTop: '1rem' }}>
        {armadas.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Belum ada armada untuk dimonitor.</p>
        ) : (
          <div className="recent-list">
            {armadas.map(armada => (
              <div key={armada.id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {armada.armada_image_url ? (
                    <img src={getCdnUrl(armada.armada_image_url)} alt={armada.nama_armada} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  )}
                  <div>
                    <div className="item-title">{armada.nama_armada} <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({armada.plat_nomor})</span></div>
                    <div className="item-subtitle">Rute: {armada.rute?.nama_rute || 'Tidak ada'}</div>
                  </div>
                </div>
                <span className={`badge ${armada.status === 'Beroperasi' ? 'success' : armada.status === 'Mogok' ? 'danger' : 'warning'}`}>
                  {armada.status || 'Beroperasi'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
