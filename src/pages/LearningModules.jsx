
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  CheckCircle2,
  ShieldCheck,
  LockKeyhole,
  LoaderCircle,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import './LearningModules.css'

function LearningModules({ onBack }) {
  const [modules, setModules] = useState([])
  const [completedIds, setCompletedIds] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLearningData() {
      setLoading(true)
      setError('')

      const { data: moduleData, error: moduleError } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: true })

      if (moduleError) {
        setError(moduleError.message)
        setLoading(false)
        return
      }

      const { data: progressData, error: progressError } = await supabase
        .from('user_module_progress')
        .select('module_id')

      if (progressError) {
        setError(progressError.message)
        setLoading(false)
        return
      }

      setModules(moduleData || [])
      setCompletedIds((progressData || []).map((item) => item.module_id))
      setLoading(false)
    }

    loadLearningData()
  }, [])

  
async function handleComplete() {
  if (!selectedModule || completedIds.includes(selectedModule.id)) return

  setSaving(true)
  setError('')

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    setError(userError?.message || 'Please sign in again.')
    setSaving(false)
    return
  }

  const { error: saveError } = await supabase
    .from('user_module_progress')
    .insert({
      user_id: user.id,
      module_id: selectedModule.id,
    })

  if (saveError) {
    setError(saveError.message)
    setSaving(false)
    return
  }

  setCompletedIds((previous) => [...previous, selectedModule.id])
  setSaving(false)
}


  const completedCount = completedIds.length
  const totalCount = modules.length
  const progressPercentage = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0

  if (loading) {
    return (
      <div className="lm-page lm-centered">
        <LoaderCircle className="lm-spinner" size={35} />
        <p>Loading learning modules...</p>
      </div>
    )
  }

  return (
    <div className="lm-page">
      <header className="lm-header">
        <button className="lm-back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="lm-brand">
          <ShieldCheck size={25} />
          CyberShield
        </div>
      </header>

      <main className="lm-container">
        {!selectedModule ? (
          <>
            <section className="lm-hero">
              <div className="lm-hero-icon">
                <GraduationCap size={45} />
              </div>

              <div>
                <span className="lm-eyebrow">CYBERSECURITY AWARENESS</span>
                <h1>Learn to Stay Safe Online.</h1>
                <p>
                  Explore practical lessons, understand digital threats,
                  and build safer online habits.
                </p>
              </div>
            </section>

            <section className="lm-progress-panel">
              <div className="lm-progress-info">
                <div>
                  <span className="lm-eyebrow">YOUR LEARNING JOURNEY</span>
                  <h2>Learning Progress</h2>
                </div>

                <strong>{progressPercentage}%</strong>
              </div>

              <div className="lm-progress-track">
                <div style={{ width: `${progressPercentage}%` }} />
              </div>

              <p>
                {completedCount} of {totalCount} modules completed
              </p>
            </section>

            <div className="lm-section-heading">
              <div>
                <span className="lm-eyebrow">START LEARNING</span>
                <h2>Available Modules</h2>
              </div>
              <span className="lm-count">{totalCount} MODULES</span>
            </div>

            {error && <div className="lm-error">{error}</div>}

            {modules.length === 0 ? (
              <div className="lm-empty">
                No published learning modules are available.
              </div>
            ) : (
              <div className="lm-module-grid">
                {modules.map((module, index) => {
                  const isCompleted = completedIds.includes(module.id)

                  return (
                    <article className="lm-module-card" key={module.id}>
                      <div className="lm-module-top">
                        <div className="lm-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        {isCompleted ? (
                          <span className="lm-completed-badge">
                            <CheckCircle2 size={13} />
                            Completed
                          </span>
                        ) : (
                          <span className="lm-available-badge">
                            Available
                          </span>
                        )}
                      </div>

                      <span className="lm-category">{module.category}</span>
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>

                      <div className="lm-module-meta">
                        <span>
                          <Clock3 size={14} />
                          {module.duration_minutes} min
                        </span>
                        <span>
                          <BookOpen size={14} />
                          {module.difficulty}
                        </span>
                      </div>

                      <button
                        className="lm-open-button"
                        onClick={() => {
                          setSelectedModule(module)
                          setError('')
                        }}
                      >
                        {isCompleted ? 'Review Lesson' : 'Start Learning'}
                        <ChevronRight size={17} />
                      </button>
                    </article>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <section className="lm-lesson">
            <button
              className="lm-back-button"
              onClick={() => setSelectedModule(null)}
            >
              <ArrowLeft size={18} />
              All Modules
            </button>

            <div className="lm-lesson-heading">
              <span className="lm-eyebrow">{selectedModule.category}</span>
              <h1>{selectedModule.title}</h1>
              <p>{selectedModule.description}</p>

              <div className="lm-module-meta">
                <span>
                  <Clock3 size={14} />
                  {selectedModule.duration_minutes} min
                </span>
                <span>
                  <BookOpen size={14} />
                  {selectedModule.difficulty}
                </span>
              </div>
            </div>

            <div className="lm-lesson-content">
              {(Array.isArray(selectedModule.content)
                ? selectedModule.content
                : []
              ).map((section, index) => (
                <article className="lm-lesson-section" key={index}>
                  <div className="lm-lesson-section-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h2>{section.heading}</h2>
                    <p>{section.body}</p>
                  </div>
                </article>
              ))}
            </div>

            {error && <div className="lm-error">{error}</div>}

            {completedIds.includes(selectedModule.id) ? (
              <div className="lm-success">
                <CheckCircle2 size={21} />
                You've completed this learning module!
              </div>
            ) : (
              <div className="lm-complete-panel">
                <div>
                  <LockKeyhole size={22} />
                  <div>
                    <strong>Finished reading?</strong>
                    <p>Mark this module as completed to save your progress.</p>
                  </div>
                </div>

                <button
                  className="lm-complete-button"
                  onClick={handleComplete}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="lm-button-spinner" size={17} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Mark as Completed
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default LearningModules
