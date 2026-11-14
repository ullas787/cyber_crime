
import { useEffect, useState } from 'react'
import {
  ShieldAlert,
  Send,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import './FraudReports.css'

const categories = [
  'Phishing',
  'UPI Payment Fraud',
  'Online Shopping Fraud',
  'Identity Theft',
  'Job Scam',
  'Investment Scam',
  'Social Media Scam',
  'Other',
]

function FraudReports({ onBack }) {
  const [category, setCategory] = useState('Phishing')
  const [description, setDescription] = useState('')
  const [suspiciousUrl, setSuspiciousUrl] = useState('')
  const [amountLost, setAmountLost] = useState('')

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadReports() {
    setLoading(true)

    const { data, error } = await supabase
      .from('fraud_reports')
      .select('id, category, description, status, created_at, suspicious_url, amount_lost')
      .order('created_at', { ascending: false })

    if (error) {
      setError('Unable to load your reports. Please try again.')
    } else {
      setReports(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadReports()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (description.trim().length < 20) {
      setError('Please describe what happened in at least 20 characters.')
      return
    }

    if (description.trim().length > 3000) {
      setError('Description cannot exceed 3000 characters.')
      return
    }

    let cleanUrl = null

    if (suspiciousUrl.trim()) {
      try {
        const parsed = new URL(suspiciousUrl.trim())

        if (!['http:', 'https:'].includes(parsed.protocol)) {
          throw new Error('Invalid protocol')
        }

        cleanUrl = parsed.href
      } catch {
        setError('Please enter a valid URL beginning with http:// or https://.')
        return
      }
    }

    const amount = amountLost.trim() === ''
      ? null
      : Number(amountLost)

    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
      setError('Please enter a valid non-negative amount.')
      return
    }

    setSubmitting(true)

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('Please sign in again before submitting a report.')
      }

      const { error: insertError } = await supabase
        .from('fraud_reports')
        .insert({
          user_id: userData.user.id,
          category,
          description: description.trim(),
          suspicious_url: cleanUrl,
          amount_lost: amount,
        })

      if (insertError) {
        throw insertError
      }

      setSuccess('Your report has been submitted successfully!')

      setCategory('Phishing')
      setDescription('')
      setSuspiciousUrl('')
      setAmountLost('')

      await loadReports()
    } catch (err) {
      console.error('Fraud report submission error:', err)
      setError(err.message || 'Unable to submit your report.')
    } finally {
      setSubmitting(false)
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 size={17} />
      case 'rejected':
        return <XCircle size={17} />
      case 'in_review':
        return <Clock3 size={17} />
      default:
        return <Clock3 size={17} />
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case 'in_review':
        return 'In Review'
      case 'resolved':
        return 'Resolved'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }

  return (
    <div className="cs-report-page">
      <button className="cs-report-back" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="cs-report-heading">
        <div className="cs-report-heading-icon">
          <ShieldAlert size={30} />
        </div>

        <span>CYBERSHIELD REPORTING CENTER</span>
        <h1>Report <strong>Fraud</strong></h1>

        <p>
          Help document suspicious online activity and digital fraud.
        </p>
      </div>

      <form className="cs-report-form" onSubmit={handleSubmit}>
        <div className="cs-report-section-heading">
          <FileText size={21} />
          <h2>Submit a Report</h2>
        </div>

        <label htmlFor="report-category">Fraud Category</label>

        <select
          id="report-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <label htmlFor="report-description">What happened?</label>

        <textarea
          id="report-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the suspicious activity. Include relevant details, such as how you were contacted and what happened..."
          rows={6}
          maxLength={3000}
          required
        />

        <div className="cs-report-character-count">
          {description.length}/3000 characters
        </div>

        <label htmlFor="report-url">
          Suspicious Website URL <span>(Optional)</span>
        </label>

        <input
          id="report-url"
          type="url"
          value={suspiciousUrl}
          onChange={(event) => setSuspiciousUrl(event.target.value)}
          placeholder="https://suspicious-website.com"
        />

        <label htmlFor="report-amount">
          Amount Lost (₹) <span>(Optional)</span>
        </label>

        <input
          id="report-amount"
          type="number"
          min="0"
          step="0.01"
          value={amountLost}
          onChange={(event) => setAmountLost(event.target.value)}
          placeholder="Enter amount if applicable"
        />

        {error && (
          <div className="cs-report-message error">
            <ShieldAlert size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="cs-report-message success">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        <div className="cs-report-notice">
          <ShieldAlert size={19} />
          <p>
            Never include passwords, OTPs, UPI PINs, banking PINs
            or other confidential credentials. This form records
            reports within CyberShield; it does not submit an
            official police or government complaint.
          </p>
        </div>

        <button
          type="submit"
          className="cs-report-submit"
          disabled={submitting}
        >
          {submitting ? (
            <LoaderCircle className="cs-report-spin" size={19} />
          ) : (
            <Send size={19} />
          )}

          {submitting ? 'Submitting Report...' : 'Submit Report'}
        </button>
      </form>

      <section className="cs-report-history">
        <div className="cs-report-section-heading">
          <Clock3 size={21} />
          <h2>Your Previous Reports</h2>
        </div>

        {loading ? (
          <div className="cs-report-empty">
            <LoaderCircle className="cs-report-spin" size={25} />
            Loading your reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="cs-report-empty">
            <FileText size={32} />
            <strong>No reports submitted yet</strong>
            <p>Your submitted reports will appear here.</p>
          </div>
        ) : (
          <div className="cs-report-list">
            {reports.map((report) => (
              <article className="cs-report-card" key={report.id}>
                <div className="cs-report-card-top">
                  <div>
                    <span className="cs-report-category">
                      {report.category}
                    </span>
                    <h3>
                      {report.description.slice(0, 85)}
                      {report.description.length > 85 ? '...' : ''}
                    </h3>
                  </div>

                  <span className={`cs-report-status ${report.status}`}>
                    {getStatusIcon(report.status)}
                    {getStatusLabel(report.status)}
                  </span>
                </div>

                <div className="cs-report-card-bottom">
                  <span>
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>

                  {report.amount_lost !== null && (
                    <span>
                      Amount: ₹{Number(report.amount_lost).toLocaleString('en-IN')}
                    </span>
                  )}

                  {report.suspicious_url && (
                    <a
                      href={report.suspicious_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View URL <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default FraudReports
