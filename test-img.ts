import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const url = 'https://vegamovies.vodka/dual-audio-movies/';
    console.log(`Fetching ${url}...`);
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    const res = await axios.get(url, { headers });
    const $ = cheerio.load(res.data);
    
    $('.poster-card').each((i, el) => {
      if (i > 2) return;
      
      const imgEl = $(el).find('img').not('noscript img').first();
      console.log(`Item ${i}:`);
      console.log(`  src:`, imgEl.attr('src'));
      console.log(`  data-lazy-src:`, imgEl.attr('data-lazy-src'));
      console.log(`  data-src:`, imgEl.attr('data-src'));
      
      const noscriptImg = $(el).find('noscript img').first();
      console.log(`  noscript src:`, noscriptImg.attr('src'));
      
      console.log(`  HTML:`, $(el).find('.poster-image').html()?.substring(0, 200));
    });
    
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
