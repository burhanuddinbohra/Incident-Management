import IncidentRow from './IncidentRow'

// Renders the list of incidents as a table
const IncidentTable = ({ incidents, onEdit, onDelete }) => {
  if (incidents.length === 0) {
    return <p className="text-sm text-gray-500">No incidents found.</p>
  }

  return (
    <table className="w-full bg-white border border-gray-200 rounded-md overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 text-left text-sm font-semibold">Incident #</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Title</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Severity</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Status</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Team</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Start</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">End</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {incidents.map((incident) => (
          <IncidentRow key={incident.id} incident={incident} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  )
}

export default IncidentTable
