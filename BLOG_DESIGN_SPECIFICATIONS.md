# 📝 PROMPTFORGE™ v3 - Blog Design Specifications

## 🎨 **DESIGN SYSTEM INTEGRATION - SKRE**

### **Paleta de Culori (70/20/10)**
- **70% Dark**: #000000, #0e0e0e, #1a1a1a, #2a2a2a
- **20% Gray**: #404040, #5a5a5a, #606060, #808080, #a0a0a0
- **10% Gold**: #d1a954, #e6c200, #ffd700, #ffed4e

### **Tipografie**
- **Montserrat**: Titluri (H1-H6), navigație, CTA-uri
- **Open Sans**: Text corp, paragrafe, meta-informații
- **Mărimi**: Minim 16px pentru text corp, line-height 1.5-1.6

### **Componente SKRE**
- **Glass Cards**: backdrop-blur + transparență pentru carduri
- **Gold Accents**: Doar pentru CTA-uri și linkuri esențiale
- **Plumb Borders**: #5a5a5a pentru separatori și carduri
- **Hover Effects**: Glow auriu discret pentru interacțiuni

---

## 🏗️ **STRUCTURA /BLOG (INDEX)**

### **Hero Section**
```
┌─────────────────────────────────────────────────────────┐
│ Blog PromptForge™                                      │
│ Transformări strategice în prompt engineering          │
│ [Pattern subtil din rune]                              │
└─────────────────────────────────────────────────────────┘
```

**Specificații:**
- **Background**: #000000 cu pattern din rune subtil
- **Titlu**: Montserrat, 2.5rem, #ffffff
- **Subtitle**: Open Sans, 1.125rem, #a0a0a0
- **Height**: 120px (compact, elegant)

### **Grid de Articole**

#### **Layout Responsive**
- **Desktop**: 3-4 carduri pe rând
- **Tablet**: 2 carduri pe rând  
- **Mobile**: 1 card pe rând

#### **Card Design**
```
┌─────────────────────────────────────────────────────────┐
│ [Imagine 16:9]                                         │
│                                                         │
│ Titlu Articol (Montserrat, 1.25rem, #ffffff)          │
│                                                         │
│ Excerpt: 2-3 rânduri de text descriptiv...             │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Domain • Vector • Author • 5 min read              │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Specificații Card:**
- **Background**: #1a1a1a
- **Border**: 1px solid #5a5a5a
- **Padding**: 24px
- **Hover**: Glow auriu discret (#d1a954, 0.3 opacity)
- **Image**: Aspect 16:9, object-fit: cover
- **Meta**: #808080, Open Sans, 0.875rem

### **Filtrare & Căutare**

#### **Sidebar (Desktop) / Dropdown (Mobile)**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Search Articles                                     │
│ [Search box cu icon Phosphor]                          │
│                                                         │
│ 📊 Filter by Vector                                    │
│ ○ V1 Strategic                                         │
│ ○ V2 Rhetoric                                          │
│ ○ V3 Content                                           │
│ ○ V4 Cognitive                                         │
│ ○ V5 Memetic                                           │
│ ○ V6 Data                                              │
│ ○ V7 Crisis                                            │
│                                                         │
│ 🏭 Filter by Domain                                    │
│ ○ FinTech                                              │
│ ○ SaaS                                                 │
│ ○ E-commerce                                           │
│ ○ Consulting                                           │
│ [Show more...]                                         │
└─────────────────────────────────────────────────────────┘
```

