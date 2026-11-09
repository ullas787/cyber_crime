
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

import Auth from './components/Auth'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

// Keep your existing threats array here.
const threats = [
  {
    icon: '🎣',
    title: 'Phishing Attacks',
    description: 'Learn how fake emails, messages and websites trick people into sharing personal information.',
  },
  {
    icon: '💳',
    title: 'Online Payment Scams',
    description: 'Understand UPI fraud, fake payment requests and common financial scams.',
  },
  {
    icon: '🔐',
    title: 'Identity Theft',
    description: 'Discover how criminals misuse personal information and how to protect your identity.',
  },
]

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadProfile(user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single()

      if (!mounted) return

      if (error) {
        setProfileError(error.message)
        setProfile(null)
      } else {
        setProfile(data)
        setProfileError('')
      }
    }

    async function initialize() {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        setProfileError(error.message)
        setLoading(false)
        return
      }

      setSession(data.session)

      if (data.session?.user) {
        await loadProfile(data.session.user)
      }

      if (mounted) setLoading(false)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return

      setSession(newSession)

      if (!newSession) {
        setProfile(null)
        setProfileError('')
        setLoading(false)
        return
      }

      // Defer the database request outside the auth callback.
      if (
        event === 'SIGNED_IN' ||
        event === 'INITIAL_SESSION' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        setLoading(true)

        setTimeout(() => {
          if (mounted) {
            loadProfile(newSession.user).finally(() => {
              if (mounted) setLoading(false)
            })
          }
        }, 0)
      }
    })

    initialize()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setProfileError(error.message)
    } else {
      setShowAuth(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '40px' }}>Loading CyberShield...</div>
  }

  if (session && profileError) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Unable to load your profile</h2>
        <p>{profileError}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  if (session && profile) {
    if (profile.role === 'admin') {
      return (
        <AdminDashboard
          profile={profile}
          onLogout={handleLogout}
        />
      )
    }

    return (
      <UserDashboard
        profile={profile}
        onLogout={handleLogout}
      />
    )
  }

  if (showAuth) {
    return <Auth onBack={() => setShowAuth(false)} />
  }

  return (
    <div className="app">
      {/* Your existing homepage goes here */}
    </div>
  )
}

export default App
