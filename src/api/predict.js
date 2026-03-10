const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Sends a .laz file to POST /preprocess
 * Returns { nadir, facade, rear, zoomed, point_count }
 */
export async function preprocessLaz(lazFile) {
  // FormData is how you send a file over HTTP.
  // 'file' must match the FastAPI parameter name exactly.
  const formData = new FormData()
  formData.append('file', lazFile)

  let response
  try {
    response = await fetch(`${API_BASE}/preprocess`, {
      method: 'POST',
      body: formData,
      // DO NOT set Content-Type manually here.
      // The browser sets it automatically with the correct
      // multipart boundary. If you set it manually the
      // server cannot parse the file.
    })
  } catch (networkError) {
    // fetch() only throws when the server is completely unreachable
    throw new Error('Cannot reach the server. Is the backend running?')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // FastAPI error messages live in data.detail
    throw new Error(data?.detail || `Server error: ${response.status}`)
  }

  return data
}

/**
 * Pings GET /health to check if backend is alive
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`)
    return await res.json()
  } catch {
    return { status: 'unreachable', model_loaded: false }
  }
}
/**
 * Full prediction — sends .laz file, gets back
 * 4 images + species name + confidence scores
 */
export async function predictSpecies(lazFile) {
  const formData = new FormData()
  formData.append('file', lazFile)

  let response
  try {
    response = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Cannot reach the server.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.detail || `Server error: ${response.status}`)
  }
  return data
}