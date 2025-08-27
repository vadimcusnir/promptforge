import { useState, useEffect } from "react"

interface LocalizedText {
  [key: string]: {
    [locale: string]: string
  }
}

interface LocalizedFeatures {
  [planId: string]: {
    [locale: string]: string[]
  }
}

export type Locale = "en" | "ro" | "es" | "fr" | "de"

const localizedTexts: LocalizedText = {
  "pricing.title": {
    en: "Choose Your Plan",
    ro: "Alege Planul Tău",
    es: "Elige Tu Plan",
    fr: "Choisissez Votre Plan",
    de: "Wählen Sie Ihren Plan",
  },
  "pricing.subtitle": {
    en: "Scale from pilot to enterprise with clear upgrade paths",
    ro: "Scalați de la pilot la enterprise cu căi clare de upgrade",
    es: "Escala desde piloto hasta empresa con caminos claros de actualización",
    fr: "Passez du pilote à l'entreprise avec des chemins de mise à niveau clairs",
    de: "Skalieren Sie vom Pilotprojekt zum Unternehmen mit klaren Upgrade-Pfaden",
  },
  "pricing.monthly": {
    en: "Monthly",
    ro: "Lunar",
    es: "Mensual",
    fr: "Mensuel",
    de: "Monatlich",
  },
  "pricing.annual": {
    en: "Annual",
    ro: "Anual",
    es: "Anual",
    fr: "Annuel",
    de: "Jährlich",
  },
  "pricing.save": {
    en: "Save 20%",
    ro: "Economisește 20%",
    es: "Ahorra 20%",
    fr: "Économisez 20%",
    de: "Sparen Sie 20%",
  },
  "pricing.mostPopular": {
    en: "Most Popular",
    ro: "Cel Mai Popular",
    es: "Más Popular",
    fr: "Le Plus Populaire",
    de: "Am Beliebtesten",
  },
  "pricing.faq.title": {
    en: "Frequently Asked Questions",
    ro: "Întrebări Frecvente",
    es: "Preguntas Frecuentes",
    fr: "Questions Fréquemment Posées",
    de: "Häufig Gestellte Fragen",
  },
  "pricing.faq.freePlan": {
    en: "What's included in the free plan?",
    ro: "Ce este inclus în planul gratuit?",
    es: "¿Qué incluye el plan gratuito?",
    fr: "Qu'est-ce qui est inclus dans le plan gratuit ?",
    de: "Was ist im kostenlosen Plan enthalten?",
  },
  "pricing.faq.freePlanAnswer": {
    en: "The free plan includes access to 3 core modules (M01, M10, M18), basic text exports, and local history storage. Perfect for trying out the platform.",
    ro: "Planul gratuit include accesul la 3 module de bază (M01, M10, M18), exporturi de text de bază și stocarea istoricului local. Perfect pentru a încerca platforma.",
    es: "El plan gratuito incluye acceso a 3 módulos principales (M01, M10, M18), exportaciones de texto básicas y almacenamiento de historial local. Perfecto para probar la plataforma.",
    fr: "Le plan gratuit comprend l'accès à 3 modules de base (M01, M10, M18), des exportations de texte de base et le stockage de l'historique local. Parfait pour essayer la plateforme.",
    de: "Der kostenlose Plan umfasst Zugang zu 3 Kernmodulen (M01, M10, M18), grundlegende Textexporte und lokale Verlaufsverwaltung. Perfekt zum Ausprobieren der Plattform.",
  },
  "pricing.faq.upgradeDowngrade": {
    en: "Can I upgrade or downgrade anytime?",
    ro: "Pot să fac upgrade sau downgrade oricând?",
    es: "¿Puedo actualizar o degradar en cualquier momento?",
    fr: "Puis-je mettre à niveau ou rétrograder à tout moment ?",
    de: "Kann ich jederzeit upgraden oder downgraden?",
  },
  "pricing.faq.upgradeDowngradeAnswer": {
    en: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
    ro: "Da, poți schimba planul oricând. Upgrade-urile au efect imediat, iar downgrade-urile au efect la următorul ciclu de facturare.",
    es: "Sí, puedes cambiar tu plan en cualquier momento. Las actualizaciones entran en vigor inmediatamente, mientras que las degradaciones entran en vigor en el próximo ciclo de facturación.",
    fr: "Oui, vous pouvez changer votre plan à tout moment. Les mises à niveau prennent effet immédiatement, tandis que les rétrogradations prennent effet au prochain cycle de facturation.",
    de: "Ja, Sie können Ihren Plan jederzeit ändern. Upgrades treten sofort in Kraft, während Downgrades im nächsten Abrechnungszyklus wirksam werden.",
  },
  "pricing.faq.testing": {
    en: "What's the difference between simulated and live testing?",
    ro: "Care este diferența între testarea simulată și cea live?",
    es: "¿Cuál es la diferencia entre las pruebas simuladas y en vivo?",
    fr: "Quelle est la différence entre les tests simulés et en direct ?",
    de: "Was ist der Unterschied zwischen simulierten und Live-Tests?",
  },
  "pricing.faq.testingAnswer": {
    en: "Simulated testing uses our internal algorithms to score prompts. Live testing uses actual GPT models for more accurate evaluation (Pro+ only).",
    ro: "Testarea simulată folosește algoritmii noștri interni pentru a evalua prompturile. Testarea live folosește modelele GPT reale pentru o evaluare mai precisă (doar Pro+).",
    es: "Las pruebas simuladas utilizan nuestros algoritmos internos para puntuar las indicaciones. Las pruebas en vivo utilizan modelos GPT reales para una evaluación más precisa (solo Pro+).",
    fr: "Les tests simulés utilisent nos algorithmes internes pour évaluer les prompts. Les tests en direct utilisent de vrais modèles GPT pour une évaluation plus précise (Pro+ uniquement).",
    de: "Simulierte Tests verwenden unsere internen Algorithmen zur Bewertung von Prompts. Live-Tests verwenden echte GPT-Modelle für eine genauere Bewertung (nur Pro+).",
  },
  "pricing.faq.enterprise": {
    en: "Do you offer enterprise discounts?",
    ro: "Oferiți reduceri pentru enterprise?",
    es: "¿Ofrecen descuentos empresariales?",
    fr: "Proposez-vous des réductions pour les entreprises ?",
    de: "Bieten Sie Unternehmensrabatte an?",
  },
  "pricing.faq.enterpriseAnswer": {
    en: "Yes, we offer volume discounts for teams of 10+ users and custom pricing for large organizations. Contact our sales team for details.",
    ro: "Da, oferim reduceri de volum pentru echipele cu 10+ utilizatori și prețuri personalizate pentru organizațiile mari. Contactați echipa noastră de vânzări pentru detalii.",
    es: "Sí, ofrecemos descuentos por volumen para equipos de 10+ usuarios y precios personalizados para organizaciones grandes. Contacte a nuestro equipo de ventas para más detalles.",
    fr: "Oui, nous proposons des réductions de volume pour les équipes de 10+ utilisateurs et des tarifs personnalisés pour les grandes organisations. Contactez notre équipe commerciale pour plus de détails.",
    de: "Ja, wir bieten Mengenrabatte für Teams mit 10+ Benutzern und maßgeschneiderte Preise für große Organisationen. Kontaktieren Sie unser Vertriebsteam für Details.",
  },
}

