import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('vegamovies-home.html', 'utf-8');
const $ = cheerio.load(html);

console.log("Looking for common wrappers...");
const classes = new Set();
$('div').each((i, el) => {
  const cls = $(el).attr('class');
  if (cls && (cls.includes('post') || cls.includes('item') || cls.includes('movie'))) {
    classes.add(cls);
  }
});

console.log(Array.from(classes).slice(0, 10));

// Let's check links directly
console.log("\nSample links:");
$('a').each((i, el) => {
  if (i > 20) return;
  console.log($(el).attr('href'), $(el).text().trim().substring(0, 30));
});
