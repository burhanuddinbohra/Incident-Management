import { useEffect, useState } from 'react'
import * as incidentApi from '../api/incidentApi'
import FilterBar from '../components/FilterBar'
import IncidentForm from '../components/IncidentForm'
import IncidentTable from '../components/IncidentTable'

// Top-level page: owns state, wires the table + form + filters to the API layer
const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([])
  const [filters, setFilters] = useState({ search: '', severity: '', team: '', status: '' })
  const [editingIncident, setEditingIncident] = useState(null)
  const [showForm, setShowForm] = useState(false)  //hook 
  const [error, setError] = useState('')

  
  const loadIncidents = async () => {
    try {
      setError('')
      const data = await incidentApi.getIncidents(filters)
      setIncidents(data)
    } catch (err) {
      setError(err.message)
    }
  }

  // Reload from the backend whenever any filter changes (severity/team/status/search)
  useEffect(() => {
    loadIncidents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.severity, filters.team, filters.status, filters.search])

  const handleAddClick = () => {
    setEditingIncident(null)
    setShowForm(true)
  }

  const handleEditClick = (incident) => {
    setEditingIncident(incident)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingIncident(null)
  }

  const handleSubmitForm = async (data) => {
    try {
      if (editingIncident) {
        await incidentApi.updateIncident(editingIncident.id, data)
      } else {
        await incidentApi.createIncident(data)
      }
      setShowForm(false)
      setEditingIncident(null)
      await loadIncidents()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await incidentApi.deleteIncident(id)
      await loadIncidents()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Incident Management</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
        >
          + New Incident
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {showForm && (
        <IncidentForm incident={editingIncident} onSubmit={handleSubmitForm} onCancel={handleCancelForm} />
      )}

      <FilterBar filters={filters} onChange={setFilters} />

      <IncidentTable incidents={incidents} onEdit={handleEditClick} onDelete={handleDelete} />
    </div>
  )
}

export default IncidentsPage
