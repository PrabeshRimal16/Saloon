import { useState, useEffect } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Connecting...')

  useEffect(() => {
    // Check if backend is alive
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setBackendStatus('Connected to Backend!')
        }
      })
      .catch(() => {
        setBackendStatus('Backend is offline')
      })
  }, [])

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1>Welcome to Saloon</h1>
        <p style={{ fontSize: '1.2em', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Your fresh React + Node.js application.
        </p>
        
        <div style={{
          display: 'inline-block',
          padding: '0.8rem 1.5rem',
          borderRadius: '24px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--card-border)',
          marginTop: '1rem',
          fontSize: '0.9em',
          fontWeight: 500,
          color: backendStatus === 'Connected to Backend!' ? '#3fb950' : '#f85149'
        }}>
          Status: {backendStatus}
        </div>

        <div>
          <button onClick={() => alert('App is looking fresh!')}>
            Explore the App
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        Get ready to build something amazing!
      </p>
    </div>
  )
}

export default App
