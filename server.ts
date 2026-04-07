import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();

// Enable CORS for all routes so other sites can use the API
app.use(cors());

// Helper function to scrape VegaMovies grid pages
async function scrapeVegaMoviesGrid(baseUrl: string, page: string | number) {
  const url = (page === 1 || page === '1') ? baseUrl : `${baseUrl}page/${page}/`;
  
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  
  const $ = cheerio.load(response.data);
  const items: any[] = [];
  
  $('.poster-card').each((i, el) => {
    let link = $(el).closest('a').attr('href');
    if (!link) link = $(el).find('a').attr('href');
    if (!link) link = $(el).parent('a').attr('href');
    
    const imgEl = $(el).find('img').not('noscript img').first();
    const img = imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || imgEl.attr('src');
    const title = imgEl.attr('alt');
    
    if (link && title) {
      // Extract ID from the link
      let id = link.replace('https://vegamovies.vodka/', '').replace(/^\/|\/$/g, '');
      items.push({ id, title, link, img });
    }
  });
  
  return items;
}

  // API route to get latest releases from VegaMovies
  app.get("/api/latest-releases", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const items = await scrapeVegaMoviesGrid('https://vegamovies.vodka/', page);
      
      res.json({
        success: true,
        data: {
          page: Number(page),
          results: items
        }
      });
    } catch (error: any) {
      console.error("Latest releases error:", error.message);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch latest releases", 
        message: error.message 
      });
    }
  });

  // API route to get dual audio movies from VegaMovies
  app.get("/api/movies", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const items = await scrapeVegaMoviesGrid('https://vegamovies.vodka/dual-audio-movies/', page);
      
      res.json({
        success: true,
        data: {
          page: Number(page),
          results: items
        }
      });
    } catch (error: any) {
      console.error("Movies error:", error.message);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch movies", 
        message: error.message 
      });
    }
  });

  // API route to get dual audio series from VegaMovies
  app.get("/api/series", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const items = await scrapeVegaMoviesGrid('https://vegamovies.vodka/dual-audio-series/', page);
      
      res.json({
        success: true,
        data: {
          page: Number(page),
          results: items
        }
      });
    } catch (error: any) {
      console.error("Series error:", error.message);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch series", 
        message: error.message 
      });
    }
  });

  // API route to search VegaMovies
  app.get("/api/search", async (req, res) => {
    try {
      const keyword = req.query.q as string;
      if (!keyword) {
        return res.status(400).json({ success: false, error: "Missing 'q' query parameter" });
      }
      const page = req.query.page || 1;
      
      const url = `https://vegamovies.vodka/search.php?q=${encodeURIComponent(keyword)}&page=${page}`;
      
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      
      const searchData = response.data;
      
      // Transform the ID to use the permalink slug instead of the numeric ID
      if (searchData && searchData.hits) {
        searchData.hits = searchData.hits.map((hit: any) => {
          if (hit.document && hit.document.permalink) {
            // Extract the slug from the permalink (e.g., "/movie-name/" -> "movie-name")
            hit.document.id = hit.document.permalink.replace(/^\/|\/$/g, '');
          }
          return hit;
        });
      }
      
      res.json({
        success: true,
        data: searchData
      });
    } catch (error: any) {
      console.error("Search error:", error.message);
      res.status(500).json({ 
        success: false, 
        error: "Failed to search", 
        message: error.message 
      });
    }
  });

  // API route to scrape VegaMovies
  app.get("/api/info", async (req, res) => {
    try {
      const id = req.query.id as string;
      if (!id) {
        return res.status(400).json({ success: false, error: "Missing 'id' query parameter" });
      }
      
      const baseUrl = 'https://vegamovies.vodka';
      const url = `${baseUrl}/${id}`;
      
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract Info
      const info: Record<string, string> = {};
      const infoElements = $('.thecontent p, .entry-content p, .page-body p, .thecontent div, .entry-content div, .page-body div').filter((i, el) => {
        const text = $(el).text();
        return text.includes(':');
      });
      
      infoElements.each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          // Handle cases where strong tags are used
          const strongText = $(el).find('strong').first().text().trim();
          if (strongText && strongText.includes(':')) {
            const key = strongText.replace(':', '').trim();
            const value = $(el).text().replace(strongText, '').trim();
            if (key && value) info[key] = value;
          } else {
            const parts = text.split(':');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const value = parts.slice(1).join(':').trim();
              if (key && value) {
                info[key] = value;
              }
            }
          }
        }
      });

      // Extract Title
      const title = $('h1.entry-title').text().trim() || $('title').text().trim();
      
      // Extract Poster Image
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

      // Extract Download Links / Episodes
      const downloadLinks: Array<{ title: string; links: Array<{ name: string; url: string }> }> = [];
      
      // MoviesMod/VegaMovies typically uses h3 or h4 for section titles
      let currentSection = "Download Links";
      
      $('.thecontent, .entry-content, .page-body').children().each((i, el) => {
        const tagName = el.tagName.toLowerCase();
        
        if (tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h2') {
          const text = $(el).text().trim();
          if (text.toLowerCase().includes('download') || text.toLowerCase().includes('episode') || text.toLowerCase().includes('link') || text.toLowerCase().includes('season') || text.toLowerCase().includes('batch')) {
            currentSection = text;
          }
        }
        
        // Find links within this element
        const links = $(el).find('a').filter((i, a) => {
          const href = $(a).attr('href');
          const text = $(a).text().toLowerCase() || $(a).find('button').text().toLowerCase();
          const className = $(a).attr('class') || $(a).find('button').attr('class') || '';
          
          if (!href || !href.startsWith('http')) return false;
          if (href.includes('moviesmod') || href.includes('vegamovies') || href.includes('telegram') || href.includes('whatsapp') || href.includes('imdb.com')) return false;
          
          // Accept if it looks like a download button or link
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
        
        if (links.length > 0) {
          const sectionLinks: Array<{ name: string; url: string }> = [];
          links.each((i, a) => {
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
            // Check if we already have this section
            const existingSection = downloadLinks.find(s => s.title === currentSection);
            if (existingSection) {
              existingSection.links.push(...sectionLinks);
            } else {
              downloadLinks.push({ title: currentSection, links: sectionLinks });
            }
          }
        }
      });

      res.json({
        success: true,
        data: {
          id,
          title,
          poster,
          info,
          downloadLinks
        }
      });
    } catch (error: any) {
      console.error("Scraping error:", error.message);
      res.status(500).json({ 
        success: false, 
        error: "Failed to scrape data", 
        message: error.message 
      });
    }
  });

  // Helper function to extract a single cloud.unblockedgames.world link
  async function extractSingleLink(url: string, headers: any) {
    try {
      // Step 1: Get initial page
      const res1 = await axios.get(url, { headers });
      const wpHttpMatch = res1.data.match(/name="_wp_http" value="([^"]+)"/);
      if (!wpHttpMatch) throw new Error("Could not find _wp_http");
      const wpHttp = wpHttpMatch[1];

      // Step 2: First POST
      const res2 = await axios.post('https://cloud.unblockedgames.world/', `_wp_http=${encodeURIComponent(wpHttp)}`, {
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': url }
      });
      
      const $2 = cheerio.load(res2.data);
      const formAction = $2('form').attr('action');
      const wpHttp2Match = res2.data.match(/name="_wp_http2" value="([^"]+)"/);
      const tokenMatch = res2.data.match(/name="token" value="([^"]+)"/);
      
      if (!wpHttp2Match || !tokenMatch || !formAction) throw new Error("Could not find _wp_http2, token, or formAction");
      const wpHttp2 = wpHttp2Match[1];
      const token = tokenMatch[1];

      // Step 3: Second POST
      const res3 = await axios.post(formAction, `_wp_http2=${encodeURIComponent(wpHttp2)}&token=${encodeURIComponent(token)}`, {
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': 'https://cloud.unblockedgames.world/' }
      });

      // Step 4: Extract goUrl and cookie
      let goUrl = '';
      let cookieName = '';
      let cookieValue = '';
      const $3 = cheerio.load(res3.data);
      $3('script').each((i, el) => {
        const text = $3(el).text();
        if (text.includes('verify_button') || text.includes('two_steps_btn')) {
          const goMatch = text.match(/href","([^"]+\?go=[^"]+)"/);
          if (goMatch) goUrl = goMatch[1];
          const cookieMatch = text.match(/s_343\('([^']+)',\s*'([^']+)'/);
          if (cookieMatch) {
            cookieName = cookieMatch[1];
            cookieValue = cookieMatch[2];
          }
        }
      });

      if (!goUrl || !cookieName || !cookieValue) throw new Error("Could not find goUrl or cookie");

      // Step 5: GET goUrl
      const res4 = await axios.get(goUrl, {
        headers: { ...headers, 'Cookie': `${cookieName}=${cookieValue}`, 'Referer': formAction },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
      });

      // Step 6: Extract DriveSeed URL
      const $4 = cheerio.load(res4.data);
      const metaRefresh = $4('meta[http-equiv="refresh"]').attr('content');
      if (!metaRefresh) throw new Error("Could not find meta refresh");
      const urlMatch = metaRefresh.match(/url=(.+)/i);
      if (!urlMatch) throw new Error("Could not find URL in meta refresh");
      const driveseedUrl = urlMatch[1];

      // Step 7: GET DriveSeed URL
      const res5 = await axios.get(driveseedUrl, {
        headers: { ...headers, 'Referer': goUrl },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
      });

      // Step 8: Extract final DriveSeed list URL
      const replaceMatch = res5.data.match(/window\.location\.replace\("([^"]+)"\)/);
      if (!replaceMatch) throw new Error("Could not find window.location.replace");
      const finalDsUrl = new URL(replaceMatch[1], 'https://driveseed.org').href;

      // Step 9: GET final DriveSeed list
      const res6 = await axios.get(finalDsUrl, {
        headers: { ...headers, 'Referer': driveseedUrl }
      });

      // Step 10: Extract file links
      const $6 = cheerio.load(res6.data);
      const finalLinks: Array<{ name: string; url: string }> = [];
      $6('a').each((i, el) => {
        const href = $6(el).attr('href');
        if (href && href.includes('/file/')) {
          const fullUrl = new URL(href, 'https://driveseed.org').href;
          const name = $6(el).text().trim() || `File ${i}`;
          finalLinks.push({ name, url: fullUrl });
        }
      });

      return {
        originalUrl: url,
        finalUrl: finalDsUrl,
        links: finalLinks
      };
    } catch (error: any) {
      console.error(`Error extracting ${url}:`, error.message);
      return null;
    }
  }

  // Helper function to extract Vcloud links
  async function extractVcloudLink(url: string, headers: any) {
    try {
      // Step 1: Fetch vcloud.zip page
      const res2 = await axios.get(url, { headers });
      const $2 = cheerio.load(res2.data);
      
      // Step 2: Extract gamerxyt.com URL from script
      let gamerUrl = '';
      $2('script').each((i, el) => {
        const text = $2(el).text();
        const match = text.match(/var url = '([^']+)'/);
        if (match && match[1].includes('gamerxyt.com')) {
          gamerUrl = match[1];
        }
      });
      
      if (!gamerUrl) throw new Error("Could not find gamerxyt API URL");

      // Step 3: Fetch gamerxyt.com URL
      const res3 = await axios.get(gamerUrl, {
        headers: { ...headers, 'Referer': url }
      });
      
      const $3 = cheerio.load(res3.data);
      const finalLinks: Array<{ name: string; url: string }> = [];
      
      // Step 4: Extract and decode links
      $3('a').each((i, el) => {
        const href = $3(el).attr('href');
        const text = $3(el).text().trim() || `Download ${i}`;
        
        if (href && href.startsWith('http') && !href.includes('google.com') && !href.includes('tinyurl.com') && !href.includes('t.me')) {
          let finalUrl = href;
          let name = text;
          
          // Decode base64 from re.php?l=
          if (href.includes('re.php?l=')) {
            try {
              const base64 = href.split('re.php?l=')[1];
              finalUrl = Buffer.from(base64, 'base64').toString('utf-8');
              name = "Direct Download (Cloudflare R2)";
            } catch (e) {
              // Ignore decode errors
            }
          } else if (href.includes('hub.toxix.buzz')) {
            name = "Toxix Hub Download";
          } else if (href.includes('hubcdn.fans')) {
            name = "HubCDN Download";
          }
          
          finalLinks.push({ name, url: finalUrl });
        }
      });

      return {
        originalUrl: url,
        finalUrl: url,
        links: finalLinks
      };
    } catch (error: any) {
      console.error(`Error extracting Vcloud ${url}:`, error.message);
      return null;
    }
  }

  // API route to extract links from episodes.modpro.blog or nexdrive/vcloud
  app.get("/api/extract", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ success: false, error: "Missing 'url' query parameter" });
      }

      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      };

      let linksToProcess: {name: string, url: string}[] = [];

      if (url.includes('modpro.blog')) {
        // Fetch the modpro.blog page to find cloud.unblockedgames.world links
        const initialRes = await axios.get(url, { headers });
        const $ = cheerio.load(initialRes.data);
        
        $('a').each((i, el) => {
          const href = $(el).attr('href');
          const text = $(el).text().trim();
          if (href && href.includes('cloud.unblockedgames.world')) {
            linksToProcess.push({ name: text || `Link ${i}`, url: href });
          }
        });

        if (linksToProcess.length === 0) {
           throw new Error("Could not find any cloud.unblockedgames.world links on the provided page.");
        }
      } else if (url.includes('cloud.unblockedgames.world')) {
        linksToProcess.push({ name: "Direct Link", url: url });
      } else if (url.includes('nexdrive.pro')) {
        // Fetch the nexdrive.pro page to find all vcloud.zip links
        const initialRes = await axios.get(url, { headers });
        const $ = cheerio.load(initialRes.data);
        
        $('a').each((i, el) => {
          const href = $(el).attr('href');
          const text = $(el).text().trim();
          if (href && (href.includes('vcloud.zip') || href.includes('vcloud'))) {
            linksToProcess.push({ name: text || `Episode ${linksToProcess.length + 1}`, url: href });
          }
        });
        
        console.log("Found vcloud links on nexdrive:", linksToProcess);

        if (linksToProcess.length === 0) {
           throw new Error("Could not find any vcloud links on the provided nexdrive page.");
        }
      } else if (url.includes('vcloud')) {
        linksToProcess.push({ name: "VCloud Link", url: url });
      } else {
        return res.status(400).json({ success: false, error: "Unsupported URL provided" });
      }

      // Process all links sequentially to avoid rate limiting/blocking
      const allResults = [];
      for (let idx = 0; idx < linksToProcess.length; idx++) {
        const link = linksToProcess[idx];
        // Ensure unique names if they are all the same
        const uniqueName = link.name === '⚡ V-Cloud [Resumable]' ? `Episode ${idx + 1}` : link.name;
        
        console.log(`Processing: ${uniqueName} - ${link.url.substring(0, 50)}...`);
        
        let result;
        if (link.url.includes('vcloud')) {
          result = await extractVcloudLink(link.url, headers);
        } else {
          result = await extractSingleLink(link.url, headers);
        }
        
        if (result) {
          // Prefix the extracted link names with the episode/batch name
          const prefixedLinks = result.links.map(l => ({
            name: uniqueName === "Direct Link" || uniqueName === "VCloud Link" ? l.name : `${uniqueName} - ${l.name}`,
            url: l.url
          }));
          allResults.push(...prefixedLinks);
        } else {
          console.log(`Failed to extract: ${link.url}`);
        }
      }

      if (allResults.length === 0) {
         throw new Error("Failed to extract any links from the provided URLs.");
      }

      res.json({
        success: true,
        data: {
          originalUrl: url,
          finalUrl: "Multiple URLs processed",
          links: allResults
        }
      });

    } catch (error: any) {
      console.error("Extraction error:", error.message);
      res.status(500).json({ 
        success: false, 
        error: "Failed to extract links", 
        message: error.message 
      });
    }
  });

  // Vite middleware for development
  async function startServer() {
    const PORT = process.env.PORT || 3000;
    
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  // If not running in a serverless environment like Vercel, start the server
  if (!process.env.VERCEL) {
    startServer();
  }

  export default app;
