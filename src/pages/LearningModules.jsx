
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
  ChevronLeft,
  GraduationCap,
  Brain,
  Trophy,
  RotateCcw,
  XCircle,
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

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [quizError, setQuizError] = useState('')
  const [quizSubmitting, setQuizSubmitting] = useState(false)

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

  // Load quiz questions without exposing the correct answers.
  async function handleStartQuiz() {
    setQuizLoading(true)
    setQuizError('')
    setQuizResult(null)
    setQuizAnswers({})
    setQuizIndex(0)

    const { data, error: questionError } = await supabase
      .from('module_questions')
      .select('id, question_text, options, question_order')
      .eq('module_id', selectedModule.id)
      .eq('is_published', true)
      .order('question_order', { ascending: true })

    if (questionError) {
      setQuizError(questionError.message)
      setQuizLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setQuizError('No quiz questions are available for this module yet.')
      setQuizLoading(false)
      return
    }

    setQuizQuestions(data)
    setQuizStarted(true)
    setQuizLoading(false)
  }

  function handleSelectAnswer(optionIndex) {
    if (quizResult) return

    const question = quizQuestions[quizIndex]

    setQuizAnswers((previous) => ({
      ...previous,
      [question.id]: optionIndex,
    }))
  }

  async function handleSubmitQuiz() {
    if (Object.keys(quizAnswers).length !== quizQuestions.length) {
      setQuizError('Please answer every question before submitting.')
      return
    }

    setQuizSubmitting(true)
    setQuizError('')

    const answers = quizQuestions.map((question) => ({
      question_id: question.id,
      selected_option: quizAnswers[question.id],
    }))

    const { data, error: submitError } = await supabase.rpc(
      'submit_module_quiz',
      {
        p_module_id: selectedModule.id,
        p_answers: answers,
      }
    )

    if (submitError) {
      setQuizError(submitError.message)
      setQuizSubmitting(false)
      return
    }

    setQuizResult(data)
    setQuizSubmitting(false)
  }

  function resetQuiz() {
    setQuizStarted(false)
    setQuizQuestions([])
    setQuizAnswers({})
    setQuizResult(null)
    setQuizIndex(0)
    setQuizError('')
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
                          resetQuiz()
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
              onClick={() => {
                setSelectedModule(null)
                resetQuiz()
              }}
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

            {/* Interactive Quiz */}
            <section className="lm-quiz-panel">
              <div className="lm-quiz-heading">
                <div className="lm-quiz-icon">
                  <Brain size={25} />
                </div>

                <div>
                  <span className="lm-eyebrow">TEST YOUR KNOWLEDGE</span>
                  <h2>Knowledge Check</h2>
                  <p>
                    See how well you understood this lesson.
                    Choose the best answer for each question.
                  </p>
                </div>
              </div>

              {!quizStarted && !quizResult && (
                <div className="lm-quiz-start">
                  <div className="lm-quiz-info">
                    <span>
                      <BookOpen size={16} />
                      10 questions
                    </span>
                    <span>
                      <Clock3 size={16} />
                      About 5 minutes
                    </span>
                    <span>
                      <Trophy size={16} />
                      Score out of 10
                    </span>
                  </div>

                  {quizError && (
                    <div className="lm-error">{quizError}</div>
                  )}

                  <button
                    className="lm-quiz-start-button"
                    onClick={handleStartQuiz}
                    disabled={quizLoading}
                  >
                    {quizLoading ? (
                      <>
                        <LoaderCircle className="lm-button-spinner" size={17} />
                        Loading questions...
                      </>
                    ) : (
                      <>
                        Start Quiz
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {quizStarted && !quizResult && quizQuestions.length > 0 && (
                <div className="lm-quiz-body">
                  <div className="lm-quiz-progress-info">
                    <span>
                      Question {quizIndex + 1} of {quizQuestions.length}
                    </span>
                    <span>
                      {Object.keys(quizAnswers).length} answered
                    </span>
                  </div>

                  <div className="lm-quiz-progress-track">
                    <div
                      style={{
                        width: `${((quizIndex + 1) / quizQuestions.length) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="lm-question-card">
                    <span className="lm-question-number">
                      QUESTION {String(quizIndex + 1).padStart(2, '0')}
                    </span>

                    <h3>{quizQuestions[quizIndex].question_text}</h3>

                    <div className="lm-options-list">
                      {quizQuestions[quizIndex].options.map(
                        (option, optionIndex) => {
                          const isSelected =
                            quizAnswers[quizQuestions[quizIndex].id] ===
                            optionIndex

                          return (
                            <button
                              key={optionIndex}
                              type="button"
                              className={`lm-option ${
                                isSelected ? 'lm-option-selected' : ''
                              }`}
                              onClick={() =>
                                handleSelectAnswer(optionIndex)
                              }
                            >
                              <span className="lm-option-letter">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span>{option}</span>
                              {isSelected && (
                                <CheckCircle2 size={18} />
                              )}
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>

                  {quizError && (
                    <div className="lm-error">{quizError}</div>
                  )}

                  <div className="lm-quiz-navigation">
                    <button
                      type="button"
                      className="lm-quiz-secondary-button"
                      disabled={quizIndex === 0}
                      onClick={() => setQuizIndex((previous) => previous - 1)}
                    >
                      <ChevronLeft size={17} />
                      Previous
                    </button>

                    {quizIndex < quizQuestions.length - 1 ? (
                      <button
                        type="button"
                        className="lm-quiz-next-button"
                        disabled={
                          quizAnswers[quizQuestions[quizIndex].id] === undefined
                        }
                        onClick={() => setQuizIndex((previous) => previous + 1)}
                      >
                        Next Question
                        <ChevronRight size={17} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="lm-quiz-next-button"
                        disabled={
                          quizSubmitting ||
                          Object.keys(quizAnswers).length !==
                            quizQuestions.length
                        }
                        onClick={handleSubmitQuiz}
                      >
                        {quizSubmitting ? (
                          <>
                            <LoaderCircle
                              className="lm-button-spinner"
                              size={17}
                            />
                            Checking...
                          </>
                        ) : (
                          <>
                            Submit Quiz
                            <CheckCircle2 size={17} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {quizResult && (
                <div className="lm-quiz-results">
                  <div className="lm-result-summary">
                    <div className="lm-result-icon">
                      <Trophy size={32} />
                    </div>

                    <span className="lm-eyebrow">QUIZ COMPLETED</span>
                    <h2>
                      {quizResult.score} / {quizResult.total_questions}
                    </h2>
                    <p>
                      You scored{' '}
                      {Math.round(
                        (quizResult.score / quizResult.total_questions) * 100
                      )}
                      % on this quiz.
                    </p>
                  </div>

                  <div className="lm-result-message">
                    {quizResult.score === quizResult.total_questions
                      ? 'Perfect score! Excellent work.'
                      : quizResult.score >= 7
                        ? 'Great work! You understand the key safety concepts.'
                        : quizResult.score >= 5
                          ? 'Good attempt! Review the explanations to improve.'
                          : 'Keep learning! Review the lesson and try again.'}
                  </div>

                  <h3 className="lm-review-heading">Answer Review</h3>

                  <div className="lm-review-list">
                    {quizResult.results.map((result, index) => (
                      <article
                        className={`lm-review-card ${
                          result.is_correct
                            ? 'lm-review-correct'
                            : 'lm-review-incorrect'
                        }`}
                        key={result.question_id}
                      >
                        <div className="lm-review-status">
                          {result.is_correct ? (
                            <CheckCircle2 size={19} />
                          ) : (
                            <XCircle size={19} />
                          )}
                          <span>Question {index + 1}</span>
                          <strong>
                            {result.is_correct ? 'Correct' : 'Incorrect'}
                          </strong>
                        </div>

                        <h4>{result.question_text}</h4>

                        <p>
                          <strong>Your answer: </strong>
                          {result.options[result.selected_option]}
                        </p>

                        {!result.is_correct && (
                          <p>
                            <strong>Correct answer: </strong>
                            {result.options[result.correct_option]}
                          </p>
                        )}

                        <div className="lm-explanation">
                          <strong>Explanation</strong>
                          <p>{result.explanation}</p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="lm-quiz-start-button"
                    onClick={resetQuiz}
                  >
                    <RotateCcw size={17} />
                    Try Again
                  </button>
                </div>
              )}
            </section>

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
                    <p>
                      Mark this module as completed to save your progress.
                    </p>
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