**Specificații Filtre:**
- **Background**: #0e0e0e
- **Border**: 1px solid #404040
- **Padding**: 20px
- **Checkboxes**: Gold accent (#d1a954)
- **Labels**: #a0a0a0, Open Sans

### **Articole Recomandate**
```
┌─────────────────────────────────────────────────────────┐
│ 📚 Recommended Articles                                 │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Mini-thumbnail]                                   │ │
│ │ Titlu Articol Recomandat                           │ │
│ │ Domain • 3 min read                                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Mini-thumbnail]                                   │ │
│ │ Alt Articol Recomandat                             │ │
│ │ Domain • 7 min read                                │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **CTA Final**
```
┌─────────────────────────────────────────────────────────┐
│ 🚀 Ready to Transform Your Prompts?                   │
│                                                         │
│ Get weekly insights on prompt engineering,              │
│ module strategies, and AI optimization.                 │
│                                                         │
│ [Subscribe to Newsletter] [Try Generator]              │
└─────────────────────────────────────────────────────────┘
```

**Specificații CTA:**
- **Background**: #1a1a1a
- **Border**: 2px solid #d1a954
- **Text**: #ffffff, Open Sans
- **Buttons**: Gold (#d1a954) cu text #000000

---

## 📄 **STRUCTURA /BLOG/{SLUG} (PAGINĂ ARTICOL)**

### **Hero & Meta**

#### **Titlu & Subtitlu**
```
┌─────────────────────────────────────────────────────────┐
│ Cum Funcționează Test Engine-ul                        │
│ PromptForge™ v3                                        │
│                                                         │
│ Evaluare automată cu rubrici 7D și feedback            │
│ contextual pentru optimizarea prompturilor             │
└─────────────────────────────────────────────────────────┘
```

**Specificații:**
- **Titlu**: Montserrat, 3rem+, #ffffff
- **Accent Gold**: Cuvinte-cheie (#d1a954)
- **Subtitlu**: Open Sans, 1.25rem, #a0a0a0
- **Container**: max-width: 65ch, margin: 0 auto

#### **Meta Bar**
```
┌─────────────────────────────────────────────────────────┐
│ 👤 By John Doe • 📅 Jan 15, 2025 • ⏱️ 8 min read     │
│ 🏷️ Vectors: V4 Cognitive, V6 Data                     │
│ 🏭 Domain: FinTech, SaaS                               │
└─────────────────────────────────────────────────────────┘
```

**Specificații Meta:**
- **Background**: #0e0e0e
- **Border**: 1px solid #404040
- **Padding**: 16px
- **Text**: #a0a0a0, Open Sans, 0.875rem
- **Icons**: Phosphor icons, #808080

### **Rezumat & Table of Contents**

#### **TL;DR Section**
```
┌─────────────────────────────────────────────────────────┐
│ 📋 TL;DR                                               │
│                                                         │
│ Test Engine-ul PromptForge™ evaluează prompturile     │
│ pe 4 axe: claritate, execuție, ambiguitate și         │
│ business fit. Scorul minim pentru export este 80.      │
│ Sub 80, sistemul rulează auto-fix "tighten-once".     │
└─────────────────────────────────────────────────────────┘
```

**Specificații TL;DR:**
- **Background**: #1a1a1a
- **Border**: 3px solid #d1a954 (stânga)
- **Padding**: 20px
- **Text**: #ffffff, Open Sans, 1rem

#### **Table of Contents**
```
┌─────────────────────────────────────────────────────────┐
│ 📑 Table of Contents                                   │
│                                                         │
│ 1. [Introducere](#introducere)                         │
│ 2. [Arhitectura Test Engine](#arhitectura)             │
│ 3. [Rubrici de Evaluare](#rubrici)                     │
│ 4. [Procesul de Scoring](#scoring)                     │
│ 5. [Auto-fix Tighten-once](#auto-fix)                  │
│ 6. [Integrare cu Export](#export)                      │
│ 7. [Concluzii](#concluzii)                             │
└─────────────────────────────────────────────────────────┘
```

**Specificații ToC:**
- **Background**: #0e0e0e
- **Border**: 1px solid #404040
- **Padding**: 20px
- **Links**: #d1a954 (hover: #e6c200)
- **Active Section**: #ffffff, bold

### **Corp Articol**

#### **Container Principal**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ ## Introducere                                          │
│                                                         │
│ Test Engine-ul PromptForge™ reprezintă componenta     │
│ centrală pentru evaluarea calității prompturilor...    │
│                                                         │
│ [Imagine: Diagram Test Engine]                         │
│                                                         │
│ ## Arhitectura Test Engine                             │
│                                                         │
│ Sistemul funcționează pe baza a 4 rubrici principale: │
│                                                         │
│ • **Claritate** (0-25): Respectă brief + 7D            │
│ • **Execuție** (0-25): Output conform specificații    │
│ • **Ambiguitate** (0-25): Decizie maximă               │
│ • **Business Fit** (0-25): Utilitate comercială        │
│                                                         │
│ [Callout Box: Exemplu Scoring]                         │
│                                                         │
│ ## Rubrici de Evaluare                                 │
│                                                         │
│ ### 1. Claritate                                       │
│                                                         │
│ Rubrica de claritate evaluează...                      │
│                                                         │
│ [Code Block: Formula Claritate]                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specificații Corp:**
- **Container**: max-width: 65ch, margin: 0 auto
- **Padding**: 0 20px
- **Line Length**: 50-75 caractere
- **Spacing**: 1.5rem între secțiuni, 1rem între paragrafe

#### **Heading-uri**
- **H2**: Montserrat, 2rem, #ffffff, margin-top: 3rem
- **H3**: Montserrat, 1.5rem, #ffffff, margin-top: 2rem
- **H4**: Montserrat, 1.25rem, #a0a0a0, margin-top: 1.5rem

#### **Paragrafe**
- **Text**: Open Sans, 1rem, #ffffff, line-height: 1.6
- **Lungime**: Maxim 3-4 fraze per paragraf
- **Spacing**: 1rem între paragrafe

#### **Liste**
- **Bullet Points**: #d1a954, 6px diameter
- **Text**: #ffffff, Open Sans, 1rem
- **Spacing**: 0.5rem între items

### **Elemente Vizuale**

#### **Imagini**
```
┌─────────────────────────────────────────────────────────┐
│ [Imagine: Diagram Test Engine]                         │
│                                                         │
│ Fig. 1: Arhitectura Test Engine cu rubrici 7D         │
│ și procesul de evaluare automată                       │
└─────────────────────────────────────────────────────────┘
```

**Specificații Imagini:**
- **Width**: 100% din container (max 65ch)
- **Border**: 1px solid #404040
- **Caption**: #a0a0a0, Open Sans, 0.875rem, italic
- **Alt Text**: Complet și descriptiv pentru accesibilitate

#### **Callout Boxes**
```
┌─────────────────────────────────────────────────────────┐
│ 💡 Pro Tip                                              │
│                                                         │
│ Pentru scoruri sub 80, folosește auto-fix-ul          │
│ "tighten-once" înainte de a face modificări manuale.   │
│ Acest proces poate îmbunătăți scorul cu 10-15 puncte. │
└─────────────────────────────────────────────────────────┘
```

**Specificații Callout:**
- **Background**: #1a1a1a cu 0.8 opacity
- **Border**: 2px solid #d1a954
- **Icon**: Phosphor icon, #d1a954
- **Text**: #ffffff, Open Sans, 1rem

#### **Code Blocks**
```
┌─────────────────────────────────────────────────────────┐
│ ```typescript                                           │
│ function scoreClarity(ctx: Ctx): number {              │
│   const sevenDMatch = calculate7DMatch(ctx);           │
│   const briefCoverage = calculateBriefCoverage(ctx);   │
│   const clarityStyle = calculateClarityStyle(ctx);     │
│                                                         │
│   return clamp(sevenDMatch + briefCoverage +           │
│     clarityStyle, 0, 25);                              │
│ }                                                       │
│ ``` [Copy]                                              │
└─────────────────────────────────────────────────────────┘
```

**Specificații Code:**
- **Background**: #1a1a1a
- **Border**: 1px solid #404040
- **Text**: #ffffff, monospace font
- **Syntax Highlighting**: Gold pentru keywords
- **Copy Button**: #d1a954, hover: #e6c200

### **Elemente Auxiliare**

#### **Author Box**
```
┌─────────────────────────────────────────────────────────┐
│ 👤 About the Author                                     │
│                                                         │
│ [Avatar 80x80] John Doe                                │
│                                                         │
│ John Doe este Lead Prompt Engineer la PromptForge™,    │
│ cu 8+ ani de experiență în AI și prompt engineering.   │
│ Specializat în optimizarea prompturilor pentru         │
│ aplicații enterprise.                                   │
│                                                         │
│ [LinkedIn] [Twitter] [Website]                         │
└─────────────────────────────────────────────────────────┘
```

**Specificații Author Box:**
- **Background**: #0e0e0e
- **Border**: 1px solid #404040
- **Padding**: 24px
- **Avatar**: 80x80px, border-radius: 50%
- **Social Links**: #d1a954, hover: #e6c200

#### **Related Posts**
```
┌─────────────────────────────────────────────────────────┐
│ 📚 Related Articles                                     │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Thumbnail 120x80]                                 │ │
│ │ Cum Optimizezi Parametrii 7D                       │
│ │ V4 Cognitive • 6 min read                          │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Thumbnail 120x80]                                 │ │
│ │ Export Bundle cu Checksum                           │
│ │ V6 Data • 5 min read                               │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Thumbnail 120x80]                                 │ │
│ │ Entitlements și Gating UI                          │
│ │ V1 Strategic • 7 min read                          │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Specificații Related:**
- **Container**: #0e0e0e, border: 1px solid #404040
- **Cards**: #1a1a1a, hover: glow auriu discret
- **Thumbnails**: 120x80px, object-fit: cover
- **Text**: #ffffff pentru titlu, #a0a0a0 pentru meta

#### **Newsletter CTA**
```
┌─────────────────────────────────────────────────────────┐
│ 🚀 Transformă-ți Prompturile cu PromptForge™          │
│                                                         │
│ Primește insights săptămânale despre prompt            │
│ engineering, strategii de module și optimizare AI.      │
│                                                         │
│ [Subscribe to Newsletter] [Try Generator Now]          │
└─────────────────────────────────────────────────────────┘
```

**Specificații Newsletter:**
- **Background**: #d1a954
- **Text**: #000000, Open Sans, bold
- **Buttons**: #000000 cu border #000000, hover: #ffffff
- **Padding**: 32px

### **Navigare Secundară**

#### **Breadcrumb**
```
┌─────────────────────────────────────────────────────────┐
│ Home → Blog → Cum Funcționează Test Engine-ul          │
└─────────────────────────────────────────────────────────┘
```

**Specificații Breadcrumb:**
- **Text**: #808080, Open Sans, 0.875rem
- **Separator**: #5a5a5a
- **Active**: #ffffff
- **Hover**: #d1a954

#### **Navigation Buttons**
```
┌─────────────────────────────────────────────────────────┐
│ [← Previous: Optimizare 7D] [Next: Export Bundle →]   │
│                                                         │
│ [← Back to Blog]                                       │
└─────────────────────────────────────────────────────────┘
```

**Specificații Navigation:**
- **Background**: Transparent
- **Border**: 1px solid #5a5a5a
- **Text**: #a0a0a0, hover: #d1a954
- **Active**: #d1a954

---

## 🔧 **ASPECTE TEHNICE & SEO**

### **URL Structure**
```
/blog
/blog/cum-functioneaza-test-engine
/blog/optimizare-parametri-7d
/blog/export-bundle-checksum
```

**Specificații URL:**
- **Slug**: Descriptive, fără date redundante
- **Length**: Maxim 60 caractere
- **Format**: kebab-case
- **SEO-friendly**: Include cuvinte-cheie relevante

### **Schema.org Markup**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cum Funcționează Test Engine-ul PromptForge™ v3",
  "description": "Evaluare automată cu rubrici 7D și feedback contextual",
  "image": "https://promptforge.app/blog/test-engine-diagram.jpg",
  "author": {
    "@type": "Person",
    "name": "John Doe",
    "url": "https://promptforge.app/team/john-doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PromptForge™",
    "logo": {
      "@type": "ImageObject",
      "url": "https://promptforge.app/logo.png"
    }
  },
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T10:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://promptforge.app/blog/cum-functioneaza-test-engine"
  },
  "wordCount": 2500,
  "timeRequired": "PT8M"
}
```

### **Performance Optimization**

#### **Lazy Loading**
```typescript
// Lazy load images
const LazyImage = ({ src, alt, caption }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="image-container">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'loaded' : 'loading'}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </div>
  );
};
```

#### **Image Optimization**
- **Format**: WebP cu fallback JPEG
- **Compression**: 80% quality pentru blog
- **Dimensions**: Responsive cu srcset
- **Lazy Loading**: Intersection Observer API

### **Mobile-First Responsiveness**

#### **Breakpoints**
```css
/* Mobile First */
.blog-container {
  max-width: 100%;
  padding: 0 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .blog-container {
    max-width: 65ch;
    padding: 0 20px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .blog-container {
    max-width: 65ch;
    padding: 0;
    margin: 0 auto;
  }
}
```

#### **Mobile Adaptations**
- **ToC**: Collapsible în sidebar
- **Meta Bar**: Stacked layout
- **Images**: Full width pe mobile
- **Navigation**: Touch-friendly butoane

### **Accessibility Features**

#### **ARIA Labels**
```typescript
// Accessible navigation
<nav aria-label="Blog navigation">
  <button 
    aria-label="Previous article: Optimizare 7D"
    onClick={goToPrevious}
  >
    ← Previous
  </button>
</nav>
```

#### **Keyboard Navigation**
- **Tab Order**: Logical flow
- **Focus Indicators**: Gold accent (#d1a954)
- **Skip Links**: Pentru screen readers
- **Shortcuts**: Ctrl+F pentru search

#### **Screen Reader Support**
- **Alt Text**: Complet și descriptiv
- **Semantic HTML**: Proper heading hierarchy
- **Landmarks**: Main, article, section, nav
- **Live Regions**: Pentru dynamic content

---

## 📱 **COMPONENTE REACT IMPLEMENTABILE**

### **BlogCard Component**
```typescript
interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  domain: string;
  vectors: string[];
  author: string;
  readTime: number;
  publishDate: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  excerpt,
  coverImage,
  domain,
  vectors,
  author,
  readTime,
  publishDate
}) => {
  return (
    <article className="blog-card">
      <Link href={`/blog/${slug}`}>
        <div className="card-image">
          <Image
            src={coverImage}
            alt={title}
            width={400}
            height={225}
            className="cover-image"
          />
        </div>
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-excerpt">{excerpt}</p>
          <div className="card-meta">
            <span className="domain">{domain}</span>
            <span className="vectors">{vectors.join(' • ')}</span>
            <span className="author">{author}</span>
            <span className="read-time">{readTime} min read</span>
          </div>
        </div>
      </Link>
    </article>
  );
};
```

### **BlogFilter Component**
```typescript
interface BlogFilterProps {
  vectors: string[];
  domains: string[];
  onFilterChange: (filters: FilterState) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BlogFilter: React.FC<BlogFilterProps> = ({
  vectors,
  domains,
  onFilterChange,
  searchQuery,
  onSearchChange
}) => {
  return (
    <aside className="blog-filter">
      <div className="search-box">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="filter-section">
        <h4>Filter by Vector</h4>
        {vectors.map(vector => (
          <label key={vector} className="filter-option">
            <input
              type="checkbox"
              onChange={(e) => handleVectorFilter(vector, e.target.checked)}
            />
            <span>{vector}</span>
          </label>
        ))}
      </div>
      
      <div className="filter-section">
        <h4>Filter by Domain</h4>
        {domains.map(domain => (
          <label key={domain} className="filter-option">
            <input
              type="checkbox"
              onChange={(e) => handleDomainFilter(domain, e.target.checked)}
            />
            <span>{domain}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};
```

### **TableOfContents Component**
```typescript
interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeSection: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeSection
}) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="table-of-contents">
      <h4>Table of Contents</h4>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={`toc-item level-${item.level} ${
              activeSection === item.id ? 'active' : ''
            }`}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className="toc-link"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

---

## 🎯 **IMPLEMENTARE ÎN 4 FAZE**

### **Faza 1: Foundation (Săptămâna 1-2)**
1. **Blog Layout**: Componente de bază (BlogCard, BlogFilter)
2. **Routing**: /blog și /blog/[slug] cu Next.js App Router
3. **Styling**: SKRE palette integration cu Tailwind
4. **Responsive**: Mobile-first approach

### **Faza 2: Content Management (Săptămâna 3-4)**
1. **MDX Integration**: Markdown cu React components
2. **Image Handling**: Optimizare și lazy loading
3. **Meta Data**: Schema.org și SEO optimization
4. **Search**: Filtrare și căutare funcțională

### **Faza 3: Enhanced Features (Săptămâna 5-6)**
1. **Table of Contents**: Cu scroll tracking
2. **Related Posts**: Algoritm de recomandare
3. **Author System**: Profile și social links
4. **Newsletter Integration**: CTA-uri și forms

### **Faza 4: Polish & Performance (Săptămâna 7-8)**
1. **Accessibility**: ARIA labels și keyboard nav
2. **Performance**: Lighthouse optimization
3. **Analytics**: Tracking și insights
4. **Testing**: Cross-browser și mobile testing

---

## 📊 **METRICI DE SUCCES**

### **User Experience**
- **Bounce Rate**: < 40%
- **Time on Page**: > 3 minute
- **Scroll Depth**: > 70%
- **Mobile Performance**: > 90 Lighthouse

### **SEO Performance**
- **Core Web Vitals**: Green
- **Page Speed**: < 2s
- **Mobile Usability**: 100%
- **Accessibility Score**: > 95

### **Content Engagement**
- **Social Shares**: > 100 per articol
- **Comments**: > 20 per articol
- **Newsletter Signups**: > 50 per articol
- **Generator Clicks**: > 30% din cititori

---

*Aceste specificații integrează complet sistemul SKRE din rulebook-ul oficial cu cele mai bune practici de blog design, creând un spațiu elegant și ușor de citit care respectă identitatea PromptForge™ v3.*
