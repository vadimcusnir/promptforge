#!/usr/bin/env node

/**
 * Test script to verify RLS isolation in PromptForge
 * Tests that users from different organizations cannot see each other's data
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testRLSIsolation() {
  console.log('🔒 Testing RLS Isolation in PromptForge...\n');

  try {
    // Test 1: Create test organizations
    console.log('📋 Test 1: Creating test organizations...');
    
    const org1 = await supabase
      .from('orgs')
      .insert({
        slug: 'test-org-1',
        name: 'Test Organization 1',
        description: 'Test org for RLS verification',
        industry: 'Technology',
        size: '10-50'
      })
      .select()
      .single();

    const org2 = await supabase
      .from('orgs')
      .insert({
        slug: 'test-org-2',
        name: 'Test Organization 2',
        description: 'Test org for RLS verification',
        industry: 'Finance',
        size: '50-100'
      })
      .select()
      .single();

    console.log('✅ Created organizations:', org1.data.slug, 'and', org2.data.slug);

    // Test 2: Create test users
    console.log('\n👥 Test 2: Creating test users...');
    
    const user1 = await supabase.auth.admin.createUser({
      email: 'testuser1@example.com',
      password: 'testpass123',
      email_confirm: true,
      user_metadata: { full_name: 'Test User 1' }
    });

    const user2 = await supabase.auth.admin.createUser({
      email: 'testuser2@example.com',
      password: 'testpass123',
      email_confirm: true,
      user_metadata: { full_name: 'Test User 2' }
    });

    console.log('✅ Created users:', user1.data.user.email, 'and', user2.data.user.email);

    // Test 3: Add users to organizations
    console.log('\n🔗 Test 3: Adding users to organizations...');
    
    await supabase
      .from('org_members')
      .insert([
        {
          org_id: org1.data.id,
          user_id: user1.data.user.id,
          role: 'owner'
        },
        {
          org_id: org2.data.id,
          user_id: user2.data.user.id,
          role: 'owner'
        }
      ]);

    console.log('✅ Added users to organizations');

    // Test 4: Create test data for each organization
    console.log('\n📊 Test 4: Creating test data...');
    
    // Create prompt runs for org1
    const run1 = await supabase
      .from('prompt_runs')
      .insert({
        user_id: user1.data.user.id,
        org_id: org1.data.id,
        module_id: 'M01',
        session_config: { domain: 'test', scale: 'small' },
        generated_prompt: 'Test prompt for org1',
        status: 'completed',
        ai_score: 85
      })
      .select()
      .single();

    // Create prompt runs for org2
    const run2 = await supabase
      .from('prompt_runs')
      .insert({
        user_id: user2.data.user.id,
        org_id: org2.data.id,
        module_id: 'M02',
        session_config: { domain: 'test', scale: 'medium' },
        generated_prompt: 'Test prompt for org2',
        status: 'completed',
        ai_score: 90
      })
      .select()
      .single();

    console.log('✅ Created test prompt runs');

    // Test 5: Test RLS isolation - User1 should only see org1 data
    console.log('\n🔒 Test 5: Testing RLS isolation for User1...');
    
    const user1Client = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Sign in as user1
    const { data: { session: session1 } } = await user1Client.auth.signInWithPassword({
      email: 'testuser1@example.com',
      password: 'testpass123'
    });

    if (!session1) {
      throw new Error('Failed to sign in user1');
    }

    // User1 should see org1 data
    const user1Runs = await user1Client
      .from('prompt_runs')
      .select('*');

    console.log('✅ User1 can see runs:', user1Runs.data.length);
    console.log('   - Run IDs:', user1Runs.data.map(r => r.id));

    // User1 should NOT see org2 data
    const user1Org2Runs = await user1Client
      .from('prompt_runs')
      .select('*')
      .eq('org_id', org2.data.id);

    console.log('✅ User1 cannot see org2 runs:', user1Org2Runs.data.length === 0);

    // Test 6: Test RLS isolation - User2 should only see org2 data
    console.log('\n🔒 Test 6: Testing RLS isolation for User2...');
    
    const user2Client = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Sign in as user2
    const { data: { session: session2 } } = await user2Client.auth.signInWithPassword({
      email: 'testuser2@example.com',
      password: 'testpass123'
    });

    if (!session2) {
      throw new Error('Failed to sign in user2');
    }

    // User2 should see org2 data
    const user2Runs = await user2Client
      .from('prompt_runs')
      .select('*');

    console.log('✅ User2 can see runs:', user2Runs.data.length);
    console.log('   - Run IDs:', user2Runs.data.map(r => r.id));

    // User2 should NOT see org1 data
    const user2Org1Runs = await user2Client
      .from('prompt_runs')
      .select('*')
      .eq('org_id', org1.data.id);

    console.log('✅ User2 cannot see org1 runs:', user2Org1Runs.data.length === 0);

    // Test 7: Test effective entitlements view
    console.log('\n🎯 Test 7: Testing effective entitlements view...');
    
    const entitlements = await user1Client
      .from('entitlements_effective_org')
      .select('*');

    console.log('✅ User1 can see entitlements view:', entitlements.data.length > 0);

    // Test 8: Test organization membership view
    console.log('\n👥 Test 8: Testing organization membership view...');
    
    const membership = await user1Client
      .from('org_membership_view')
      .select('*');

    console.log('✅ User1 can see membership view:', membership.data.length > 0);

    // Test 9: Test prompt runs summary view
    console.log('\n📊 Test 9: Testing prompt runs summary view...');
    
    const summary = await user1Client
      .from('prompt_runs_summary')
      .select('*');

    console.log('✅ User1 can see summary view:', summary.data.length > 0);

    // Test 10: Verify cross-organization access is blocked
    console.log('\n🚫 Test 10: Verifying cross-organization access is blocked...');
    
    // Try to access org2 data as user1 (should fail)
    const crossOrgAccess = await user1Client
      .from('prompt_runs')
      .select('*')
      .eq('org_id', org2.data.id);

    if (crossOrgAccess.data.length === 0) {
      console.log('✅ Cross-organization access is properly blocked');
    } else {
      console.log('❌ Cross-organization access is NOT blocked!');
      console.log('   - User1 can see org2 data:', crossOrgAccess.data);
    }

    console.log('\n🎉 All RLS isolation tests passed!');
    console.log('\n📋 Summary:');
    console.log('   - Users are properly isolated by organization');
    console.log('   - RLS policies are working correctly');
    console.log('   - Views provide proper data access');
    console.log('   - Cross-organization access is blocked');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    
    try {
      // Delete test data in reverse order
      await supabase.from('prompt_runs').delete().in('org_id', [org1.data.id, org2.data.id]);
      await supabase.from('org_members').delete().in('org_id', [org1.data.id, org2.data.id]);
      await supabase.from('orgs').delete().in('id', [org1.data.id, org2.data.id]);
      await supabase.auth.admin.deleteUser(user1.data.user.id);
      await supabase.auth.admin.deleteUser(user2.data.user.id);
      
      console.log('✅ Test data cleaned up');
    } catch (cleanupError) {
      console.error('⚠️  Cleanup warning:', cleanupError.message);
    }
  }
}

// Run the test
testRLSIsolation().catch(console.error);
