import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageJadwal = () => {
  const [jadwals, setJadwals] = useState([]);
  const [armadas, setArmadas] = useState([]);
  const [rutes, setRutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    armada_id: '',
    rute_id: '',
    waktu_berangkat: '',
    waktu_tiba: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jadwalRes, armadaRes, ruteRes] = await Promise.all([
        axios.get(`${apiUrl}/jadwals`),
        axios.get(`${apiUrl}/armadas`),
        axios.get(`${apiUrl}/rutes`)
      ]);
      setJadwals(jadwalRes.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/jadwals`, formData);
      fetchData();
      setFormData({ armada_id: '', rute_id: '', waktu_berangkat: '', waktu_tiba: '' });
    } catch (error) {
      console.error('Error saving jadwal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
      try {
        await axios.delete(`${apiUrl}/jadwals/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting jadwal:', error);
      }
    }
  };

  return (
    <div>
      <h1>Kelola Jadwal Operasional</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2>Atur Jadwal Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="dashboard-grid">
            <div className="input-group">
              <label className="input-label">Armada</label>
              <select name="armada_id" value={formData.armada_id} onChange={handleInputChange} className="input-field" required>
                <option value="">Pilih Armada...</option>
                {armadas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nama_armada} ({a.plat_nomor})</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Rute</label>
              <select name="rute_id" value={formData.rute_id} onChange={handleInputChange} className="input-field" required>
                <option value="">Pilih Rute...</option>
                {rutes.map((r) => (
                  <option key={r.id} value={r.id}>{r.nama_rute} ({r.asal}-{r.tujuan})</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Waktu Berangkat</label>
              <input type="time" name="waktu_berangkat" value={formData.waktu_berangkat} onChange={handleInputChange} className="input-field" required />
            </div>
            <div className="input-group">
              <label className="input-label">Waktu Tiba</label>
              <input type="time" name="waktu_tiba" value={formData.waktu_tiba} onChange={handleInputChange} className="input-field" required />
            </div>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Simpan Jadwal</button>
        </form>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading data...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Armada</th>
                <th>Rute</th>
                <th>Keberangkatan</th>
                <th>Kedatangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jadwals.map((jadwal) => (
                <tr key={jadwal.id}>
                  <td className="item-title">{jadwal.armada?.nama_armada}</td>
                  <td>{jadwal.rute?.nama_rute}</td>
                  <td><span className="badge">{jadwal.waktu_berangkat}</span></td>
                  <td><span className="badge success">{jadwal.waktu_tiba}</span></td>
                  <td>
                    <button onClick={() => handleDelete(jadwal.id)} className="btn" style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Hapus</button>
                  </td>
                </tr>
              ))}
              {jadwals.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada jadwal operasional</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageJadwal;
