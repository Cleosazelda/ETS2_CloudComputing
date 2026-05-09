import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageRute = () => {
  const [rutes, setRutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama_rute: '',
    asal: '',
    tujuan: '',
    image: null
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/rutes`);
      setRutes(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nama_rute', formData.nama_rute);
    data.append('asal', formData.asal);
    data.append('tujuan', formData.tujuan);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(`${apiUrl}/rutes`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData();
      setFormData({ nama_rute: '', asal: '', tujuan: '', image: null });
      if (document.getElementById('map-input')) document.getElementById('map-input').value = '';
    } catch (error) {
      console.error('Error saving rute:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus rute ini?')) {
      try {
        await axios.delete(`${apiUrl}/rutes/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting rute:', error);
      }
    }
  };

  return (
    <div>
      <h1>Kelola Rute Perjalanan</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2>Tambah Rute Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="dashboard-grid">
            <div className="input-group">
              <label className="input-label">Nama Rute</label>
              <input type="text" name="nama_rute" value={formData.nama_rute} onChange={handleInputChange} className="input-field" required placeholder="Cth: Koridor 1" />
            </div>
            <div className="input-group">
              <label className="input-label">Lokasi Asal</label>
              <input type="text" name="asal" value={formData.asal} onChange={handleInputChange} className="input-field" required placeholder="Cth: Alun-alun" />
            </div>
            <div className="input-group">
              <label className="input-label">Lokasi Tujuan</label>
              <input type="text" name="tujuan" value={formData.tujuan} onChange={handleInputChange} className="input-field" required placeholder="Cth: Terminal" />
            </div>
            <div className="input-group">
              <label className="input-label">Peta Rute (Opsional, Upload ke S3)</label>
              <input id="map-input" type="file" name="image" accept="image/*" onChange={handleFileChange} className="input-field" />
            </div>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Simpan Rute</button>
        </form>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading data...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Gambar Peta</th>
                <th>Nama Rute</th>
                <th>Asal</th>
                <th>Tujuan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rutes.map((rute) => (
                <tr key={rute.id}>
                  <td>
                    {rute.map_image_url ? (
                      <a href={rute.map_image_url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>Lihat Peta</a>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>-</span>
                    )}
                  </td>
                  <td className="item-title">{rute.nama_rute}</td>
                  <td>{rute.asal}</td>
                  <td>{rute.tujuan}</td>
                  <td>
                    <button onClick={() => handleDelete(rute.id)} className="btn" style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Hapus</button>
                  </td>
                </tr>
              ))}
              {rutes.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data rute</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageRute;
