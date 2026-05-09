import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageArmada = () => {
  const [armadas, setArmadas] = useState([]);
  const [rutes, setRutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama_armada: '',
    plat_nomor: '',
    rute_id: '',
    status: 'Beroperasi',
    image: null
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const armadaRes = await axios.get(`${apiUrl}/armadas`);
      const ruteRes = await axios.get(`${apiUrl}/rutes`);
      setArmadas(armadaRes.data);
      setRutes(ruteRes.data);
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
    data.append('nama_armada', formData.nama_armada);
    data.append('plat_nomor', formData.plat_nomor);
    data.append('rute_id', formData.rute_id);
    data.append('status', formData.status);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(`${apiUrl}/armadas`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData();
      setFormData({ nama_armada: '', plat_nomor: '', rute_id: '', status: 'Beroperasi', image: null });
      // Reset file input
      document.getElementById('image-input').value = '';
    } catch (error) {
      console.error('Error saving armada:', error);
      alert('Gagal menyimpan armada. Pastikan koneksi dan AWS S3 sudah terkonfigurasi dengan benar.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus armada ini?')) {
      try {
        await axios.delete(`${apiUrl}/armadas/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting armada:', error);
      }
    }
  };

  return (
    <div>
      <h1>Kelola Armada Transportasi</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2>Tambah Armada Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="dashboard-grid">
            <div className="input-group">
              <label className="input-label">Nama Armada</label>
              <input type="text" name="nama_armada" value={formData.nama_armada} onChange={handleInputChange} className="input-field" required placeholder="Cth: Feeder 01" />
            </div>
            <div className="input-group">
              <label className="input-label">Plat Nomor</label>
              <input type="text" name="plat_nomor" value={formData.plat_nomor} onChange={handleInputChange} className="input-field" required placeholder="Cth: D 1234 ABC" />
            </div>
            <div className="input-group">
              <label className="input-label">Rute Operasional</label>
              <select name="rute_id" value={formData.rute_id} onChange={handleInputChange} className="input-field" required>
                <option value="">Pilih Rute...</option>
                {rutes.map((r) => (
                  <option key={r.id} value={r.id}>{r.nama_rute} ({r.asal} - {r.tujuan})</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="input-field" required>
                <option value="Beroperasi">🟢 Beroperasi</option>
                <option value="Mogok">🔴 Mogok</option>
                <option value="Perbaikan">🟡 Perbaikan</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Foto Armada (Akan diupload ke AWS S3 & disajikan via CloudFront)</label>
              <input id="image-input" type="file" name="image" accept="image/*" onChange={handleFileChange} className="input-field" required />
            </div>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Simpan & Upload ke S3</button>
        </form>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading data...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama Armada</th>
                <th>Plat Nomor</th>
                <th>Rute</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {armadas.map((armada) => (
                <tr key={armada.id}>
                  <td>
                    {armada.armada_image_url ? (
                      <img src={armada.armada_image_url} alt={armada.nama_armada} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>Tidak ada foto</span>
                    )}
                  </td>
                  <td className="item-title">{armada.nama_armada}</td>
                  <td><span className="badge">{armada.plat_nomor}</span></td>
                  <td>{armada.rute?.nama_rute || 'Tidak ada'}</td>
                  <td>
                    <span className={`badge ${armada.status === 'Beroperasi' ? 'success' : armada.status === 'Mogok' ? 'danger' : 'warning'}`}>
                      {armada.status || 'Beroperasi'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(armada.id)} className="btn" style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Hapus</button>
                  </td>
                </tr>
              ))}
              {armadas.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data armada</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageArmada;
