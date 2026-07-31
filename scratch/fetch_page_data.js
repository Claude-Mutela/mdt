import fs from 'fs';

async function main() {
  try {
    const res = await fetch('http://localhost:3333/');
    const html = await res.text();
    // Find data-page attribute
    const match = html.match(/data-page="([^"]+)"/);
    if (match) {
      // Decode HTML entities
      const decoded = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
      const pageData = JSON.parse(decoded);
      console.log('lastPreach from Inertia page data:');
      console.log(JSON.stringify(pageData.props.lastPreach, null, 2));
    } else {
      console.log('Could not find data-page attribute in HTML.');
    }
  } catch (error) {
    console.error('Error fetching page:', error);
  }
}

main();
