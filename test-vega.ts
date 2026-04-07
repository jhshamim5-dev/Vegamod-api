import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

async function test() {
  try {
    const url = 'https://vegamovies.vodka/download-bloodhounds-netflix-web-series/';
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    const html = response.data;
    fs.writeFileSync('test-vega.html', html);
    console.log("HTML saved to test-vega.html");
    
    const $ = cheerio.load(html);
    
    // Test Poster
    const poster1 = $('.thecontent img').first().attr('src');
    const poster2 = $('img[class*="wp-image"]').first().attr('src');
    const poster3 = $('.entry-content img').first().attr('src');
    console.log("Poster 1 (.thecontent img):", poster1);
    console.log("Poster 2 (img[class*=wp-image]):", poster2);
    console.log("Poster 3 (.entry-content img):", poster3);
    
    // Test Info
    console.log("--- INFO ---");
    $('.entry-content p, .thecontent p').each((i, el) => {
      const text = $(el).text();
      if (text.includes(':')) {
        console.log("Found info line:", text.substring(0, 50));
      }
    });
    
    // Test Links
    console.log("--- LINKS ---");
    const buttons = $('a[class*="maxbutton"], a button, button a');
    console.log("Found buttons:", buttons.length);
    buttons.each((i, el) => {
      console.log("Button link:", $(el).attr('href') || $(el).parent().attr('href'));
    });
    
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
