
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

import Auth from './components/Auth'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

const threats = [
  {
    icon: '🎣',
    title: 'Phishing Attacks',
    description:
      'Learn how fake emails, messages and websites trick people into sharing personal information.',
  },
  {
    icon: '💳',
    title: 'Online Payment Scams',
    description:
      'Understand UPI fraud, fake payment requests and common financial scams.',
  },
  {
    icon: '🔐',
    title: 'Identity Theft',
    description:
      'Discover how criminals misuse personal information and how to protect your identity.',
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
    return (
      <div style={{ padding: '40px', color: 'white' }}>
        Loading CyberShield...
      </div>
    )
  }

  if (session && profileError) {
    return (
      <div style={{ padding: '40px', color: 'white' }}>
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

      {/* Navigation */}
      <nav className="navbar">
        <a href="#" className="brand">
          🛡️ Cyber<span>Shield</span>
        </a>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#threats">Learn</a>
          <a href="#safety">Safety Tips</a>
          <a href="#about">About</a>
          <button onClick={() => setShowAuth(true)}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">
            YOUR DIGITAL SAFETY MATTERS
          </span>

          <h1>
            Stay Safe in a
            <br />
            Connected <span>World.</span>
          </h1>

          <p>
            The internet offers endless opportunities, but it also
            comes with risks. Learn to identify cyber threats,
            protect your information and stay one step ahead.
          </p>

          <div className="hero-buttons">
            <button onClick={() => setShowAuth(true)}>
              Get Started →
            </button>

            <a href="#threats">
              Explore Learning
            </a>
          </div>

          <p className="hero-note">
            ✓ Learn • Identify • Protect
          </p>
        </div>

        <div className="shield-visual">
          <div className="shield-orbit orbit-one"></div>
          <div className="shield-orbit orbit-two"></div>
          <div className="shield-icon">
            🛡️
          </div>

          <div className="floating-tag tag-one">
            🔒 Secure
          </div>

          <div className="floating-tag tag-two">
            🛡️ Protected
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div>
          <h2>01</h2>
          <p>Learn Cyber Safety</p>
        </div>

        <div>
          <h2>02</h2>
          <p>Identify Online Threats</p>
        </div>

        <div>
          <h2>03</h2>
          <p>Test Your Knowledge</p>
        </div>

        <div>
          <h2>04</h2>
          <p>Stay Protected</p>
        </div>
      </section>

      {/* Cyber Threats */}
      <section className="section" id="threats">
        <div className="section-heading">
          <span>KNOW THE RISKS</span>
          <h2>Understand Cyber Threats</h2>
          <p>
            Learn about common online threats and how they affect
            people in their everyday digital lives.
          </p>
        </div>

        <div className="threat-grid">
          {threats.map((threat, index) => (
            <div className="threat-card" key={index}>
              <div className="threat-icon">
                {threat.icon}
              </div>

              <h3>{threat.title}</h3>

              <p>{threat.description}</p>

              <a href="#safety">
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Tips */}
      <section className="section safety" id="safety">
        <div className="section-heading">
          <span>STAY ONE STEP AHEAD</span>
          <h2>Simple Ways to Stay Safe</h2>
          <p>
            Build smarter digital habits with these essential
            cyber safety practices.
          </p>
        </div>

        <div className="safety-grid">
          <div className="safety-card">
            <h3>🔑 Strong Passwords</h3>
            <p>
              Use unique, strong passwords for your online accounts.
            </p>
          </div>

          <div className="safety-card">
            <h3>🔗 Check Before You Click</h3>
            <p>
              Verify suspicious links before opening them.
            </p>
          </div>

          <div className="safety-card">
            <h3>📱 Protect Personal Data</h3>
            <p>
              Avoid sharing sensitive information with unknown sources.
            </p>
          </div>

          <div className="safety-card">
            <h3>🔐 Enable 2FA</h3>
            <p>
              Add another layer of security to your important accounts.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta" id="about">
        <h2>Make Your Digital World Safer.</h2>

        <p>
          Start learning today and become more aware of online threats.
        </p>

        <button onClick={() => setShowAuth(true)}>
          Join CyberShield →
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#" className="brand">
          🛡️ Cyber<span>Shield</span>
        </a>

        <p>
          Building awareness. Creating a safer digital world.
        </p>

        <p>
          © 2026 CyberShield. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default App
