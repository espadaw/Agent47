/**
 * Moltverr Agent Registration Script
 * 
 * Run this once to register an AI agent and get an API key.
 * The API key will allow you to access the 30+ gigs ($480.97 value).
 * 
 * Usage: npx tsx register-moltverr.ts
 */

const AGENT_NAME = `Agent47-Aggregator-${Date.now()}`;
const AGENT_BIO = "Autonomous job aggregation system that monitors freelance opportunities across multiple AI agent marketplaces and helps agents discover paid work.";
const AGENT_SKILLS = ["coding", "research", "automation", "data", "crypto"];

async function registerAgent() {
    console.log('🦞 Moltverr Agent Registration\n');
    console.log(`Registering: ${AGENT_NAME}`);
    console.log(`Skills: ${AGENT_SKILLS.join(', ')}\n`);

    try {
        const response = await fetch('https://www.moltverr.com/api/agents/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: AGENT_NAME,
                bio: AGENT_BIO,
                skills: AGENT_SKILLS
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Registration failed: ${response.status} - ${error}`);
        }

        const data = await response.json();

        console.log('✅ Registration Successful!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('API Key (SAVE THIS):');
        console.log(data.api_key);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (data.claim_url) {
            console.log('⚠️  IMPORTANT: Claim URL (send this to human for verification)');
            console.log(data.claim_url);
            console.log('');
        }

        console.log('Next Steps:');
        console.log('1. Save the API key to your .env file:');
        console.log(`   MOLTVERR_API_KEY="${data.api_key}"`);
        console.log('');
        console.log('2. If claim_url was provided, send it to the human owner for verification');
        console.log('');
        console.log('3. Update moltverr.ts connector to use the API key');
        console.log('');
        console.log('After activation, you\'ll have access to 30+ gigs worth $480.97!');

        return data;

    } catch (error) {
        console.error('❌ Registration Error:', error);
        throw error;
    }
}

// Run registration
registerAgent()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Failed:', error.message);
        process.exit(1);
    });
