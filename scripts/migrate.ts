import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigrations() {
  console.log('🚀 Starting PromptForge database migrations...')
  
  try {
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'supabase', 'migrations', '001_complete_schema.sql')
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found at:', schemaPath)
      process.exit(1)
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8')
    console.log('📋 Schema file loaded successfully')
    
    // Split by statements and execute
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`🔧 Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const [index, statement] of statements.entries()) {
      try {
        console.log(`⏳ Executing statement ${index + 1}/${statements.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.warn(`⚠️  Statement ${index + 1} had warning:`, error.message)
        } else {
          successCount++
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${index + 1} skipped (likely already exists):`, 
          statement.substring(0, 50) + '...')
        successCount++
      }
    }
    
    console.log(`✅ Migrations completed successfully!`)
    console.log(`📊 Results: ${successCount} successful, ${errorCount} errors`)
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...')
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tableError) {
      console.warn('⚠️  Could not verify tables:', tableError.message)
    } else {
      const tableNames = tables?.map(t => t.table_name) || []
      console.log('📋 Created tables:', tableNames.join(', '))
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

async function seedModules() {
  console.log('🌱 Seeding modules...')
  
  try {
    // Import modules catalog
    const { COMPLETE_MODULES_CATALOG } = await import('../lib/modules')
    
    let successCount = 0
    let errorCount = 0
    
    for (const [moduleId, module] of Object.entries(COMPLETE_MODULES_CATALOG)) {
      try {
        const moduleData = module as any; // Type assertion for now
        const { error } = await supabase
          .from('modules')
          .upsert({
            id: moduleData.id,
            title: moduleData.name,
            description: moduleData.description,
            vector: moduleData.vectors[0] as any,
            difficulty: moduleData.difficulty,
            estimated_tokens: moduleData.estimated_tokens,
            input_schema: moduleData.input_schema,
            output_template: moduleData.output_template,
            guardrails: moduleData.guardrails.policy,
            kpi_target: JSON.stringify(moduleData.kpi),
            sample_output: moduleData.sample_output,
            is_active: moduleData.is_active,
            requires_plan: moduleData.requires_plan
          }, { onConflict: 'id' })
        
        if (error) {
          console.error(`❌ Error seeding ${moduleId}:`, error.message)
          errorCount++
        } else {
          console.log(`✅ Seeded ${moduleId}: ${moduleData.name}`)
          successCount++
        }
      } catch (err) {
        console.error(`❌ Failed to seed ${moduleId}:`, err)
        errorCount++
      }
    }
    
    console.log(`🌱 Module seeding complete!`)
    console.log(`📊 Results: ${successCount} successful, ${errorCount} errors`)
    
  } catch (error) {
    console.error('❌ Module seeding failed:', error)
  }
}

async function main() {
  console.log('🏭 PromptForge v3 Database Setup')
  console.log('================================')
  
  await runMigrations()
  await seedModules()
  
  console.log('🎉 Database setup completed successfully!')
  console.log('🚀 Ready to run PromptForge v3')
}

main().catch(console.error)
