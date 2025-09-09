import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx is loading...');
console.log('Root element:', document.getElementById('root'));

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Error rendering React app:', error);
}
