import * as cheerio from 'cheerio';
import fs from 'fs';

function testScraper() {
  const html = fs.readFileSync('test-vega.html', 'utf-8');
  const $ = cheerio.load(html);
  
  // Extract Poster
  let poster = '';
  const imgElements = $('.thecontent img, .entry-content img, .page-body img, figure img');
  imgElements.each((i, el) => {
    if (!poster) {
      const src = $(el).attr('data-lazy-src') || $(el).attr('src');
      if (src && !src.includes('data:image') && !src.includes('logom.png') && !src.includes('avatar')) {
        poster = src;
      }
    }
  });
  console.log("Poster:", poster);

  // Extract Download Links
  const downloadLinks: Array<{ title: string; links: Array<{ name: string; url: string }> }> = [];
  let currentSection = "Download Links";
  
  $('.thecontent, .entry-content, .page-body').children().each((i, el) => {
    const tagName = el.tagName.toLowerCase();
    
    if (tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h2') {
      const text = $(el).text().trim();
      if (text.toLowerCase().includes('download') || text.toLowerCase().includes('episode') || text.toLowerCase().includes('link') || text.toLowerCase().includes('season') || text.toLowerCase().includes('batch')) {
        currentSection = text;
        console.log("Found section:", currentSection);
      }
    }
    
    // Find links within this element
    const links = $(el).find('a');
    
    const validLinks = links.filter((i, a) => {
      const href = $(a).attr('href');
      const text = $(a).text().toLowerCase() || $(a).find('button').text().toLowerCase();
      const className = $(a).attr('class') || $(a).find('button').attr('class') || '';
      
      if (!href || !href.startsWith('http')) return false;
      if (href.includes('moviesmod') || href.includes('vegamovies') || href.includes('telegram') || href.includes('whatsapp') || href.includes('imdb.com')) return false;
      
      return className.includes('maxbutton') || 
             className.includes('btn') ||
             text.includes('download') || 
             text.includes('episode') || 
             text.includes('link') ||
             text.includes('drive') ||
             text.includes('server') ||
             text.includes('zip') ||
             text.includes('pack') ||
             text.includes('direct') ||
             text.includes('cloud') ||
             href.includes('drive') ||
             href.includes('link') ||
             href.includes('fast') ||
             href.includes('nexdrive') ||
             href.includes('vcloud');
    });
    
    if (validLinks.length > 0) {
      const sectionLinks: Array<{ name: string; url: string }> = [];
      validLinks.each((i, a) => {
        let name = $(a).text().trim();
        if (!name) {
          name = $(a).find('button').text().trim();
        }
        if (!name) name = "Download Link";
        
        const url = $(a).attr('href') || "";
        if (url) {
          sectionLinks.push({ name, url });
        }
      });
      
      if (sectionLinks.length > 0) {
        const existingSection = downloadLinks.find(s => s.title === currentSection);
        if (existingSection) {
          existingSection.links.push(...sectionLinks);
        } else {
          downloadLinks.push({ title: currentSection, links: sectionLinks });
        }
      }
    }
  });
  
  console.log("Download Links:", JSON.stringify(downloadLinks, null, 2));
}

testScraper();
