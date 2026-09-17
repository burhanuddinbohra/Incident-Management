import { useEffect, useState } from 'react'
import { SEVERITIES, STATUSES, TEAMS } from '../models/incident'

const emptyForm = {
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  severity: 'Low',
  team: 'CIB Tech',
  teamOther: '',
  status: 'Open',
  root_cause: '',
}

// datetime-local inputs need "YYYY-MM-DDTHH:mm" (no seconds/timezone), ISO strings from the API have more
const toDatetimeLocal = (isoString) => (isoString ? isoString.slice(0, 16) : '')

// Add/Edit form. Shows a free-text box when team = "Other".
const IncidentForm = ({ incident, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  // Populate the form when editing an existing incident
  useEffect(() => {
    if (incident) {
      const knownTeam = TEAMS.includes(incident.team) ? incident.team : 'Other'
      setForm({
        title: incident.title,
        description: incident.description,
        start_time: toDatetimeLocal(incident.start_time),
        end_time: toDatetimeLocal(incident.end_time),
        severity: incident.severity,
        team: knownTeam,
        teamOther: knownTeam === 'Other' ? incident.team : '',
        status: incident.status,
        root_cause: incident.root_cause || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [incident])

  const handleChange = (field) => (e) => {
    
    setForm({ ...form, [field]: e.target.value })

  }

  const handleSubmit = (e) => {
    e.preventDefault() //prevents the reload of the whole window

    if (!form.title || !form.description || !form.start_time || !form.severity) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.team === 'Other' && !form.teamOther.trim()) {
      setError('Please specify the team name.')
      return
    }
    if (form.end_time && form.start_time && form.end_time < form.start_time) {
      setError('End time must be greater than start time.')
      return
    }



    setError('')
    onSubmit({
      title: form.title,
      description: form.description,
      start_time: form.start_time,
      end_time: form.end_time || null,
      severity: form.severity,
      team: form.team === 'Other' ? form.teamOther.trim() : form.team,
      // Only include status on updates; new incidents always start as "Open" server-side.
      ...(incident ? { status: form.status } : {}),
      root_cause: form.root_cause || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md border border-gray-200 mb-6 space-y-3">
      <h2 className="text-lg font-semibold">{incident ? 'Edit Incident' : 'New Incident'}</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={handleChange('title')}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description *</label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time *</label>
          <input
            type="datetime-local"
            value={form.start_time}
            onChange={handleChange('start_time')}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="datetime-local"
            value={form.end_time}
            onChange={handleChange('end_time')}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            disabled={!form.start_time || (form.status == 'Open')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Severity *</label>
          <select
            value={form.severity}
            onChange={handleChange('severity')}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Team *</label>
          <select
            value={form.team}
            onChange={handleChange('team')}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            {TEAMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {form.team === 'Other' && (
            <input
              type="text"
              value={form.teamOther}
              onChange={handleChange('teamOther')}
              placeholder="Team name"
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          )}
        </div>
      </div>

      {incident && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={form.status}
            onChange={handleChange('status')}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Root Cause</label>
        <textarea
          value={form.root_cause}
          onChange={handleChange('root_cause')}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          rows={2}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700">
          {incident ? 'Save Changes' : 'Add Incident'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md text-sm hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default IncidentForm
