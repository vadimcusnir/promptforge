import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Download, ExternalLink, Sparkles, Zap, Eye } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import './App.css'

// Import assets
import forgeLogo from './assets/forge_logo_primary.png'
import forgeLogoWithText from './assets/forge_logo_with_text.png'
import forgeIconTransparent from './assets/forge_icon_transparent.png'
import forgeLogoSvg from './assets/forge_logo.svg'

// Import videos
import inversulLuminii from './assets/inversul_luminii.mp4'
import luminaDinTacere from './assets/lumina_din_tacere.mp4'
import aparatulDeVizualizare from './assets/aparatul_de_vizualizare.mp4'
import faraGlyph from './assets/fara_glyph.mp4'
import contaminare from './assets/contaminare.mp4'

function App() {
  const [currentVideo, setCurrentVideo] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const logoVariants = [
    {
      name: "Logo Primar",
      description: "Fundal pătrat rotunjit auriu cu glyph fractalic negru",
      image: forgeLogo,
      usage: "Favicon, sigiliu, AI core"
    },
    {
      name: "Logo cu Text",
      description: "Varianta completă cu Forge™ în Space Grotesk Bold",
      image: forgeLogoWithText,
      usage: "Header, footer, prezentări"
    },
    {
      name: "Icon Transparent",
      description: "Glyph pur pe fundal transparent",
      image: forgeIconTransparent,
      usage: "Overlay, watermark, butoane"
    }
  ]

  const animations = [
    {
      name: "Glyph Reveal",
      description: "Se taie cu o linie verticală ca o sabie",
      category: "Interacțiuni simbolice",
      file: "glyph_reveal.html"
    },
    {
      name: "Golden Pulse",
      description: "Fundal auriu pulsează discret 1/sec",
      category: "Interacțiuni simbolice", 
      file: "golden_pulse.html"
    },
    {
      name: "Magnetic Sigil",
      description: "Glyph se atrage în centrul pătratului când mouse-ul e aproape",
      category: "Interacțiuni simbolice",
      file: "magnetic_sigil.html"
    },
    {
      name: "Click Ignition",
      description: "Colțurile pătratului se rotesc în sens invers",
      category: "Interacțiuni simbolice",
      file: "click_ignition.html"
    },
    {
      name: "Neon Trail",
      description: "Contur subțire glyph animat ca o undă electrică",
      category: "Interacțiuni simbolice",
      file: "neon_trail.html"
    },
    {
      name: "Dust Bloom",
      description: "Particulă de fum aurie care se evaporă la hover",
      category: "Interacțiuni simbolice",
      file: "dust_bloom.html"
    },
    {
      name: "Outline ↔ Fill",
      description: "Glyphul pornește gol și se umple în 0.4 sec",
      category: "Interacțiuni simbolice",
      file: "outline_fill.html"
    },
    {
      name: "Ink Spread",
      description: "Glyph apare ca o pată de cerneală care prinde contur",
      category: "Interacțiuni simbolice",
      file: "ink_spread.html"
    },
    {
      name: "Hover Breathing",
      description: "Fundal respiră ușor (0.98–1.02 scale loop)",
      category: "Interacțiuni simbolice",
      file: "hover_breathing.html"
    },
    {
      name: "Triumph Lines",
      description: "Apar 3 linii verticale din glyph, ca încoronare",
      category: "Interacțiuni simbolice",
      file: "triumph_lines.html"
    },
    {
      name: "Scroll Reveal",
      description: "Logo se descompune în 3 părți și se recompune la scroll",
      category: "Reacții UI-native",
      file: "scroll_reveal.html"
    },
    {
      name: "Time Pulse",
      description: "Glyph bate ca un ceas o dată pe minut",
      category: "Reacții UI-native",
      file: "time_pulse.html"
    }
  ]

  const videos = [
    {
      name: "Inversul Luminii",
      description: "Ce-ar fi dacă logo-ul nu s-ar lumina, ci ar absorbi toată lumina din jur?",
      concept: "Absorpția luminii spre centru, revelarea prin absența luminii",
      duration: "~7 secunde",
      file: inversulLuminii
    },
    {
      name: "Lumina din Tăcere",
      description: "În loc să apară cu zgomot, glyphul apare când TOTUL se oprește.",
      concept: "Revelarea prin tăcere, descoperirea în vid absolut",
      duration: "~6.5 secunde", 
      file: luminaDinTacere
    },
    {
      name: "Aparatul de Vizualizare",
      description: "Nu glyphul e vizibil, ci retina ta e calibrată să-l vadă.",
      concept: "Lentila AI care scanează și detectează simbolul existent",
      duration: "~6.5 secunde",
      file: aparatulDeVizualizare
    },
    {
      name: "Fără Glyph",
      description: "Ce-ar fi dacă logo-ul ar fi absent în toată animația?",
      concept: "Sculptarea prin absența aurului, prezența prin absență",
      duration: "~7 secunde",
      file: faraGlyph
    },
    {
      name: "Contaminare",
      description: "Glyphul nu apare. Se răspândește ca un virus în imagine.",
      concept: "Răspândirea virală și inteligentă a simbolului",
      duration: "~6.8 secunde",
      file: contaminare
    }
  ]

  const playVideo = (video) => {
    setCurrentVideo(video)
    setIsPlaying(true)
  }

  const closeVideo = () => {
    setCurrentVideo(null)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <img 
              src={forgeLogo} 
              alt="Forge Logo" 
              className="w-32 h-32 mx-auto hero-glyph"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold mb-6 ritual-text"
          >
            FORGE
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Sistem complet de branding interactiv cu animații SVG și video-uri ritualice
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Badge variant="outline" className="forge-border-glow px-4 py-2 text-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              20 Animații Interactive
            </Badge>
            <Badge variant="outline" className="forge-border-glow px-4 py-2 text-lg">
              <Zap className="w-4 h-4 mr-2" />
              5 Video-uri Ritualice
            </Badge>
            <Badge variant="outline" className="forge-border-glow px-4 py-2 text-lg">
              <Eye className="w-4 h-4 mr-2" />
              Concepte Avantgarde
            </Badge>
          </motion.div>
        </div>
        
        <div className="section-divider"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="logos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="logos">Logo-uri</TabsTrigger>
            <TabsTrigger value="animations">Animații SVG</TabsTrigger>
            <TabsTrigger value="videos">Video-uri Ritualice</TabsTrigger>
          </TabsList>

          {/* Logos Tab */}
          <TabsContent value="logos" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 forge-golden">Identitate Vizuală</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Logo primar cu fundal pătrat rotunjit auriu (#F4B001) și glyph fractalic negru (#000000). 
                Mesaj semantic: "Identitatea e putere. Nu e nevoie să o pronunți."
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {logoVariants.map((logo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="animation-card bg-card border-border">
                    <CardHeader>
                      <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                        <img 
                          src={logo.image} 
                          alt={logo.name}
                          className="max-w-32 max-h-32 object-contain"
                        />
                      </div>
                      <CardTitle className="forge-golden">{logo.name}</CardTitle>
                      <CardDescription>{logo.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="mb-4">
                        {logo.usage}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="forge-border-glow">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="forge-border-glow">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Animations Tab */}
          <TabsContent value="animations" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 forge-golden">Animații Interactive</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                20 de animații SVG organizate în 3 categorii: Interacțiuni simbolice, Reacții UI-native și Simbolism.
                Fiecare animație este subtilă, inteligentă și perfect integrabilă.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animations.map((animation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="animation-card bg-card border-border h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg forge-golden">{animation.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {animation.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {animation.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        size="sm" 
                        className="w-full forge-bg-golden text-black hover:bg-yellow-500"
                        onClick={() => window.open(`/animations/${animation.file}`, '_blank')}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Vezi Animația
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 forge-golden">Video-uri Ritualice</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                5 concepte video avantgarde construite pe antagonisme: lumină ↔ absență, zgomot ↔ tăcere, formă ↔ câmp.
                Nu apariția glyphului este importantă, ci <span className="forge-golden">modul în care universul devine capabil să-l accepte</span>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="animation-card bg-card border-border">
                    <CardHeader>
                      <div className="video-container aspect-square mb-4 cursor-pointer" onClick={() => playVideo(video)}>
                        <video 
                          className="w-full h-full object-cover"
                          muted
                          loop
                          preload="metadata"
                        >
                          <source src={video.file} type="video/mp4" />
                        </video>
                        <div className="video-overlay flex items-center justify-center">
                          <Play className="w-16 h-16 text-white" />
                        </div>
                      </div>
                      <CardTitle className="forge-golden text-xl">{video.name}</CardTitle>
                      <CardDescription className="text-sm italic mb-2">
                        "{video.description}"
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mb-2">
                        {video.concept}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {video.duration}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full forge-bg-golden text-black hover:bg-yellow-500"
                        onClick={() => playVideo(video)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Redă Video
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                className="w-full h-auto rounded-lg"
                controls
                autoPlay
                loop
              >
                <source src={currentVideo.file} type="video/mp4" />
              </video>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-black bg-opacity-50"
                onClick={closeVideo}
              >
                ✕
              </Button>
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold forge-golden mb-2">{currentVideo.name}</h3>
                <p className="text-muted-foreground italic">"{currentVideo.description}"</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <img src={forgeLogoWithText} alt="Forge" className="w-48 mx-auto mb-4 opacity-80" />
          <p className="text-muted-foreground">
            Sistem complet de branding interactiv • Concepte ritualice avantgarde
          </p>
          <p className="text-sm text-muted-foreground mt-2 forge-mono">
            "Identitatea e putere. Nu e nevoie să o pronunți."
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
