import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const url = 'https://vcloud.zip/1nbvo8cbsb8onis';
    console.log(`Fetching ${url}...`);
    
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    let gamerUrl = '';
    $('script').each((i, el) => {
      const text = $(el).text();
      const match = text.match(/var url = '([^']+)'/);
      if (match && match[1].includes('gamerxyt.com')) {
        gamerUrl = match[1];
      }
    });
    
    if (gamerUrl) {
      console.log(`Found gamerUrl: ${gamerUrl}`);
      const res2 = await axios.get(gamerUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Referer": url
        }
      });
      
      console.log("Status:", res2.status);
      const $2 = cheerio.load(res2.data);
      console.log("Links in gamerxyt:", $2('a').map((i, el) => $2(el).attr('href')).get());
    } else {
      console.log("No gamerUrl found");
    }
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
