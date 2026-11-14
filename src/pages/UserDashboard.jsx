
import { useEffect, useState } from 'react'
import LearningModules from './LearningModules'
import UrlChecker from './UrlChecker'
import FraudReports from './FraudReports'

import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
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
  LoaderCircle,
  Trophy,
  Clock3,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import './UserDashboard.css'

function UserDashboard({ profile, onLogout }) {
  const userName = profile?.full_name || 'User'
  const firstName = userName.trim().split(' ')[0]

  const [activePage, setActivePage] = useState('overview')

  const [stats, setStats] = useState({
    completedModules: 0,
    totalModules: 0,
    quizCount: 0,
    averageScore: 0,
  })

  const [recentAttempts, setRecentAttempts] = useState([])
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboardData() {
      setDashboardLoading(true)
      setDashboardError('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        if (active) {
          setDashboardError(
            'Unable to verify your account. Please sign in again.'
          )
          setDashboardLoading(false)
        }
        return
      }

      const [
        completedResult,
        modulesResult,
        attemptsResult,
        attemptCountResult,
      ] = await Promise.all([
        supabase
          .from('user_module_progress')
          .select('module_id', { count: 'exact' }),

        supabase
          .from('learning_modules')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true),

        supabase
          .from('user_quiz_attempts')
          .select(`
            id,
            score,
            total_questions,
            submitted_at,
            learning_modules (
              title
            )
          `)
          .order('submitted_at', { ascending: false }),

        supabase
          .from('user_quiz_attempts')
          .select('id', { count: 'exact', head: true }),
      ])

      if (!active) return

      const queryError =
        completedResult.error ||
        modulesResult.error ||
        attemptsResult.error ||
        attemptCountResult.error

      if (queryError) {
        setDashboardError(queryError.message)
        setDashboardLoading(false)
        return
      }

      const completedModules = completedResult.count || 0
      const totalModules = modulesResult.count || 0
      const attempts = attemptsResult.data || []
      const quizCount = attemptCountResult.count || 0

      const totalPercentage = attempts.reduce((sum, attempt) => {
        if (!attempt.total_questions) return sum

        return sum +
          (attempt.score / attempt.total_questions) * 100
      }, 0)

      const averageScore = attempts.length
        ? Math.round(totalPercentage / attempts.length)
        : 0

      setStats({
        completedModules,
        totalModules,
        quizCount,
        averageScore,
      })

      setRecentAttempts(attempts.slice(0, 5))
      setDashboardLoading(false)
    }

    loadDashboardData()

    return () => {
      active = false
    }
  }, [])

  // Learning Modules page
  if (activePage === 'learning') {
    return (
      <LearningModules
        onBack={() => setActivePage('overview')}
      />
    )
  }

  // URL Checker page
  if (activePage === 'url-checker') {
    return (
      <UrlChecker
        onBack={() => setActivePage('overview')}
      />
    )
  }

  // Fraud Reports page
  if (activePage === 'fraud-reports') {
    return (
      <FraudReports
        onBack={() => setActivePage('overview')}
      />
    )
  }

  const progressPercentage = stats.totalModules
    ? Math.round(
        (stats.completedModules / stats.totalModules) * 100
      )
    : 0

  const features = [
    {
      icon: BookOpen,
      title: 'Learning Modules',
      description: 'Understand cyber threats and learn how to protect yourself online.',
      status: 'Available',
      color: 'blue',
      page: 'learning',
    },
    {
      icon: ClipboardCheck,
      title: 'Cyber Safety Quiz',
      description: 'Challenge your knowledge through interactive safety quizzes.',
      status: 'Available',
      color: 'purple',
      page: 'learning',
    },
    {
      icon: ScanSearch,
      title: 'URL Checker',
      description: 'Inspect suspicious links with threat intelligence.',
      status: 'Available',
      color: 'cyan',
      page: 'url-checker',
    },
    {
      icon: FileWarning,
      title: 'Report a Fraud',
      description: 'Submit details of suspicious digital activities.',
      status: 'Available',
      color: 'orange',
      page: 'fraud-reports',
    },
  ]

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="cs-dashboard">
      <aside className="cs-sidebar">
        <a href="#overview" className="cs-brand">
          <div className="cs-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>
            Cyber<span className="brand-highlight">Shield</span>
          </span>
        </a>

        <div className="cs-sidebar-group">
          <p className="cs-sidebar-heading">WORKSPACE</p>

          <a href="#overview" className="cs-nav-item active">
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </a>

          <button
            type="button"
            className="cs-nav-item"
            onClick={() => setActivePage('learning')}
          >
            <BookOpen size={19} />
            <span>Cyber Safety</span>
          </button>

          <button
            type="button"
            className="cs-nav-item"
            onClick={() => setActivePage('fraud-reports')}
          >
            <FileWarning size={19} />
            <span>Report a Fraud</span>
          </button>

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

        {dashboardError && (
          <div className="cs-dashboard-error">
            {dashboardError}
          </div>
        )}

        <section className="cs-stats-grid">
          <div className="cs-stat-card">
            <div className="cs-stat-top">
              <span>Learning Progress</span>
              <div className="cs-stat-icon blue">
                <Activity size={19} />
              </div>
            </div>

            <strong>
              {dashboardLoading ? '...' : `${progressPercentage}%`}
            </strong>

            <div className="cs-progress-track">
              <div
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <small>
              {dashboardLoading
                ? 'Loading progress...'
                : 'Your completed learning modules'}
            </small>
          </div>

          <div className="cs-stat-card">
            <div className="cs-stat-top">
              <span>Modules Completed</span>
              <div className="cs-stat-icon purple">
                <BookOpen size={19} />
              </div>
            </div>

            <strong>
              {dashboardLoading ? '...' : stats.completedModules}
            </strong>

            <small>
              {dashboardLoading
                ? 'Loading...'
                : `Out of ${stats.totalModules} published modules`}
            </small>
          </div>

          <div className="cs-stat-card">
            <div className="cs-stat-top">
              <span>Quizzes Completed</span>
              <div className="cs-stat-icon cyan">
                <ClipboardCheck size={19} />
              </div>
            </div>

            <strong>
              {dashboardLoading ? '...' : stats.quizCount}
            </strong>

            <small>
              {dashboardLoading
                ? 'Loading...'
                : `Average score: ${stats.averageScore}%`}
            </small>
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
                  className={`cs-feature-card ${feature.color} cs-clickable`}
                  key={feature.title}
                  onClick={() => setActivePage(feature.page)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActivePage(feature.page)
                    }
                  }}
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
                    <span>
                      {feature.page === 'learning'
                        ? 'Start learning'
                        : feature.page === 'url-checker'
                          ? 'Check a URL'
                          : 'Submit a report'}
                    </span>
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
                <h3>Recent Quiz Activity</h3>
              </div>
              <Activity size={20} />
            </div>

            {dashboardLoading ? (
              <div className="cs-empty-activity">
                <LoaderCircle className="cs-activity-spinner" size={25} />
                <p>Loading your activity...</p>
              </div>
            ) : recentAttempts.length === 0 ? (
              <div className="cs-empty-activity">
                <div className="cs-empty-icon">
                  <Activity size={24} />
                </div>
                <strong>No quiz attempts yet</strong>
                <p>Your quiz scores will appear here after completing a quiz.</p>
              </div>
            ) : (
              <div className="cs-quiz-history">
                {recentAttempts.map((attempt) => {
                  const percentage = attempt.total_questions
                    ? Math.round(
                        (attempt.score / attempt.total_questions) * 100
                      )
                    : 0

                  return (
                    <div className="cs-quiz-history-item" key={attempt.id}>
                      <div className="cs-history-icon">
                        <Trophy size={19} />
                      </div>

                      <div className="cs-history-details">
                        <strong>
                          {attempt.learning_modules?.title || 'Learning Module'}
                        </strong>
                        <small>
                          <Clock3 size={12} />
                          {formatDate(attempt.submitted_at)}
                        </small>
                      </div>

                      <div className="cs-history-score">
                        <strong>
                          {attempt.score}/{attempt.total_questions}
                        </strong>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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

            <div className="cs-account-info">
              <span>Average quiz score</span>
              <strong>
                {dashboardLoading ? '...' : `${stats.averageScore}%`}
              </strong>
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
