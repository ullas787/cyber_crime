
function AdminDashboard({ profile, onLogout }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#101827',
        color: '#ffffff',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>🛡️ CyberShield Admin Portal</h1>

      <h2>Welcome, Administrator!</h2>

      <p>You are logged in with administrator access.</p>

      <div
        style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '400px',
          marginTop: '25px',
        }}
      >
        <h3>Admin Information</h3>
        <p>Name: {profile.full_name || 'Admin'}</p>
        <p>Role: {profile.role}</p>
        <p>Status: Active</p>
      </div>

      <button
        onClick={onLogout}
        style={{
          marginTop: '25px',
          padding: '12px 24px',
          background: '#ef4444',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default AdminDashboard
