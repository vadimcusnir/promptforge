# 🚀 Agent.ts - Exemple de Utilizare Rapidă

## 📋 **Funcționalități Principale**

### **1. Verificare Module Access**
```typescript
import { canAccessModule, getAvailableModules } from '@/agent';

// Verifică dacă planul poate accesa un modul
const canAccess = canAccessModule('pilot', 'M01'); // true
const canAccess = canAccessModule('pilot', 'M50'); // false

// Obține toate modulele disponibile pentru un plan
const modules = getAvailableModules('pilot'); // ['M01', 'M02', 'M11', 'M12', 'M21', 'M22']
const allModules = getAvailableModules('enterprise'); // ['M01', 'M02', ..., 'M50']
```

### **2. Verificare Export Capabilities**
```typescript
import { canExport } from '@/agent';

// Verifică ce formate poate exporta planul
const canExportPDF = canExport('pilot', 'pdf');     // false
const canExportPDF = canExport('pro', 'pdf');       // true
const canExportBundle = canExport('pro', 'bundle'); // false
const canExportBundle = canExport('enterprise', 'bundle'); // true
```

### **3. Execuție Prompt (Simulate/Live)**
```typescript
import { runAgent } from '@/agent';

const result = await runAgent({
  userId: "user123",
  orgId: "org456",
  plan: "pro",
  moduleId: "M01",
  params7d: {
    domain: "business",
    scale: "team",
    urgency: "medium",
    complexity: "basic",
    resources: "standard",
    application: "process",
    output: "sop"
  },
  prompt: "Generate SOP for customer onboarding",
  intent: "live" // sau "simulate"
});

console.log(result.status);        // "success" | "degraded" | "failed"
console.log(result.output);        // prompt-ul generat
console.log(result.tokens);        // numărul de tokens
console.log(result.duration_ms);   // timpul de execuție
console.log(result.cost_cents);    // costul în cenți
```

## 🔌 **În API Routes**

### **Route Simplu:**
```typescript
// app/api/run/[moduleId]/route.ts
import { runAgent, canAccessModule } from "@/agent";

export async function POST(req: Request, { params }: { params: { moduleId: string } }) {
  const body = await req.json();
  const { plan, params7d, prompt, intent } = body;

  // 1. Verifică access
  if (!canAccessModule(plan, params.moduleId)) {
    return Response.json({ error: "Module not available" }, { status: 403 });
  }

  // 2. Execută
  const result = await runAgent({
    userId: "user123",
    orgId: "org456",
    plan,
    moduleId: params.moduleId,
    params7d,
    prompt,
    intent: intent || "simulate"
  });

  return Response.json({ success: true, result });
}
```

## �� **În UI Components**

### **Hook pentru Agent:**
```typescript
// hooks/useAgent.ts
import { useAgent } from '@/hooks/useAgent';

function GeneratorComponent() {
  const { 
    canAccess, 
    exportCapabilities, 
    isRunning, 
    result, 
    runSimulation, 
    runLive 
  } = useAgent({
    plan: "pro",
    moduleId: "M01",
    params7d: { /* ... */ }
  });

  return (
    <div>
      <Button onClick={runSimulation} disabled={!canAccess}>
        Simulate Test
      </Button>
      
      <Button onClick={runLive} disabled={!canAccess}>
        Run Live
      </Button>

      {result && (
        <div>
          <p>Status: {result.status}</p>
          <p>Output: {result.output}</p>
        </div>
      )}
    </div>
  );
}
```

### **Export cu Score Gate:**
```typescript
// components/ExportWithScoreGate.tsx
import { ExportWithScoreGate } from '@/components/ExportWithScoreGate';

function ExportComponent() {
  return (
    <ExportWithScoreGate
      plan="pro"
      promptScore={75} // < 80 = export blocked
      moduleId="M01"
      onExport={(format) => console.log(`Exporting ${format}`)}
    />
  );
}
```

## 🚫 **Score Gate Logic**

### **Export Blocked dacă Score < 80:**
- ✅ Score 80-100: Export permis
- ❌ Score 0-79: Export blocat
- 🔒 Mesaj: "Score too low. You need at least 80/100 to export."

### **Plan Restrictions:**
- **Pilot**: txt, md (6 module)
- **Pro**: txt, md, json, pdf (toate modulele + live test)
- **Enterprise**: txt, md, json, pdf, bundle (toate + API access)

## 🔧 **Configurare Rapidă**

### **1. Environment Variables:**
```bash
# .env.local
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### **2. Kill Switch:**
```bash
# Pentru a opri live testing
KILL_LIVE_GPT=true
```

### **3. Rate Limits:**
```typescript
// În agent.ts
rate_limit: {
  editor: { rpm: 60, per_org: false },
  test: { rpm: 30, per_org: false },
  run: { rpm: 30, per_org: true },
  export: { rpm: 20, per_org: true },
}
```

## 📊 **Telemetry & Monitoring**

### **Hook-uri Disponibile:**
```typescript
import { registerTelemetry } from '@/agent';

registerTelemetry({
  onStart: (input, runId) => {
    console.log('Starting run:', runId);
    // Log to Supabase, analytics, etc.
  },
  onComplete: (result) => {
    console.log('Run completed:', result.run_id);
    // Update metrics, send alerts, etc.
  }
});
```

## 🚀 **Următorii Pași**

1. **Testează Modulele**: Rulează `pnpm migrate` pentru a crea baza de date
2. **Integrează cu UI**: Folosește `useAgent` hook în componentele tale
3. **Implementează Export**: Folosește `ExportWithScoreGate` pentru export logic
4. **Adaugă Telemetry**: Conectează la Supabase pentru tracking

---

**Agent.ts este gata pentru producție! 🎉**
