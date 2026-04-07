import axios from 'axios';

async function testSearch() {
  try {
    const keyword = 'batman';
    const url = `https://vegamovies.vodka/search.php?q=${keyword}&page=1`;
    console.log(`Fetching ${url}...`);
    
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data).substring(0, 500) + "...");
    
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

testSearch();
