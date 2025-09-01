"use client";

const vectors = [
  { id: "all", name: "All Modules", color: "text-white", count: 50 },
  { id: "strategic", name: "Strategic", color: "text-blue-400", count: 25 },
  { id: "rhetoric", name: "Rhetoric", color: "text-green-400", count: 18 },
  { id: "content", name: "Content", color: "text-yellow-400", count: 22 },
  { id: "analytics", name: "Analytics", color: "text-red-400", count: 20 },
  { id: "branding", name: "Branding", color: "text-purple-400", count: 15 },
  { id: "crisis", name: "Crisis", color: "text-pink-400", count: 8 },
  { id: "cognitive", name: "Cognitive", color: "text-cyan-400", count: 12 },
];

interface VectorFilterProps {
  selectedVector: string;
  onVectorChange: (vector: string) => void;
}

export function VectorFilter({
  selectedVector,
  onVectorChange,
}: VectorFilterProps) {
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
  );
}
