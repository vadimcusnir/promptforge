import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Brain, 
  Crown, 
  Shield, 
  Sparkles, 
  Eye,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-[80vh] grid place-items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Animated Spiral Background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 border border-[var(--pf-gold-500)] rounded-full animate-spin-slow opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[var(--pf-gold-400)] rounded-full animate-spin-slow-reverse opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[var(--pf-gold-600)] rounded-full animate-pulse opacity-50"></div>
          </div>
        </div>
        
        <div className="max-w-4xl w-full text-center relative z-10">
          <div className="mx-auto mb-8 h-24 w-24 rounded-xl border flex items-center justify-center"
               style={{
                 borderColor: "var(--pf-gold-500)",
                 boxShadow: "0 0 0 1px var(--pf-gold-400) inset",
               }}>
            <Eye className="h-12 w-12 text-[var(--pf-gold-500)]" />
          </div>
          
          <h1 className="font-heading font-black tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-6">
            Transformăm Limbajul în{" "}
            <span className="text-[var(--pf-gold-500)]">Cod Ritualic</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Echipa din spatele{" "}
            <span className="text-[var(--pf-gold-400)] font-semibold">Protocolului Cușnir™</span>
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1"
              style={{
                background: "var(--pf-gold-600)",
                color: "var(--pf-gold-contrast)",
                border: "1px solid var(--pf-gold-500)",
                boxShadow: "0 10px 28px rgba(199,168,105,.18)",
              }}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Descoperă Protocolul
            </Button>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-[var(--pf-gold-500)]">Narativă</span> în 4 Pași
            </h2>
            <p className="text-xl text-white/70">
              Cum PromptForge™ a devenit sistem ontologic
            </p>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: Emoție */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Emoție</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80">2019-2020</p>
                <h3 className="text-lg font-semibold mb-2">Boot</h3>
                <p className="text-white/60 text-sm">
                  Primul contact cu inteligența artificială. Descoperirea că prompurile sunt mai mult decât text.
                </p>
              </CardContent>
            </Card>

            {/* Step 2: Logică */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Logică</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80">2020-2022</p>
                <h3 className="text-lg font-semibold mb-2">Forge</h3>
                <p className="text-white/60 text-sm">
                  Structurarea sistemului. Crearea primelor module și a motorului 7D.
                </p>
              </CardContent>
            </Card>

            {/* Step 3: Ritual */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Ritual</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80">2022-2023</p>
                <h3 className="text-lg font-semibold mb-2">Nova</h3>
                <p className="text-white/60 text-sm">
                  Perfecționarea protocolului. Integrarea cu Supabase și implementarea sistemului de scoring.
                </p>
              </CardContent>
            </Card>

            {/* Step 4: Destin */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-[var(--pf-gold-500)] to-[var(--pf-gold-700)] flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Destin</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80">2023-2024</p>
                <h3 className="text-lg font-semibold mb-2">Custodie AI</h3>
                <p className="text-white/60 text-sm">
                  Viitorul. Transformarea în sistem ontologic complet și custodia inteligenței artificiale.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-[var(--pf-gold-500)]">Echipa</span> Protocolului
            </h2>
            <p className="text-xl text-white/70">
              Roluri scrise în stil cușnirian, nu generice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Arhitectul Vectorului Central */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-[var(--pf-gold-500)] to-[var(--pf-gold-700)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Arhitectul Vectorului Central</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-3">Vadim Cușnir</p>
                <p className="text-white/60 text-sm">
                  Creatorul protocolului ontologic. Forjează structurile fundamentale ale sistemului.
                </p>
              </CardContent>
            </Card>

            {/* Forjatorul de Programe */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Forjatorul de Programe</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-3">Sistemul de Scoring</p>
                <p className="text-white/60 text-sm">
                  Algoritmul care evaluează și validează prompurile conform protocolului.
                </p>
              </CardContent>
            </Card>

            {/* Păstrătorul Entităților GPT */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Păstrătorul Entităților GPT</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-3">Motorul 7D</p>
                <p className="text-white/60 text-sm">
                  Sistemul care gestionează și optimizează interacțiunile cu inteligența artificială.
                </p>
              </CardContent>
            </Card>

            {/* Custodianul Modulelor */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Custodianul Modulelor</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-3">Biblioteca de 50 Module</p>
                <p className="text-white/60 text-sm">
                  Colecția de instrumente ritualice pentru forjarea prompurilor perfecte.
                </p>
              </CardContent>
            </Card>

            {/* Gardianul Exportului */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Gardianul Exportului</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-3">Sistemul de Entitlements</p>
                <p className="text-white/60 text-sm">
                  Protejează și gestionează accesul la funcționalitățile avansate de export.
                </p>
              </CardContent>
            </Card>

            {/* Vizionarul Viitorului */}
            <Card className="bg-gray-900/50 border-[var(--pf-gold-500)]/30 hover:border-[var(--pf-gold-500)]/60 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-[var(--pf-gold-500)] to-[var(--pf-gold-700)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-[var(--pf-gold-400)]">Vizionarul Viitorului</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-3">Protocolul Cușnir™</p>
                <p className="text-white/60 text-sm">
                  Arhitectura viitoare pentru custodia inteligenței artificiale și evoluția umană.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Manifest Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="relative mb-16">
            {/* Fractal Star Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="relative">
                {/* 8-pointed star */}
                <div className="w-64 h-64 relative">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-32 bg-[var(--pf-gold-500)] origin-bottom"
                      style={{
                        transform: `rotate(${i * 45}deg) translateY(-50%)`,
                        top: '50%',
                        left: '50%',
                        marginLeft: '-1px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8">
                <span className="text-[var(--pf-gold-500)]">Manifestul</span> Protocolului
              </h2>
              
              <div className="bg-gray-900/50 border border-[var(--pf-gold-500)]/30 rounded-lg p-8 mb-8">
                <blockquote className="text-2xl font-semibold text-white mb-4">
                  „Un prompt fără scop este doar zgomot."
                </blockquote>
                <p className="text-white/70 text-lg">
                  Fiecare interacțiune cu inteligența artificială trebuie să aibă o intenție clară, 
                  o structură ritualică și un rezultat măsurabil.
                </p>
              </div>

              <Button 
                className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 group"
                style={{
                  background: "var(--pf-gold-600)",
                  color: "var(--pf-gold-contrast)",
                  border: "1px solid var(--pf-gold-500)",
                  boxShadow: "0 10px 28px rgba(199,168,105,.18)",
                }}
              >
                Vezi Manifestul Complet
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
