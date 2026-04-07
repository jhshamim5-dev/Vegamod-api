import axios from 'axios';

async function test() {
  try {
    const url = 'http://localhost:3000/api/extract?url=https://nexdrive.pro/genxfm784776479238/';
    console.log(`Fetching ${url}...`);
    
    const response = await axios.get(url);
    console.log(`Total links extracted: ${response.data.data.links.length}`);
    console.log(JSON.stringify(response.data.data.links.slice(0, 2), null, 2));
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
