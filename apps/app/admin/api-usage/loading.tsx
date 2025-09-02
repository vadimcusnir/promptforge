export default function Loading() {
  return (
    <div className="min-h-screen bg-[#05010A] text-white p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#CDA434] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading API usage metrics...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
