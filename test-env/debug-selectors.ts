import { chromium } from 'playwright';

async function findApiLink() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('https://jobforagent.com', { waitUntil: 'domcontentloaded' });

        const apiLink = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const apiNode = links.find(a =>
                a.textContent?.toLowerCase().includes('api') &&
                a.textContent?.toLowerCase().includes('here')
            );
            return apiNode ? apiNode.href : 'Not found';
        });

        console.log('🔗 API Link:', apiLink);

    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
}

findApiLink().catch(console.error);
