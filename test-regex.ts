import fs from 'fs';

const html = fs.readFileSync('vegamovies-home.html', 'utf-8');
const match = html.match(/<div class="[^"]*poster-card[^"]*".*?<\/div>/s);
if (match) {
  console.log(match[0]);
} else {
  console.log("No poster-card found in regex");
}
