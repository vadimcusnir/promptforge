"use client"

const vectors = [
  { id: "all", name: "All Modules", color: "text-white", count: 50 },
  { id: "V1", name: "SaaS Marketing", color: "text-red-400", count: 8 },
  { id: "V2", name: "Content & PR", color: "text-blue-400", count: 7 },
  { id: "V3", name: "Sales & CRM", color: "text-green-400", count: 6 },
  { id: "V4", name: "Product & UX", color: "text-yellow-400", count: 8 },
  { id: "V5", name: "Operations", color: "text-purple-400", count: 7 },
  { id: "V6", name: "Analytics", color: "text-pink-400", count: 6 },
  { id: "V7", name: "Innovation", color: "text-cyan-400", count: 8 },
]

interface VectorFilterProps {
  selectedVector: string
  onVectorChange: (vector: string) => void
}

export function VectorFilter({ selectedVector, onVectorChange }: VectorFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {vectors.map((vector) => (
        <button
          key={vector.id}
          onClick={() => onVectorChange(vector.id)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            selectedVector === vector.id
              ? "border-[#d1a954] bg-[#d1a954]/10 text-[#d1a954]"
              : "border-[#5a5a5a]/30 hover:border-[#5a5a5a] text-[#5a5a5a] hover:text-white"
          }`}
        >
          <span className={vector.color}>{vector.name}</span>
          <span className="ml-2 text-xs opacity-60">({vector.count})</span>
        </button>
      ))}
    </div>
  )
}
