import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

async function test() {
  try {
    const url = 'https://vegamovies.vodka/';
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    const res = await axios.get(url, { headers });
    fs.writeFileSync('vegamovies-home.html', res.data);
    console.log("Saved to vegamovies-home.html");
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
