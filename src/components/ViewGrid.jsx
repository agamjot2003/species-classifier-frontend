export default function ViewGrid({ images }) {
  if (!images) return null
  const { nadir, facade, rear, zoomed, point_count, species_name, confidence, top_k } = images

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">

      {species_name && (
        <div className="mb-4 p-5 bg-white rounded-2xl border border-green-200 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-1">
            Predicted Species
          </p>
          <h2 className="text-2xl font-bold text-gray-900 italic mb-3">
            {species_name}
          </h2>

          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">Confidence</span>
            <span className="text-sm font-semibold">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-green-500 transition-all duration-700"
              style={{ width: `${(confidence * 100).toFixed(1)}%` }}
            />
          </div>

          {top_k && top_k.length > 1 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                Top {top_k.length} Predictions
              </p>
              {top_k.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm italic ${i === 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {p.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{(p.score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Generated Views</h2>
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          {point_count?.toLocaleString()} points
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'nadir',  src: nadir,  label: 'Nadir',  desc: 'Top-down (X-Y)',    icon: '⬇️' },
          { key: 'facade', src: facade, label: 'Facade', desc: 'Front side (X-Z)',   icon: '🌳' },
          { key: 'rear',   src: rear,   label: 'Rear',   desc: 'Back side (X-Z)',    icon: '🌲' },
          { key: 'zoomed', src: zoomed, label: 'Zoomed', desc: 'Central 60% (Y-Z)', icon: '🔍' },
        ].map((view) => (
          <div key={view.key} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-black aspect-square">
              <img
                src={`data:image/png;base64,${view.src}`}
                alt={view.label}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-gray-800">{view.icon} {view.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{view.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}