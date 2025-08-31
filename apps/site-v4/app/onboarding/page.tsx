"use client"

import { useRouter } from "next/navigation"
import OnboardingFlow from "@/components/onboarding/onboarding-flow"

export default function OnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    // Mark onboarding as complete and redirect to dashboard
    localStorage.setItem("promptforge_onboarding_complete", "true")
    router.push("/dashboard")
  }

  return <OnboardingFlow onComplete={handleComplete} />
}
