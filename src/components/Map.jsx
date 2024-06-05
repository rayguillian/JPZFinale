import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ReactSVGPanZoom, TOOL_AUTO, INITIAL_VALUE } from 'react-svg-pan-zoom';

const backgroundImage = '/images/DyrBg/bg4.svg'; 
const settingsIcon = '/images/settingsicon.svg'; 
const svgMap = '/images/map.svg'; 
const logo = '/images/JPZlogolarge.svg'; 

const Map = () => {
  const [membersLocations, setMembersLocations] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewerValue, setViewerValue] = useState(INITIAL_VALUE);
  const Viewer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = collection(db, 'userLocations');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const locations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembersLocations(locations);
    });

    return () => unsubscribe();
  }, []);

  const handleZoomIn = () => {
    if (Viewer.current) {
      Viewer.current.zoomOnViewerCenter(1.1);
    }
  };

  const handleZoomOut = () => {
    if (Viewer.current) {
      Viewer.current.zoomOnViewerCenter(0.9);
    }
  };

  const constrainPanAndZoom = (value) => {
    const { viewerWidth, viewerHeight, SVGWidth, SVGHeight, a: scaleX, d: scaleY } = value;

    const maxZoomOutScale = Math.min(viewerWidth / (SVGWidth / 2.2), viewerHeight / (SVGHeight / 2.2)); // 45% zoom
    const newScaleX = Math.max(scaleX, maxZoomOutScale);
    const newScaleY = Math.max(scaleY, maxZoomOutScale);

    let { e: translateX, f: translateY } = value;
    translateX = Math.max(translateX, viewerWidth - SVGWidth * newScaleX);
    translateX = Math.min(translateX, 0);
    translateY = Math.max(translateY, viewerHeight - SVGHeight * newScaleY);
    translateY = Math.min(translateY, 0);

    return { ...value, a: newScaleX, d: newScaleY, e: translateX, f: translateY };
  };

  const handleSignOut = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <div className="relative min-h-screen z-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute top-6 right-6 z-50">
        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
          <img
            src={settingsIcon}
            alt="Settings Icon"
            className="cursor-pointer"
            style={{ width: '100%', height: '100%' }}
            onClick={() => setShowSidebar(!showSidebar)}
          />
        </div>
      </div>
      <div className="absolute top-6 left-6 z-50">
        <div className="text-center mb-4 mt-2 md:mt-4">
          <img src={logo} alt="Jyllands Park Zoo Logo" className="mx-auto" style={{ width: '250px', marginLeft: '30px' }} />
        </div>
      </div>
      <div style={{ width: '100%', height: '100vh' }}>
        <ReactSVGPanZoom
          ref={Viewer}
          width={window.innerWidth}
          height={window.innerHeight}
          tool={TOOL_AUTO}
          value={viewerValue}
          onChangeValue={(value) => setViewerValue(constrainPanAndZoom(value))}
          background="#ffffff"
          detectWheel={true}
          detectAutoPan={true}
          onChangeTool={() => {}}
          customToolbar={() => null}  // Removes the toolbox
        >
          <svg width="1000" height="1000" style={{ pointerEvents: 'none' }}>
            <image href={svgMap} width="1000" height="1000" style={{ pointerEvents: 'none' }} />
            {membersLocations.map(member => (
              <circle
                key={member.id}
                cx={member.longitude} 
                cy={member.latitude} 
                r={5}
                fill="blue"
                style={{ pointerEvents: 'all' }}
              />
            ))}
          </svg>
        </ReactSVGPanZoom>
      </div>
      {showSidebar && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col p-4">
          <button className="self-end mb-4" onClick={() => setShowSidebar(false)}>&times;</button>
          <ul>
            <li className="py-2 border-b" onClick={() => { /* Handle Hjælp */ }}>Hjælp</li>
            <li className="py-2 border-b" onClick={() => { /* Handle FAQ */ }}>FAQ</li>
            <li className="py-2 text-red-500" onClick={handleSignOut}>Log Ud</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Map;
