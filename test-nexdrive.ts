import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const url = 'https://nexdrive.pro/genxfm784776479238/';
    console.log(`Fetching ${url}...`);
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    };

    const initialRes = await axios.get(url, { headers });
    const $ = cheerio.load(initialRes.data);
    
    let linksToProcess: any[] = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && (href.includes('vcloud.zip') || href.includes('vcloud'))) {
        linksToProcess.push({ name: text || `Episode ${linksToProcess.length + 1}`, url: href });
      }
    });
    
    console.log("Found vcloud links on nexdrive:", linksToProcess);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
