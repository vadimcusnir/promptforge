# Voice & Branding Guidelines

## 🎯 Overview

PromptForge maintains a consistent **operational tone** across all UI elements, emphasizing professionalism, precision, and industrial-grade reliability.

## 🚫 Forbidden Words

### Never Use These Terms:
- **Easy/Simple** → Use: "Basic", "Standard", "Essential"
- **Magic/Instant** → Use: "Efficient", "Optimized", "Streamlined"
- **Quick/Fast** → Use: "Efficient", "Optimized", "Responsive"
- **Effortless** → Use: "Streamlined", "Optimized"
- **One-click** → Use: "Direct", "Streamlined"
- **Automagic** → Use: "Automated", "Intelligent"
- **Wizard** → Use: "Guide", "Assistant"

### Examples:
```tsx
// ❌ Wrong
"Get started in minutes with our simple wizard"

// ✅ Correct  
"Get started efficiently with our guided setup"
```

## 📝 Content Structure

### H1 Tags
- **One H1 per page only**
- Use for main page purpose
- Keep operational and specific

```tsx
// ✅ Correct
<h1>Industrial Prompt Engineering Platform</h1>

// ❌ Wrong (multiple H1s)
<h1>Welcome</h1>
<h1>Get Started</h1>
```

### H2 Tags
- Use for major sections
- Maintain operational tone
- Be specific about functionality

```tsx
// ✅ Correct
<h2>Configure 7D Parameters</h2>
<h2>Export Professional Bundle</h2>

// ❌ Wrong
<h2>Easy Setup</h2>
<h2>Magic Results</h2>
```

## 🎨 Visual Design

### Font Tokens
Use these font classes consistently:

```tsx
// Headings
className="font-montserrat"  // Main headings
className="font-serif"       // Section titles
className="font-open-sans"   // Body text

// Examples
<h1 className="font-montserrat text-4xl font-bold">
<h2 className="font-serif text-2xl font-bold">
<p className="font-open-sans text-base">
```

### Glass/Glow Effects
**Minimize** glass and glow effects for better performance:

```tsx
// ❌ Avoid excessive use
className="glass-card backdrop-blur-lg shadow-2xl animate-pulse"

// ✅ Prefer simple, clean styling
className="bg-zinc-900/80 border border-zinc-700"
```

**Maximum allowed**: 5 glass/glow tokens per file

## 🔖 Badge Usage

### Vector Badges
- **Maximum 2 vector badges per screen**
- Use semantic colors from the 7-vector system
- Keep badges small and informative

```tsx
// ✅ Correct
<Badge className="text-blue-400">V2 Marketing</Badge>
<Badge className="text-green-400">V3 Content</Badge>

// ❌ Wrong (too many)
<Badge>V1</Badge>
<Badge>V2</Badge>
<Badge>V3</Badge>
<Badge>V4</Badge>
```

### Functional Badges
- Use for status, categories, entitlements
- Keep consistent with brand colors
- Avoid excessive decoration

## 🧪 Testing & Validation

### Development Check
```bash
npm run check:voice-branding
```

### Build-time Check
```bash
npm run check:voice-branding:build
```

### Automated Build Integration
The build process automatically checks Voice & Branding:
```bash
npm run build  # Runs Voice & Branding check first
```

## 📋 Checklist

Before committing code, ensure:

- [ ] Single H1 per page
- [ ] No forbidden words (easy, magic, quick, etc.)
- [ ] Maximum 2 vector badges per screen
- [ ] Consistent font usage (Montserrat/Open Sans)
- [ ] Glass/glow tokens ≤ 5 per file
- [ ] Operational tone maintained
- [ ] Professional language throughout

## 🎯 Tone Examples

### ✅ Good (Operational)
- "Configure operational parameters"
- "Execute module with precision"
- "Export structured outputs"
- "Validate system requirements"
- "Optimize performance metrics"

### ❌ Bad (Casual/Magical)
- "Easy setup wizard"
- "Magic results instantly"
- "Quick and simple"
- "One-click solution"
- "Effortless automation"

## 🔧 Quick Fixes

### Replace Common Forbidden Words:
```bash
# Find and replace in your codebase
"easy" → "efficient"
"simple" → "basic" 
"magic" → "intelligent"
"quick" → "streamlined"
"fast" → "optimized"
"instant" → "responsive"
```

### Fix Multiple H1 Tags:
```tsx
// Change second H1 to H2
<h1>Main Page Title</h1>
<h2>Section Title</h2>  // Was H1
```

### Reduce Glass Effects:
```tsx
// Replace glass-card with simple styling
className="glass-card" 
// ↓
className="bg-zinc-900/80 border border-zinc-700"
```

## 📚 Resources

- **Voice Check Script**: `scripts/check-voice-branding.js`
- **Build Check**: `scripts/build-voice-check.js`
- **Package Scripts**: `npm run check:voice-branding`
- **This Guide**: `VOICE_BRANDING_GUIDELINES.md`

---

**Remember**: PromptForge is an **industrial-grade platform**, not a consumer app. Maintain professional, operational language that reflects the serious nature of enterprise prompt engineering.
