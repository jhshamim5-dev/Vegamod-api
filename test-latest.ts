import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const url = 'https://vegamovies.vodka/';
    console.log(`Fetching ${url}...`);
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    const res = await axios.get(url, { headers });
    const $ = cheerio.load(res.data);
    
    const items: any[] = [];
    
    // Try to find the main post items. Usually they are in articles or divs with specific classes.
    $('.blog-items article, .post-item, .item, article').each((i, el) => {
      if (i >= 10) return; // just get a few for testing
      const title = $(el).find('h2, h3, .title, .post-title').text().trim();
      const link = $(el).find('a').attr('href');
      const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      
      if (title && link) {
        items.push({ title, link, img });
      }
    });
    
    console.log("Found items:", JSON.stringify(items, null, 2));
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
