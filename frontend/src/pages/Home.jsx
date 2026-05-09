import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [rutes, setRutes] = useState([]);
  const [jadwals, setJadwals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Laporan Form
  const [showLaporanForm, setShowLaporanForm] = useState(false);
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    lokasi: '',
    jenis_insiden: 'Macet',
    deskripsi: '',
    image: null
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ruteRes, jadwalRes] = await Promise.all([
          axios.get(`${apiUrl}/rutes`),
          axios.get(`${apiUrl}/jadwals`)
        ]);
        setRutes(ruteRes.data);
        setJadwals(jadwalRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmitLaporan = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    const data = new FormData();
    data.append('nama_pelapor', formData.nama_pelapor);
    data.append('lokasi', formData.lokasi);
    data.append('jenis_insiden', formData.jenis_insiden);
    data.append('deskripsi', formData.deskripsi);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(`${apiUrl}/laporans`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitStatus('success');
      setFormData({ nama_pelapor: '', lokasi: '', jenis_insiden: 'Macet', deskripsi: '', image: null });
      document.getElementById('laporan-image').value = '';
      setTimeout(() => setShowLaporanForm(false), 3000);
    } catch (error) {
      console.error('Error submitting laporan:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Feeder<span style={{ color: 'var(--primary-color)' }}>Kota</span>
        </div>
        <button className="btn" onClick={() => setShowLaporanForm(!showLaporanForm)} style={{ background: '#ef4444' }}>
          🚨 Lapor Insiden
        </button>
      </header>

      {/* Form Laporan Modal-like section */}
      {showLaporanForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #ef4444' }}>
          <h2 style={{ color: '#f87171' }}>Form Pelaporan Masyarakat</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Laporkan kemacetan, kecelakaan, atau kendala rute feeder lainnya. (Foto akan diunggah ke S3)</p>
          
          {submitStatus === 'success' && (
            <div className="badge success" style={{ padding: '1rem', marginBottom: '1rem', display: 'block' }}>
              Terima kasih! Laporan Anda berhasil dikirim dan akan segera diproses oleh operator.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="badge danger" style={{ padding: '1rem', marginBottom: '1rem', display: 'block' }}>
              Gagal mengirim laporan. Pastikan semua field terisi dengan benar.
            </div>
          )}

          <form onSubmit={handleSubmitLaporan}>
            <div className="dashboard-grid">
              <div className="input-group">
                <label className="input-label">Nama Anda</label>
                <input type="text" name="nama_pelapor" value={formData.nama_pelapor} onChange={handleInputChange} className="input-field" required placeholder="Cth: Budi" />
              </div>
              <div className="input-group">
                <label className="input-label">Lokasi Kejadian</label>
                <input type="text" name="lokasi" value={formData.lokasi} onChange={handleInputChange} className="input-field" required placeholder="Cth: Jl. Pahlawan (Depan Kampus)" />
              </div>
              <div className="input-group">
                <label className="input-label">Jenis Insiden</label>
                <select name="jenis_insiden" value={formData.jenis_insiden} onChange={handleInputChange} className="input-field">
                  <option value="Macet">Kemacetan Parah</option>
                  <option value="Kecelakaan">Kecelakaan</option>
                  <option value="Kerusakan">Jalan Rusak / Kendala Lain</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Bukti Foto (Max 2MB)</label>
                <input id="laporan-image" type="file" name="image" accept="image/*" onChange={handleFileChange} className="input-field" required />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label className="input-label">Deskripsi Tambahan</label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} className="input-field" required placeholder="Jelaskan kondisi secara singkat..." style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn" style={{ marginTop: '1rem', background: '#ef4444' }} disabled={submitStatus === 'submitting'}>
              {submitStatus === 'submitting' ? 'Mengunggah ke S3...' : 'Kirim Laporan'}
            </button>
          </form>
        </div>
      )}

      {/* Main Content */}
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Informasi Rute & Jadwal Feeder</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>Pantau rute dan jadwal operasional angkutan kota secara real-time.</p>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Memuat data layanan...</p>
      ) : (
        <div className="dashboard-grid">
          {rutes.map(rute => {
            // Filter jadwal for this route
            const routeSchedules = jadwals.filter(j => j.rute_id === rute.id);
            
            return (
              <div key={rute.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                {rute.map_image_url ? (
                  <img src={rute.map_image_url} alt={rute.nama_rute} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '160px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tidak ada peta rute</span>
                  </div>
                )}
                
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{rute.nama_rute}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <strong>Trayek:</strong> {rute.asal} ➔ {rute.tujuan}
                  </p>
                  
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Jadwal Berangkat:</h3>
                  {routeSchedules.length > 0 ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {routeSchedules.map(jadwal => (
                        <li key={jadwal.id} className="badge" style={{ fontSize: '0.85rem' }}>
                          {jadwal.waktu_berangkat.substring(0, 5)} - {jadwal.waktu_tiba.substring(0, 5)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada jadwal.</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
