
import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  FileWarning,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  LoaderCircle,
  Save,
  ExternalLink,
  LayoutDashboard,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import './AdminDashboard.css'

const statusOptions = [
  'pending',
  'in_review',
  'resolved',
  'rejected',
]

function formatStatus(status) {
  return status.replace('_', ' ').replace(/\b\w/g, (char) =>
    char.toUpperCase()
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AdminDashboard({ profile, onLogout }) {
  const [reports, setReports] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('all')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const selectedReport = reports.find(
    (report) => report.id === selectedId
  )

  const [editStatus, setEditStatus] = useState('pending')
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    if (selectedReport) {
      setEditStatus(selectedReport.status)
      setEditNotes(selectedReport.admin_notes || '')
    }
  }, [selectedId, selectedReport?.status, selectedReport?.admin_notes])

  async function loadReports() {
    setLoading(true)
    setError('')
    setMessage('')

    const { data, error: fetchError } = await supabase
      .from('fraud_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setReports([])
      setSelectedId(null)
    } else {
      setReports(data || [])

      if (data?.length) {
        setSelectedId((currentId) =>
          data.some((report) => report.id === currentId)
            ? currentId
            : data[0].id
        )
      } else {
        setSelectedId(null)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    loadReports()
  }, [])

  async function handleUpdateReport() {
    if (!selectedReport) return

    setSaving(true)
    setError('')
    setMessage('')

    const { data, error: updateError } = await supabase
      .from('fraud_reports')
      .update({
        status: editStatus,
        admin_notes: editNotes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedReport.id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
    } else {
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === data.id ? data : report
        )
      )
      setMessage('Report updated successfully.')
    }

    setSaving(false)
  }

  const filteredReports =
    filter === 'all'
      ? reports
      : reports.filter((report) => report.status === filter)

  const counts = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    in_review: reports.filter((r) => r.status === 'in_review').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <div>
            <h2>CyberShield</h2>
            <span>ADMIN PORTAL</span>
          </div>
        </div>

        <div className="admin-topbar-right">
          <span className="admin-role">Administrator</span>
          <button className="admin-logout" onClick={onLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-heading">
          <div>
            <span className="admin-eyebrow">
              <LayoutDashboard size={14} />
              ADMIN WORKSPACE
            </span>
            <h1>Fraud Report Management</h1>
            <p>
              Welcome, {profile?.full_name || 'Administrator'}.
              Review and manage submitted reports.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadReports}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'admin-spinning' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error">
            {error}
          </div>
        )}

        {message && (
          <div className="admin-alert admin-alert-success">
            {message}
          </div>
        )}

        <section className="admin-stats">
          <div className="admin-stat-card">
            <FileWarning size={22} />
            <span>Total Reports</span>
            <strong>{loading ? '...' : counts.total}</strong>
          </div>

          <div className="admin-stat-card">
            <Clock3 size={22} />
            <span>Pending</span>
            <strong>{loading ? '...' : counts.pending}</strong>
          </div>

          <div className="admin-stat-card">
            <Eye size={22} />
            <span>In Review</span>
            <strong>{loading ? '...' : counts.in_review}</strong>
          </div>

          <div className="admin-stat-card">
            <CheckCircle2 size={22} />
            <span>Resolved</span>
            <strong>{loading ? '...' : counts.resolved}</strong>
          </div>
        </section>

        <section className="admin-workspace">
          <div className="admin-report-list">
            <div className="admin-list-heading">
              <div>
                <h2>Submitted Reports</h2>
                <span>{filteredReports.length} reports found</span>
              </div>
            </div>

            <div className="admin-filters">
              {[
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_review', label: 'In Review' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'rejected', label: 'Rejected' },
              ].map((item) => (
                <button
                  key={item.value}
                  className={filter === item.value ? 'selected' : ''}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="admin-empty">
                <LoaderCircle className="admin-spinning" size={28} />
                <p>Loading reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="admin-empty">
                <FileWarning size={30} />
                <strong>No reports found</strong>
                <p>Reports matching this filter will appear here.</p>
              </div>
            ) : (
              <div className="admin-report-items">
                {filteredReports.map((report) => (
                  <button
                    key={report.id}
                    className={`admin-report-item ${
                      selectedId === report.id ? 'active' : ''
                    }`}
                    onClick={() => {
                      setSelectedId(report.id)
                      setMessage('')
                      setError('')
                    }}
                  >
                    <div className="admin-report-item-top">
                      <strong>{report.category}</strong>
                      <span className={`admin-status ${report.status}`}>
                        {formatStatus(report.status)}
                      </span>
                    </div>

                    <p>{report.description}</p>

                    <small>{formatDate(report.created_at)}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="admin-report-details">
            {!selectedReport ? (
              <div className="admin-empty">
                <FileWarning size={32} />
                <strong>Select a report</strong>
                <p>Choose a submitted report to view its details.</p>
              </div>
            ) : (
              <>
                <div className="admin-details-heading">
                  <div>
                    <span className="admin-eyebrow">REPORT DETAILS</span>
                    <h2>{selectedReport.category}</h2>
                  </div>
                  <span className={`admin-status ${selectedReport.status}`}>
                    {formatStatus(selectedReport.status)}
                  </span>
                </div>

                <div className="admin-detail-field">
                  <label>Report ID</label>
                  <p className="admin-report-id">{selectedReport.id}</p>
                </div>

                <div className="admin-detail-field">
                  <label>Submitted by (User ID)</label>
                  <p className="admin-report-id">{selectedReport.user_id}</p>
                </div>

                <div className="admin-detail-field">
                  <label>Description</label>
                  <p className="admin-description">
                    {selectedReport.description}
                  </p>
                </div>

                {selectedReport.suspicious_url && (
                  <div className="admin-detail-field">
                    <label>Suspicious URL</label>
                    <a
                      href={selectedReport.suspicious_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-url"
                    >
                      {selectedReport.suspicious_url}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                {selectedReport.amount_lost !== null && (
                  <div className="admin-detail-field">
                    <label>Amount Lost</label>
                    <p>
                      ₹{Number(selectedReport.amount_lost).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}

                <div className="admin-detail-field">
                  <label>Submitted On</label>
                  <p>{formatDate(selectedReport.created_at)}</p>
                </div>

                <div className="admin-detail-field">
                  <label>Update Report Status</label>
                  <select
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-detail-field">
                  <label>Admin Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(event) => setEditNotes(event.target.value)}
                    placeholder="Add internal notes about this report..."
                    rows={4}
                  />
                </div>

                <button
                  className="admin-save-button"
                  onClick={handleUpdateReport}
                  disabled={saving}
                >
                  {saving ? (
                    <LoaderCircle className="admin-spinning" size={17} />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </section>

        <footer className="admin-footer">
          <span>© 2026 CyberShield Admin Portal</span>
          <span>
            <ShieldCheck size={14} />
            Secure Administration
          </span>
        </footer>
      </main>
    </div>
  )
}

export default AdminDashboard
