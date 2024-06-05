import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

const MainLogin = lazy(() => import('./components/MainLogin'));
const Register = lazy(() => import('./components/Register'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const FlokManagement = lazy(() => import('./components/FlokManagement'));
const Map = lazy(() => import('./components/Map'));
const BottomNav = lazy(() => import('./components/BottomNav'));

const AppRoutes = () => {
  const location = useLocation();
  const showNavBar = !['/', '/register'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flok" element={<FlokManagement />} />
        <Route path="/map" element={<Map />} />
      </Routes>
      {showNavBar && <BottomNav />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
};

export default App;
