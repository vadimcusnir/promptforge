"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GuidesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/docs")
  }, [router])

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Documentation...</h1>
        <p className="text-gray-400">Guides have been moved to the Docs section.</p>
      </div>
    </div>
  )
}
