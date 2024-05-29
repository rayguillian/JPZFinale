import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLogin from './components/MainLogin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FlokManagement from './components/FlokManagement';
import CreditPurchase from './components/CreditPurchase';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flok" element={<FlokManagement />} />
        <Route path="/purchase" element={<CreditPurchase />} />
      </Routes>
    </Router>
  );
};

export default App;
