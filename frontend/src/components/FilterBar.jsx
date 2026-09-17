import { SEVERITIES, STATUSES, TEAMS } from '../models/incident'

// Filter controls for severity + team + status, plus a free-text search box
const FilterBar = ({ filters, onChange }) => {
  const handleChange = (field) => (e) => {
    onChange({ ...filters, [field]: e.target.value })
  }

  return (
    <div className="flex flex-wrap gap-3 mb-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={handleChange('search')}
          placeholder="Search by INC number or title..."
          className="mt-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Severity</label>
        <select
          value={filters.severity}
          onChange={handleChange('severity')}
          className="mt-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Team</label>
        <select
          value={filters.team}
          onChange={handleChange('team')}
          className="mt-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {TEAMS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={filters.status}
          onChange={handleChange('status')}
          className="mt-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterBar
