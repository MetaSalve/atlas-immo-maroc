
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Test simple pour vérifier React
function App() {
  console.log('=== DIAGNOSTIC REACT ===');
  console.log('React is working:', React);
  console.log('React version:', React.version);
  console.log('React.useState:', React.useState);
  console.log('React.useEffect:', React.useEffect);
  console.log('React.useContext:', React.useContext);
  console.log('========================');
  
  return React.createElement('div', {
    style: { 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center' as const,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    }
  }, [
    React.createElement('h1', { 
      key: 'title',
      style: { color: '#333', marginBottom: '20px' }
    }, 'AlertImmo - Diagnostic React'),
    React.createElement('p', { 
      key: 'status',
      style: { color: '#28a745', fontSize: '18px', marginBottom: '10px' }
    }, 'React est maintenant fonctionnel !'),
    React.createElement('p', { 
      key: 'version',
      style: { color: '#6c757d', marginBottom: '20px' }
    }, `Version React: ${React.version || 'inconnue'}`),
    React.createElement('button', {
      key: 'button',
      onClick: () => {
        console.log('Button clicked - React is working!');
        alert('React fonctionne parfaitement !');
      },
      style: {
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'background-color 0.2s'
      },
      onMouseOver: (e: any) => {
        e.target.style.backgroundColor = '#0056b3';
      },
      onMouseOut: (e: any) => {
        e.target.style.backgroundColor = '#007bff';
      }
    }, 'Tester React'),
    React.createElement('div', {
      key: 'info',
      style: {
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        maxWidth: '600px'
      }
    }, [
      React.createElement('h3', { 
        key: 'info-title',
        style: { color: '#495057', marginBottom: '10px' }
      }, 'Informations de diagnostic'),
      React.createElement('p', {
        key: 'info-text',
        style: { color: '#6c757d', fontSize: '14px', lineHeight: '1.5' }
      }, 'Si vous voyez cette page, React fonctionne correctement. Vérifiez la console pour les logs de diagnostic détaillés.')
    ])
  ]);
}

// Point d'entrée avec gestion d'erreur
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('Root element not found');
  throw new Error("Root element not found");
}

console.log('Creating React root...');
const root = ReactDOM.createRoot(rootElement);

console.log('Rendering app...');
root.render(React.createElement(App));

console.log('App rendered successfully');
