import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('vegamovies-home.html', 'utf-8');
const $ = cheerio.load(html);

const items: any[] = [];
$('.poster-card').each((i, el) => {
  // The link is usually wrapping the whole thing or inside
  // Let's find the closest 'a' tag or an 'a' tag inside
  let link = $(el).closest('a').attr('href');
  if (!link) link = $(el).find('a').attr('href');
  if (!link) link = $(el).parent('a').attr('href');
  
  const imgEl = $(el).find('img').not('noscript img').first();
  const img = imgEl.attr('data-lazy-src') || imgEl.attr('src');
  const title = imgEl.attr('alt');
  
  if (link && title) {
    items.push({ title, link, img });
  }
});

console.log("Found items:", JSON.stringify(items.slice(0, 3), null, 2));
