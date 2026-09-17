// Small color-coded badge for severity
const severityColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
}

// Small color-coded badge for status
const statusColors = {
  Open: 'bg-red-100 text-red-800',
  Mitigated: 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
}

const formatDateTime = (isoString) =>
  isoString ? new Date(isoString).toLocaleString() : '—'

// One table row + Edit / Delete actions (Delete asks for confirmation first)
const IncidentRow = ({ incident, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete incident "${incident.title}"?`)) {
      onDelete(incident.id)
    }
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-3 py-2 text-sm font-mono">{incident.incident_number}</td>
      <td className="max-w-xs text-ellipsis overflow-hidden whitespace-nowrap px-3 py-2 text-sm">{incident.title}</td>
      <td className="px-3 py-2 text-sm">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[incident.severity]}`}>
          {incident.severity}
        </span>
      </td>
      <td className="px-3 py-2 text-sm">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[incident.status]}`}>
          {incident.status}
        </span>
      </td>
      <td className="px-3 py-2 text-sm">{incident.team}</td>
      <td className="px-3 py-2 text-sm">{formatDateTime(incident.start_time)}</td>
      <td className="px-3 py-2 text-sm">{formatDateTime(incident.end_time)}</td>
      <td className="px-2 py-2 text-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit(incident)} className="text-blue-600 hover:underline">
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default IncidentRow
