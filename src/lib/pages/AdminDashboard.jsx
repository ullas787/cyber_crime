
function AdminDashboard({ profile, onLogout }) {
  return (
    <div style={{ padding: '40px', color: '#fff', background: '#101827', minHeight: '100vh' }}>
      <h1>🛡️ CyberShield Admin Portal</h1>

      <h2>Welcome, Administrator!</h2>

      <p>Logged in as: {profile.full_name || 'Admin'}</p>
      <p>Account role: {profile.role}</p>

      <button onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}

export default AdminDashboard
