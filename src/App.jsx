import { useState, useEffect } from 'react'
import LazUploader    from './components/LazUploader.jsx'
import ViewGrid       from './components/ViewGrid.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import { preprocessLaz, predictSpecies, checkHealth } from './api/predict.js'

export default function App() {
  // All shared state lives here in the parent.
  // Child components receive data through props — they never
  // manage state that other components also need to see.
  const [selectedFile,  setSelectedFile]  = useState(null)
  const [images,        setImages]        = useState(null)
  const [isLoading,     setIsLoading]     = useState(false)
  const [error,         setError]         = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')

  // Runs ONCE after first render — checks if backend is alive
  useEffect(() => {
    checkHealth().then((data) => {
      setBackendStatus(data.status === 'ok' ? 'ok' : 'error')
    })
  }, [])

  const handleFileSelected = (file) => {
    setSelectedFile(file)
    setImages(null)   // clear old results when new file chosen
    setError(null)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsLoading(true)
    setError(null)
    setImages(null)

    try {
      const result = await predictSpecies(selectedFile)
      setImages(result)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      // finally always runs — success OR failure
      // Guarantees the spinner always turns off
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setImages(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">

      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌲</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tree Species Classifier</h1>
              <p className="text-xs text-gray-500">Upload a .laz file → see 4 tree view images</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              backendStatus === 'ok'    ? 'bg-green-500' :
              backendStatus === 'error' ? 'bg-red-500'   :
                                          'bg-yellow-400 animate-pulse'
            }`} />
            <span className="text-xs text-gray-500">
              {backendStatus === 'ok'    ? 'API Ready'    :
               backendStatus === 'error' ? 'API Offline'  : 'Connecting...'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {backendStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <strong>Backend offline.</strong> Run:{' '}
            <code className="bg-red-100 px-1 rounded">uvicorn main:app --reload</code>
          </div>
        )}

        <LazUploader
          onFileSelected={handleFileSelected}
          onSubmit={handleSubmit}
          selectedFile={selectedFile}
          isLoading={isLoading}
        />

        {isLoading && <LoadingSpinner />}

        {error && !isLoading && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {images && !isLoading && <ViewGrid images={images} />}

        {(images || error) && !isLoading && (
          <button
            onClick={handleReset}
            className="mt-4 w-full max-w-lg mx-auto block py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            ↩ Upload another file
          </button>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-gray-400">
        Tree Species Classifier
      </footer>
    </div>
  )
}