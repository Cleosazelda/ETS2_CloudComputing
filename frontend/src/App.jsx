import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ManageRute from './pages/ManageRute';
import ManageArmada from './pages/ManageArmada';
import ManageJadwal from './pages/ManageJadwal';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rute" element={<ManageRute />} />
          <Route path="armada" element={<ManageArmada />} />
          <Route path="jadwal" element={<ManageJadwal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
