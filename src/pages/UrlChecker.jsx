
import { useState } from 'react'
import {
  ShieldCheck,
  Search,
  LoaderCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ArrowLeft,
  RefreshCw,
  Globe,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import './UrlChecker.css'

function UrlChecker({ onBack }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingResults, setCheckingResults] = useState(false)
  const [analysisId, setAnalysisId] = useState('')
  const [scan, setScan] = useState(null)
  const [error, setError] = useState('')

  async function handleScan(event) {
    event.preventDefault()

    setError('')
    setScan(null)
    setAnalysisId('')

    if (!url.trim()) {
      setError('Please enter a website URL.')
      return
    }

    setLoading(true)

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke('url-checker', {
          body: { url: url.trim() },
        })

      if (functionError) {
        throw new Error(
          functionError.message || 'Unable to contact the scanning service.'
        )
      }

      if (!data?.success || !data?.analysisId) {
        throw new Error(data?.error || 'Could not submit this URL.')
      }

      setAnalysisId(data.analysisId)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGetResults() {
    if (!analysisId) return

    setCheckingResults(true)
    setError('')

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke('url-checker', {
          body: { analysisId },
        })

      if (functionError) {
        throw new Error(
          functionError.message || 'Unable to retrieve scan results.'
        )
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Could not retrieve results.')
      }

      setScan(data)
    } catch (err) {
      setError(err.message || 'Could not retrieve scan results.')
    } finally {
      setCheckingResults(false)
    }
  }

  const stats = scan?.stats

  const isComplete = scan?.status === 'completed'

  const isDangerous =
    Number(stats?.malicious || 0) > 0 ||
    Number(stats?.suspicious || 0) > 0

  const verdict = isDangerous
    ? 'Potentially Dangerous'
    : 'No Threats Detected'

  return (
    <div className="cs-url-page">
      <button className="cs-url-back" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="cs-url-heading">
        <div className="cs-url-heading-icon">
          <ShieldCheck size={30} />
        </div>

        <span className="cs-url-eyebrow">CYBERSHIELD SECURITY TOOL</span>
        <h1>URL <span>Checker</span></h1>

        <p>
          Check suspicious website links using VirusTotal threat intelligence.
        </p>
      </div>

      <form className="cs-url-form" onSubmit={handleScan}>
        <label htmlFor="url-input">Website URL</label>

        <div className="cs-url-input-wrap">
          <Globe size={19} />

          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            maxLength={2048}
            disabled={loading}
          />

          <button type="submit" disabled={loading || !url.trim()}>
            {loading ? (
              <LoaderCircle className="cs-url-spin" size={18} />
            ) : (
              <Search size={18} />
            )}
            {loading ? 'Submitting...' : 'Scan URL'}
          </button>
        </div>

        <small>
          Enter a complete website address beginning with http:// or https://.
        </small>
      </form>

      {error && (
        <div className="cs-url-error">
          <AlertTriangle size={19} />
          {error}
        </div>
      )}

      {analysisId && (
        <div className="cs-url-pending">
          <div className="cs-url-pending-icon">
            <Clock3 size={24} />
          </div>

          <div>
            <strong>URL submitted successfully</strong>
            <p>
              VirusTotal is analysing the website. Wait a few seconds,
              then retrieve the results.
            </p>
          </div>

          <button
            onClick={handleGetResults}
            disabled={checkingResults}
          >
            {checkingResults ? (
              <LoaderCircle className="cs-url-spin" size={17} />
            ) : (
              <RefreshCw size={17} />
            )}
            {checkingResults ? 'Checking...' : 'Get Results'}
          </button>
        </div>
      )}

      {scan && (
        <div className="cs-url-results">
          <div className="cs-url-result-heading">
            <div>
              <span className="cs-url-eyebrow">SCAN REPORT</span>
              <h2>Security Analysis</h2>
            </div>

            {isComplete ? (
              <span className={`cs-url-verdict ${isDangerous ? 'danger' : 'safe'}`}>
                {isDangerous ? (
                  <AlertTriangle size={17} />
                ) : (
                  <CheckCircle2 size={17} />
                )}
                {verdict}
              </span>
            ) : (
              <span className="cs-url-verdict pending">
                <Clock3 size={17} />
                {scan.status || 'Processing'}
              </span>
            )}
          </div>

          {isComplete && stats ? (
            <>
              <div className="cs-url-stat-grid">
                <div className="cs-url-stat malicious">
                  <strong>{stats.malicious ?? 0}</strong>
                  <span>Malicious</span>
                </div>

                <div className="cs-url-stat suspicious">
                  <strong>{stats.suspicious ?? 0}</strong>
                  <span>Suspicious</span>
                </div>

                <div className="cs-url-stat harmless">
                  <strong>{stats.harmless ?? 0}</strong>
                  <span>Harmless</span>
                </div>

                <div className="cs-url-stat undetected">
                  <strong>{stats.undetected ?? 0}</strong>
                  <span>Undetected</span>
                </div>
              </div>

              <p className="cs-url-disclaimer">
                Results are based on VirusTotal's available security
                engines at the time of scanning. A clean result does
                not guarantee that a website is safe.
              </p>
            </>
          ) : (
            <p className="cs-url-waiting">
              The analysis is not complete yet. Please wait a little
              longer and click Get Results again.
            </p>
          )}

          <button
            className="cs-url-rescan"
            onClick={() => {
              setScan(null)
              setAnalysisId('')
              setUrl('')
              setError('')
            }}
          >
            <RefreshCw size={17} />
            Check Another URL
          </button>
        </div>
      )}

      <div className="cs-url-warning">
        <AlertTriangle size={20} />
        <div>
          <strong>Important privacy warning</strong>
          <p>
            Submitted URLs may be shared with VirusTotal and its
            security community. Do not submit private, confidential
            or password-protected links.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UrlChecker