const localizedFeatures: LocalizedFeatures = {
  creator: {
    en: ["All modules (M01-M40)", "Export txt, md, pdf", "Local history", "Community support"],
    ro: ["Toate modulele (M01-M40)", "Export txt, md, pdf", "Istoric local", "Suport comunitate"],
    es: ["Todos los módulos (M01-M40)", "Exportar txt, md, pdf", "Historial local", "Soporte comunitario"],
    fr: ["Tous les modules (M01-M40)", "Export txt, md, pdf", "Historique local", "Support communautaire"],
    de: ["Alle Module (M01-M40)", "Export txt, md, pdf", "Lokaler Verlauf", "Community-Support"],
  },
  pro: {
    en: ["All modules (M01-M50)", "Export txt, md, pdf, json", "Live Test Engine", "Cloud history"],
    ro: ["Toate modulele (M01-M50)", "Export txt, md, pdf, json", "Motor de testare live", "Istoric cloud"],
    es: ["Todos los módulos (M01-M50)", "Exportar txt, md, pdf, json", "Motor de pruebas en vivo", "Historial en la nube"],
    fr: ["Tous les modules (M01-M50)", "Export txt, md, pdf, json", "Moteur de test en direct", "Historique cloud"],
    de: ["Alle Module (M01-M50)", "Export txt, md, pdf, json", "Live-Test-Engine", "Cloud-Verlauf"],
  },
  enterprise: {
    en: ["Everything in Pro", "API access", "Bundle.zip exports", "White-label options"],
    ro: ["Tot din Pro", "Acces API", "Exporturi Bundle.zip", "Opțiuni White-label"],
    es: ["Todo de Pro", "Acceso API", "Exportaciones Bundle.zip", "Opciones White-label"],
    fr: ["Tout de Pro", "Accès API", "Exports Bundle.zip", "Options White-label"],
    de: ["Alles von Pro", "API-Zugang", "Bundle.zip-Exporte", "White-Label-Optionen"],
  },
}

export function useLocalization() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en")

  useEffect(() => {
    // Detect user's preferred language from browser
    const browserLang = navigator.language.split("-")[0] as Locale
    if (browserLang && ["en", "ro", "es", "fr", "de"].includes(browserLang)) {
      setCurrentLocale(browserLang)
    }

    // Load saved preference from localStorage
    const savedLocale = localStorage.getItem("preferred-locale") as Locale
    if (savedLocale && ["en", "ro", "es", "fr", "de"].includes(savedLocale)) {
      setCurrentLocale(savedLocale)
    }
  }, [])

  const changeLocale = (locale: Locale) => {
    setCurrentLocale(locale)
    localStorage.setItem("preferred-locale", locale)
    
    // Track locale change
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "locale_change", {
        locale,
        page: "pricing",
      })
    }
  }

  const t = (key: string): string => {
    return localizedTexts[key]?.[currentLocale] || localizedTexts[key]?.["en"] || key
  }

  const getFeatures = (planId: string): string[] => {
    return localizedFeatures[planId]?.[currentLocale] || localizedFeatures[planId]?.["en"] || []
  }

  const getCurrencySymbol = (): string => {
    const currencyMap: Record<Locale, string> = {
      en: "$",
      ro: "RON",
      es: "€",
      fr: "€",
      de: "€",
    }
    return currencyMap[currentLocale] || "$"
  }

  const getDateFormat = (): Intl.DateTimeFormat => {
    const formatMap: Record<Locale, string> = {
      en: "en-US",
      ro: "ro-RO",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
    }
    return new Intl.DateTimeFormat(formatMap[currentLocale] || "en-US")
  }

  return {
    currentLocale,
    changeLocale,
    t,
    getFeatures,
    getCurrencySymbol,
    getDateFormat,
    supportedLocales: ["en", "ro", "es", "fr", "de"] as const,
  }
}
