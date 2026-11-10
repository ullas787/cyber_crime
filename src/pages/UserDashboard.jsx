
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Link2,
  FileWarning,
  UserRound,
  LogOut,
  LockKeyhole,
  ArrowUpRight,
  Activity,
  ChevronRight,
  Bell,
  Sparkles,
  ScanSearch,
} from 'lucide-react'

import './UserDashboard.css'

function UserDashboard({ profile, onLogout }) {
  const userName = profile?.full_name || 'User'
  const firstName = userName.trim().split(' ')[0]

  const features = [
    {
      icon: BookOpen,
      title: 'Learning Modules',
      description: 'Understand cyber threats and learn how to protect yourself online.',
      status: 'Coming next',
      color: 'blue',
    },
    {
      icon: ClipboardCheck,
      title: 'Cyber Safety Quiz',
      description: 'Challenge your knowledge through interactive safety quizzes.',
      status: 'In development',
      color: 'purple',
    },
    {
      icon: ScanSearch,
      title: 'URL Checker',
      description: 'Inspect suspicious links with threat intelligence.',
      status: 'In development',
      color: 'cyan',
    },
    {
      icon: FileWarning,
      title: 'Report a Fraud',
      description: 'Submit details of suspicious digital activities.',
      status: 'In development',
      color: 'orange',
    },
  ]

  return (
    <div className="cs-dashboard">
      <aside className="cs-sidebar">
        <a href="#overview" className="cs-brand">
          <div className="cs-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>Cyber<span className="brand-highlight">Shield</span></span>
        </a>

        <div className="cs-sidebar-group">
          <p className="cs-sidebar-heading">WORKSPACE</p>

          <a href="#overview" className="cs-nav-item active">
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </a>

          <a href="#tools" className="cs-nav-item">
            <BookOpen size={19} />
            <span>Cyber Safety</span>
          </a>

          <a href="#activity" className="cs-nav-item">
            <Activity size={19} />
            <span>Activity</span>
          </a>
        </div>

        <div className="cs-sidebar-group">
          <p className="cs-sidebar-heading">ACCOUNT</p>

          <a href="#account" className="cs-nav-item">
            <UserRound size={19} />
            <span>My Profile</span>
          </a>
        </div>

        <div className="cs-sidebar-bottom">
          <div className="cs-sidebar-promo">
            <div className="promo-icon">
              <LockKeyhole size={20} />
            </div>
            <strong>Stay one step ahead.</strong>
            <p>Build smarter and safer digital habits.</p>
            <span>CYBER AWARENESS MATTERS</span>
          </div>

          <button className="cs-logout" onClick={onLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="cs-main" id="overview">
        <header className="cs-topbar">
          <div>
            <span className="cs-breadcrumb">Workspace / Overview</span>
            <h2>Dashboard</h2>
          </div>

          <div className="cs-topbar-right">
            <div className="cs-live-indicator">
              <span />
              Account Active
            </div>

            <button className="cs-icon-button" aria-label="Notifications">
              <Bell size={19} />
              <i />
            </button>

            <div className="cs-user-chip">
              <div className="cs-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{userName}</strong>
                <small>Member account</small>
              </div>
            </div>
          </div>
        </header>

        <section className="cs-hero">
          <div className="cs-hero-content">
            <div className="cs-hero-label">
              <Sparkles size={14} />
              YOUR DIGITAL SAFETY HUB
            </div>

            <h1>
              Welcome back, <span>{firstName}.</span>
            </h1>

            <p>
              Your digital safety journey starts here.
              Explore security tools, build awareness, and stay protected.
            </p>

            <a href="#tools" className="cs-hero-button">
              Explore CyberShield
              <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="cs-hero-visual">
            <div className="cs-glow" />
            <div className="cs-orbit orbit-a" />
            <div className="cs-orbit orbit-b" />
            <div className="cs-hero-shield">
              <ShieldCheck size={83} strokeWidth={1.35} />
            </div>
            <div className="cs-floating-tag">
              <LockKeyhole size={14} />
              Digital Protection
            </div>
          </div>
        </section>

        <section className="cs-stats-grid">
          <div className="cs-stat-card">
            <div className="cs-stat-top">
              <span>Learning Progress</span>
              <div className="cs-stat-icon blue">
                <Activity size={19} />
              </div>
            </div>
            <strong>0%</strong>
            <div className="cs-progress-track">
              <div style={{ width: '0%' }} />
            </div>
            <small>Progress tracking coming soon</small>
          </div>

          <div className="cs-stat-card">
            <div className="cs-stat-top">
              <span>Modules Completed</span>
              <div className="cs-stat-icon purple">
                <BookOpen size={19} />
              </div>
            </div>
            <strong>0</strong>
            <small>No completed modules yet</small>
          </div>

          <div className="cs-stat-card">
            <div className="cs-stat-top">
              <span>Quizzes Completed</span>
              <div className="cs-stat-icon cyan">
                <ClipboardCheck size={19} />
              </div>
            </div>
            <strong>0</strong>
            <small>Quiz tracking coming soon</small>
          </div>
        </section>

        <section className="cs-tools-section" id="tools">
          <div className="cs-section-title">
            <div>
              <span className="cs-section-eyebrow">YOUR SECURITY TOOLKIT</span>
              <h2>Explore CyberShield</h2>
              <p>Everything you need to become more cyber aware.</p>
            </div>
            <span className="cs-tool-count">04 FEATURES</span>
          </div>

          <div className="cs-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  className={`cs-feature-card ${feature.color}`}
                  key={feature.title}
                >
                  <div className="cs-feature-top">
                    <div className="cs-feature-icon">
                      <Icon size={23} />
                    </div>
                    <span className="cs-feature-status">
                      <i />
                      {feature.status}
                    </span>
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  <div className="cs-feature-bottom">
                    <span>Feature preview</span>
                    <ChevronRight size={18} />
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="cs-bottom-grid">
          <div className="cs-activity-panel" id="activity">
            <div className="cs-panel-heading">
              <div>
                <span className="cs-section-eyebrow">YOUR JOURNEY</span>
                <h3>Recent Activity</h3>
              </div>
              <Activity size={20} />
            </div>

            <div className="cs-empty-activity">
              <div className="cs-empty-icon">
                <Activity size={24} />
              </div>
              <strong>No activity yet</strong>
              <p>Your learning and security activity will appear here.</p>
            </div>
          </div>

          <div className="cs-account-panel" id="account">
            <div className="cs-panel-heading">
              <div>
                <span className="cs-section-eyebrow">ACCOUNT DETAILS</span>
                <h3>Your Profile</h3>
              </div>
              <UserRound size={20} />
            </div>

            <div className="cs-profile-row">
              <div className="cs-profile-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{userName}</strong>
                <small>CyberShield member</small>
              </div>
            </div>

            <div className="cs-account-info">
              <span>Account role</span>
              <strong>{profile?.role || 'user'}</strong>
            </div>

            <div className="cs-account-info">
              <span>Account status</span>
              <strong className="cs-active-label">● Active</strong>
            </div>
          </div>
        </section>

        <footer className="cs-footer">
          <span>© 2026 CyberShield</span>
          <span>Stay Aware. Stay Secure.</span>
        </footer>
      </main>
    </div>
  )
}

export default UserDashboard
