
import fetch from 'node-fetch';

async function checkLiveMocks() {
    console.log('Fetching https://agent47.org ...');
    const res = await fetch('https://agent47.org');
    const html = await res.text();

    const mockStrings = [
        "Sentiment Analysis Batch #402",
        "Logo Variations",
        "Smart Contract Audit L1"
    ];

    console.log('Checking for mock data strings...');
    let foundMock = false;
    for (const str of mockStrings) {
        if (html.includes(str)) {
            console.log(`[WARNING] Found mock string: "${str}"`);
            foundMock = true;
        }
    }

    if (foundMock) {
        console.log('CONCLUSION: The site is currently displaying MOCK DATA in the LiveFeed.');
    } else {
        console.log('CONCLUSION: No mock data strings found. The site is likely displaying LIVE DATA (or empty).');
    }

    // Check for known real data format (if possible, but might be dynamic)
    if (html.includes('Hire Human:')) {
        console.log('[SUCCESS] Found "Hire Human:" string, indicating REAL RentAHuman data.');
    }
}

checkLiveMocks();
