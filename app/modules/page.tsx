"use client"

import { useState } from "react"
import { ModuleGrid } from "@/components/module-grid"
import { VectorFilter } from "@/components/ui/vector-filter"
import { SearchBar } from "@/components/ui/search-bar"
import { Montserrat, Open_Sans } from "next/font/google"

const montserrat = Montserrat({ subsets: ["latin"] })
const openSans = Open_Sans({ subsets: ["latin"] })

export default function ModulesPage() {
  const [selectedVector, setSelectedVector] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-16 border-b border-[#5a5a5a]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1
              className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#5a5a5a] bg-clip-text text-transparent ${montserrat.className}`}
            >
              50 Operational Modules. 7 Vectors. Zero Improvisation.
            </h1>
            <p className={`text-xl text-[#5a5a5a] max-w-3xl mx-auto ${openSans.className}`}>
              Choose your module, configure 7-D parameters, export the artifact. Each module is battle-tested for
              enterprise deployment.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <VectorFilter selectedVector={selectedVector} onVectorChange={setSelectedVector} />
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ModuleGrid selectedVector={selectedVector} searchQuery={searchQuery} />
        </div>
      </section>
    </div>
  )
}
