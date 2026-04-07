import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('vegamovies-home.html', 'utf-8');
const $ = cheerio.load(html);

const items: any[] = [];
$('.poster-card').each((i, el) => {
  const title = $(el).find('.poster-info h3, .poster-info .title, img').attr('alt') || $(el).text().trim();
  const link = $(el).find('a').attr('href');
  const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
  
  // Try to find title from the link if alt is not good
  let cleanTitle = title;
  const aTitle = $(el).find('a').attr('title');
  if (aTitle) cleanTitle = aTitle;
  
  if (link) {
    items.push({ title: cleanTitle, link, img });
  }
});

console.log("Found items:", JSON.stringify(items.slice(0, 3), null, 2));
