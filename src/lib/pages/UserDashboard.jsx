
function UserDashboard({ profile, onLogout }) {
  return (
    <div style={{ padding: '40px', color: '#fff', background: '#0b1120', minHeight: '100vh' }}>
      <h1>🛡️ CyberShield User Dashboard</h1>

      <h2>Welcome, {profile.full_name || 'User'}!</h2>

      <p>Your account is successfully connected.</p>
      <p>Account role: {profile.role}</p>

      <button onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}

export default UserDashboard
