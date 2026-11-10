
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

import Auth from './components/Auth'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

import {
  ShieldCheck,
  ArrowRight,
  MailWarning,
  CreditCard,
  Fingerprint,
  KeyRound,
  Link2,
  Smartphone,
  LockKeyhole,
  CheckCircle2,
} from 'lucide-react'

const threats = [
  {
    icon: MailWarning,
    title: 'Phishing Attacks',
    description: 'Spot fake emails, messages and websites.',
    color: 'blue',
  },
  {
    icon: CreditCard,
    title: 'Payment Scams',
    description: 'Recognise UPI fraud and fake payment requests.',
    color: 'purple',
  },
  {
    icon: Fingerprint,
    title: 'Identity Theft',
    description: 'Protect your personal and digital identity.',
    color: 'cyan',
  },
]

const safetyTips = [
  {
    icon: KeyRound,
    title: 'Strong Passwords',
    description: 'Use unique passwords for every account.',
  },
  {
    icon: Link2,
    title: 'Check Every Link',
    description: 'Think twice before opening unknown links.',
  },
  {
    icon: Smartphone,
    title: 'Protect Your Data',
    description: 'Keep personal information private.',
  },
  {
    icon: LockKeyhole,
    title: 'Enable 2FA',
    description: 'Add another layer of account security.',
  },
]

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  // Authentication and profile management
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

  // Reveal homepage elements as they enter the screen
  useEffect(() => {
    if (loading || session || showAuth) return

    const elements = document.querySelectorAll('.reveal')

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [loading, session, showAuth])

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
      <div className="app-loading">
        <ShieldCheck size={38} />
        <p>Loading CyberShield...</p>
      </div>
    )
  }

  if (session && profileError) {
    return (
      <div className="app-loading">
        <h2>Unable to load your profile</h2>
        <p>{profileError}</p>
        <button className="primary-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )
  }

  if (session && profile) {
    if (profile.role === 'admin') {
      return <AdminDashboard profile={profile} onLogout={handleLogout} />
    }

    return <UserDashboard profile={profile} onLogout={handleLogout} />
  }

  if (showAuth) {
    return <Auth onBack={() => setShowAuth(false)} />
  }

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <a href="#home" className="brand">
          <ShieldCheck size={27} />
          <span className="brand-name">Cyber<span>Shield</span></span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#threats">Explore</a>
          <a href="#safety">Safety Tips</a>
          <a href="#about">About</a>

          <button
            className="nav-button"
            onClick={() => setShowAuth(true)}
          >
            Get Started <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-tag">
            <span className="live-dot"></span>
            YOUR DIGITAL SAFETY MATTERS
          </span>

          <h1>
            Stay Safe in a
            <br />
            Connected <span>World.</span>
          </h1>

          <p>
            Navigate the digital world with confidence.
            Learn to spot threats and protect what matters.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => setShowAuth(true)}
            >
              Get Started <ArrowRight size={17} />
            </button>

            <a className="secondary-button" href="#threats">
              Explore Learning
            </a>
          </div>

          <div className="hero-note">
            <CheckCircle2 size={16} />
            Learn <span>•</span> Identify <span>•</span> Protect
          </div>
        </div>

        {/* Animated shield visual */}
        <div className="shield-visual">
          <div className="orbit"></div>
          <div className="orbit orbit-two"></div>

          <div className="shield-glow">
            <ShieldCheck className="shield-symbol" />
          </div>

          <div className="floating-tag tag-one">
            <LockKeyhole size={15} /> Secure
          </div>

          <div className="floating-tag tag-two">
            <ShieldCheck size={15} /> Protected
          </div>
        </div>
      </section>

      {/* Quick steps */}
      <section className="stats">
        <div>
          <h2>01</h2>
          <p>Learn</p>
        </div>
        <div>
          <h2>02</h2>
          <p>Identify</p>
        </div>
        <div>
          <h2>03</h2>
          <p>Test</p>
        </div>
        <div>
          <h2>04</h2>
          <p>Stay Safe</p>
        </div>
      </section>

      {/* Threat cards */}
      <section className="section" id="threats">
        <div className="section-heading reveal">
          <span className="section-label">KNOW THE RISKS</span>
          <h2>Explore Cyber Threats</h2>
          <p>Know the risks. Stay one step ahead.</p>
        </div>

        <div className="threat-grid">
          {threats.map((threat, index) => {
            const Icon = threat.icon

            return (
              <article
                className={`threat-card reveal threat-${threat.color}`}
                key={threat.title}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="threat-icon">
                  <Icon size={27} />
                </div>

                <h3>{threat.title}</h3>
                <p>{threat.description}</p>

                <a href="#safety">
                  Learn More <ArrowRight size={15} />
                </a>
              </article>
            )
          })}
        </div>
      </section>

      {/* Safety tips */}
      <section className="section safety" id="safety">
        <div className="section-heading reveal">
          <span className="section-label">STAY PROTECTED</span>
          <h2>Safety Starts With You</h2>
          <p>Four simple habits. Better online security.</p>
        </div>

        <div className="safety-grid">
          {safetyTips.map((tip, index) => {
            const Icon = tip.icon

            return (
              <article
                className="safety-item reveal"
                key={tip.title}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="safety-icon">
                  <Icon size={23} />
                </div>

                <div>
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="cta reveal" id="about">
        <div className="cta-icon">
          <ShieldCheck size={34} />
        </div>

        <h2>Your Safety. Your Responsibility.</h2>
        <p>Build smarter habits. Make every click count.</p>

        <button
          className="primary-button"
          onClick={() => setShowAuth(true)}
        >
          Join CyberShield <ArrowRight size={17} />
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#home" className="brand">
          <ShieldCheck size={24} />
          <span className="brand-name">Cyber<span>Shield</span></span>
        </a>

        <p>Learn. Identify. Protect.</p>
        <p>© 2026 CyberShield</p>
      </footer>
    </div>
  )
}

export default App
