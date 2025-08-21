"use client"

import { Search } from "lucide-react"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5a5a5a]" />
      <input
        type="text"
        placeholder="Search modules by name or description..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-lg text-white placeholder-[#5a5a5a] focus:border-[#d1a954] focus:outline-none transition-colors"
      />
    </div>
  )
}
