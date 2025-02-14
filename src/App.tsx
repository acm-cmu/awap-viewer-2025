import React from 'react';

import './App.css';

import MapMaker from './pages/MapMaker';
import Viewer from './pages/Viewer';

function App() {
  const [page, setPage] = React.useState<'viewer' | 'mapmaker'>('viewer');

  const togglePage = () => {
    if (page === 'viewer') setPage('mapmaker');
    else if (page === 'mapmaker') setPage('viewer');
  };

  if (page === 'viewer') {
    return (
      <div className="App">
        <Viewer togglePage={togglePage} />
      </div>
    );
  }

  return <MapMaker togglePage={togglePage} />;
}

export default App;
