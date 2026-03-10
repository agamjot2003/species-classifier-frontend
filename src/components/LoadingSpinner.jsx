export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12" role="status">
      <div className="relative w-16 h-16">
        {/* Outer ring — static gray track */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        {/* Inner ring — green, spins via animate-spin Tailwind class */}
        {/* border-t-transparent creates the "gap" that makes it look like a spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-gray-700">Processing point cloud...</p>
        <p className="text-sm text-gray-400 mt-1">Converting .laz → 4 view images</p>
      </div>
    </div>
  )
}