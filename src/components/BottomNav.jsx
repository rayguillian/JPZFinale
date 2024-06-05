import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const flokIcon = '/images/flokicon.svg';
const mapIcon = '/images/mapicon.svg';
const profileIcon = '/images/profilicon.svg';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getButtonClasses = (path) => {
    return location.pathname === path ? 'border-red-500 border-4 rounded-full' : '';
  };

  const getMapButtonClasses = () => {
    return location.pathname === '/map' ? 'border-red-500 border-8 rounded-full opacity-70'  : 'border-gray-200';
  };

  const renderIconWithOutline = (icon, path) => (
    <div className="relative flex justify-center items-center" style={{ top: '-10px' }}> {/* Moved up */}
      <div className={`absolute w-16 h-16 flex justify-center items-center ${getButtonClasses(path)}`} style={{ opacity: 0.7 }}>
        <div className="w-12 h-12 bg-white rounded-full flex justify-center items-center">
          <img src={icon} alt="Icon" className="w-11 h-11 object-contain" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-white border-t border-gray-200 flex justify-between items-center">
      <button 
        onClick={() => navigate('/flok')} 
        type="button" 
        className="w-1/3 h-full flex justify-center items-center"
      >
        {renderIconWithOutline(flokIcon, '/flok')}
      </button>
      <button 
        onClick={() => navigate('/map')} 
        type="button" 
        className="relative z-20 w-1/3 h-full flex justify-center items-center"
      >
        <div className={`w-32 h-32 bg-white rounded-full flex justify-center items-center overflow-hidden ${getMapButtonClasses()}`} style={{ top: '-20px' }}> {/* Increased top offset */}
          <img src={mapIcon} alt="Map Icon" className="w-16 h-16 object-contain" />
        </div>
      </button>
      <button 
        onClick={() => navigate('/dashboard')} 
        type="button" 
        className="w-1/3 h-full flex justify-center items-center"
      >
        {renderIconWithOutline(profileIcon, '/dashboard')}
      </button>
    </div>
  );
};

export default BottomNav;
