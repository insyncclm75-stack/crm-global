/**
 * One-time seed: 100 data points for In-Sync Demo Org
 * Run: node scripts/seed-demo-data.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ijwsnkuvytllytmmfkpp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd3Nua3V2eXRsbHl0bW1ma3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkwNzI5MiwiZXhwIjoyMDg5NDgzMjkyfQ.TlqBpSsWsCSEfO00bncv55dJGRcLIfpWwyye7HkLfeU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Data pools ────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Aarav','Aditya','Akash','Amit','Ananya','Anjali','Arjun','Aryan','Deepak',
  'Divya','Gaurav','Harshita','Ishaan','Karan','Kavya','Kunal','Manish','Meera',
  'Mohit','Nisha','Nitin','Pooja','Priya','Rahul','Raj','Rajesh','Riya','Rohit',
  'Sanjay','Sara','Shivani','Sneha','Sumit','Suresh','Tanvi','Varun','Vikram',
  'Vishal','Yash','Zara',
];
const LAST_NAMES = [
  'Agarwal','Bhatia','Chopra','Desai','Gupta','Iyer','Jain','Kapoor','Kumar',
  'Malhotra','Mehta','Mishra','Nair','Patel','Pillai','Rao','Reddy','Sharma',
  'Singh','Srivastava','Tiwari','Verma','Shah','Joshi','Saxena',
];
const COMPANIES = [
  'Infosys Ltd','TCS Technologies','Wipro Digital','HCL Systems','Tech Mahindra',
  'Reliance Industries','Tata Consultancy','Bajaj Finserv','Adani Enterprises',
  'Muthoot Finance','HDFC Securities','Kotak Ventures','ICICI Solutions',
  'Bharat Forge','Godrej Properties','Pidilite Industries','Asian Paints',
  'Havells India','Voltas Systems','Blue Star Ltd','Crompton Greaves',
  'Titan Company','Marico Consumer','Dabur India','Nestle India',
  'Hindustan Unilever','ITC Limited','Britannia Industries','Sun Pharma',
  'Dr Reddys Labs','Cipla Healthcare','Lupin Pharma','Torrent Pharma',
];
const JOB_TITLES = [
  'CEO','CTO','CFO','COO','VP Sales','VP Marketing','Director Operations',
  'General Manager','Senior Manager','Business Development Manager',
  'Sales Manager','Marketing Head','Operations Manager','Product Manager',
  'Account Manager','Procurement Manager','IT Manager','Finance Manager',
];
const SOURCES = ['website','referral','cold_call','linkedin','email_campaign','trade_show','partner','inbound'];
const INDUSTRIES = ['Technology','Manufacturing','Finance','Healthcare','Retail','FMCG','Real Estate','Pharma'];
const CITIES = ['Mumbai','Delhi','Bengaluru','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Surat'];
const ACTIVITY_SUBJECTS = {
  call: [
    'Initial discovery call','Follow-up call','Product demo call','Pricing discussion',
    'Technical requirements call','Decision maker call','Proposal walkthrough call',
    'Negotiation call','Contract discussion','Post-sale check-in',
  ],
  email: [
    'Sent product brochure','Shared case study','Sent pricing proposal','Follow-up on demo',
    'Sent contract draft','Shared ROI analysis','Sent onboarding guide',
  ],
  meeting: [
    'On-site product demo','Executive meeting','Technical evaluation','Proof of concept review',
    'Contract signing meeting','Kickoff meeting','Quarterly business review',
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPhone = () => {
  const p = ['98','99','97','96','95','94','93','92','91','90','88','87','86','85','84','83','82','81','80'];
  return `+91 ${pick(p)}${randInt(10000000, 99999999)}`;
};
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(randInt(8, 18), randInt(0, 59), 0, 0);
  return d.toISOString();
};

// Weighted: earlier stages get more contacts (realistic funnel)
function weightedStageIndex(count) {
  const weights = Array.from({ length: count }, (_, i) =>
    Math.max(1, count - i) * (count - i)
  );
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return count - 1;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function seed(count = 100) {
  // 1. Find demo org
  const { data: orgs, error: orgErr } = await supabase
    .from('organizations')
    .select('id, name')
    .ilike('name', '%in-sync%');

  if (orgErr) throw orgErr;
  const org = orgs?.find((o) => o.name?.toLowerCase().includes('demo')) ?? orgs?.[0];
  if (!org) throw new Error('Demo org not found (looking for name containing "in-sync")');

  console.log(`\n🏢 Org: ${org.name} (${org.id})`);

  // 2. Get pipeline stages
  const { data: stages, error: stagesErr } = await supabase
    .from('pipeline_stages')
    .select('id, name, stage_order')
    .eq('org_id', org.id)
    .eq('is_active', true)
    .order('stage_order');

  if (stagesErr) throw stagesErr;
  if (!stages?.length) throw new Error('No pipeline stages found. Configure stages first.');

  console.log(`📊 Stages: ${stages.map((s) => s.name).join(' → ')}`);

  // 3. Get users
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('org_id', org.id)
    .limit(20);

  if (profilesErr) throw profilesErr;
  if (!profiles?.length) throw new Error('No users found for this org.');

  const userIds = profiles.map((p) => p.id);
  console.log(`👤 Users: ${profiles.map((p) => p.first_name).join(', ')}`);

  // 4. Build contacts
  const contacts = Array.from({ length: count }, () => {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const stage = stages[weightedStageIndex(stages.length)];
    const createdDaysAgo = randInt(1, 120);
    const co = pick(COMPANIES);

    return {
      org_id: org.id,
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(10, 99)}@${co.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.com`,
      phone: randomPhone(),
      company: co,
      job_title: pick(JOB_TITLES),
      source: pick(SOURCES),
      status: 'active',
      pipeline_stage_id: stage.id,
      industry_type: pick(INDUSTRIES),
      city: pick(CITIES),
      created_by: pick(userIds),
      assigned_to: pick(userIds),
      created_at: daysAgo(createdDaysAgo),
      updated_at: daysAgo(randInt(0, createdDaysAgo)),
    };
  });

  // 5. Insert contacts
  const { data: inserted, error: cErr } = await supabase
    .from('contacts')
    .insert(contacts)
    .select('id');

  if (cErr) throw cErr;
  console.log(`\n✅ Inserted ${inserted.length} contacts`);

  // Stage distribution summary
  const stageCounts = {};
  contacts.forEach((c) => {
    const s = stages.find((s) => s.id === c.pipeline_stage_id);
    stageCounts[s.name] = (stageCounts[s.name] || 0) + 1;
  });
  console.log('   Distribution:');
  Object.entries(stageCounts).forEach(([s, n]) => console.log(`   • ${s}: ${n}`));

  // 6. Build activities
  const activityTypes = ['call', 'email', 'meeting'];
  const activities = inserted.flatMap((contact) => {
    const num = randInt(1, 3);
    return Array.from({ length: num }, () => {
      const type = pick(activityTypes);
      const daysBack = randInt(0, 90);
      return {
        org_id: org.id,
        contact_id: contact.id,
        activity_type: type,
        subject: pick(ACTIVITY_SUBJECTS[type]),
        call_duration: type === 'call' ? randInt(120, 1800) : null,
        duration_minutes: type === 'meeting' ? randInt(30, 90) : null,
        completed_at: daysAgo(daysBack),
        created_by: pick(userIds),
        created_at: daysAgo(daysBack),
      };
    });
  });

  const { error: aErr } = await supabase.from('contact_activities').insert(activities);
  if (aErr) throw aErr;
  console.log(`✅ Inserted ${activities.length} activities (calls/emails/meetings)`);

  // 7. Refresh materialized view
  await supabase.rpc('refresh_contacts_with_stages');
  console.log('✅ Refreshed contacts_with_stages view');
  console.log('\n🎉 Seed complete!');
}

const count = parseInt(process.argv[2] ?? '100', 10);
seed(count).catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
