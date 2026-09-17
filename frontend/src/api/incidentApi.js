// The only place in the app that talks to the backend REST API
const BASE_URL = 'http://localhost:8000/incidents'

// Helper to turn a fetch Response into JSON, or throw with a useful message
const handleResponse = async (response) => {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Request failed (${response.status}): ${body}`)
  }
  // DELETE returns 204 No Content, so there's no body to parse
  if (response.status === 204) return null
  return response.json()
}

export const getIncidents = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.severity) params.set('severity', filters.severity)
  if (filters.team) params.set('team', filters.team)
  if (filters.status) params.set('status', filters.status)
  if (filters.search) params.set('q', filters.search)
  const query = params.toString()
  const response = await fetch(query ? `${BASE_URL}?${query}` : BASE_URL)
  return handleResponse(response)
}

export const getIncident = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleResponse(response)
}

export const createIncident = async (incident) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incident),
  })
  return handleResponse(response)
}

export const updateIncident = async (id, incident) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incident),
  })
  return handleResponse(response)
}

export const deleteIncident = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  return handleResponse(response)
}
