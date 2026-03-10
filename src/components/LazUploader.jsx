import { useRef, useState } from 'react'

const MAX_SIZE_MB = 150

export default function LazUploader({ onFileSelected, onSubmit, selectedFile, isLoading }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError]       = useState(null)
  const fileInputRef            = useRef(null)

  const handleFile = (file) => {
    setError(null)
    if (!file) return

    // Check file extension — more reliable than MIME type for .laz
    const name = file.name.toLowerCase()
    if (!name.endsWith('.laz') && !name.endsWith('.las')) {
      setError('Only .laz or .las files are accepted.')
      return
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_SIZE_MB) {
      setError(`File too large: ${sizeMB.toFixed(1)}MB. Max is ${MAX_SIZE_MB}MB.`)
      return
    }

    // Valid file — pass it up to App.jsx
    onFileSelected(file)
  }

  // e.preventDefault() is REQUIRED for drag & drop.
  // Without it the browser opens the file instead of dropping it.
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = ()  => setDragOver(false)
  const handleDrop      = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const formatSize = (bytes) => {
    if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Drop zone */}
      <div
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
          ${dragOver
            ? 'border-green-500 bg-green-50 scale-105 cursor-copy'
            : selectedFile
            ? 'border-green-400 bg-green-50 cursor-default'
            : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50 cursor-pointer'
          }
        `}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🌲</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{selectedFile.name}</p>
              <p className="text-xs text-gray-400 mt-1">{formatSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
              className="text-xs text-green-600 underline hover:text-green-800"
            >
              Choose a different file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <span className="text-5xl">{dragOver ? '📂' : '📁'}</span>
            <p className="text-lg font-medium text-gray-700">
              {dragOver ? 'Drop it here!' : 'Drop a .laz file here'}
            </p>
            <p className="text-sm text-gray-400">or click to browse</p>
            <p className="text-xs text-gray-300 mt-1">.laz or .las · Max {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </div>

      {/* Hidden file input — triggered by clicking the drop zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".laz,.las"
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />

      {/* Validation error */}
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center" role="alert">
          ⚠️ {error}
        </p>
      )}

      {/* Process button — only appears after a valid file is selected */}
      {selectedFile && (
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`
            mt-4 w-full py-3 px-6 rounded-xl font-semibold text-white text-base
            transition-all duration-200
            ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 active:scale-95 shadow-md'
            }
          `}
        >
          {isLoading ? '⏳ Processing point cloud...' : '🔬 Generate Views'}
        </button>
      )}
    </div>
  )
}