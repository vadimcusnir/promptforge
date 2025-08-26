import { CheckCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="bg-black/40 backdrop-blur-sm border-gray-800/50 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white font-serif">Welcome to the Forge!</CardTitle>
              <p className="text-gray-400 font-sans">
                Thank you for joining our waitlist. We'll notify you as soon as PromptForge is ready to transform your
                prompt engineering workflow.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 font-sans">
                  Keep an eye on your inbox for updates and early access opportunities.
                </p>
              </div>

              <Link href="/coming-soon">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-sans bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Waitlist
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
