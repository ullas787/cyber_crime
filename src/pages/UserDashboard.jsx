
function UserDashboard({ profile, onLogout }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1120',
        color: '#ffffff',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>🛡️ CyberShield</h1>

      <h2>Welcome, {profile.full_name || 'User'}!</h2>

      <p>Your account is successfully connected.</p>

      <div
        style={{
          background: '#172338',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '400px',
          marginTop: '25px',
        }}
      >
        <h3>Account Information</h3>
        <p>Name: {profile.full_name || 'User'}</p>
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

export default UserDashboard
