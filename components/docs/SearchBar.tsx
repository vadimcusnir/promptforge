"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality across documentation
    console.log("Searching for:", searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:border-[#d1a954] transition-all duration-200"
        />
      </div>
    </form>
  );
}
