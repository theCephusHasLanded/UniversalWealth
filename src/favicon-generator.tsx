import React from 'react';
import ReactDOM from 'react-dom';
import EyeLogo from './components/common/EyeLogo';

// A simple component to render the EyeLogo for favicon use
const FaviconRenderer = () => {
  return (
    <div style={{ 
      width: '64px', 
      height: '64px', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f1729', // Navy-900 color
      borderRadius: '8px',
      padding: '5px'
    }}>
      <EyeLogo size={48} variant="gold" animated={false} />
    </div>
  );
};

// Render the component
ReactDOM.render(
  <FaviconRenderer />,
  document.getElementById('root')
);