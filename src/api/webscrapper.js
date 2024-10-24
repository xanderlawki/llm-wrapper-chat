const axios = require("axios");
const cheerio = require("cheerio");

const API_KEY = "9a4ec06ebdc98f5d6a288b28079ef2a8";

export async function scrapeWebsite(url) {
  try {
    // Fetch the website content using ScraperAPI to bypass CORS
    const response = await axios.get("http://api.scraperapi.com", {
      params: {
        api_key: API_KEY,
        url: url,
      },
    });

    const html = response.data;

    // Load the HTML content into cheerio
    const $ = cheerio.load(html);

    // Remove script and style tags
    $("script, style").remove();

    // Get the text content and remove extra whitespace
    const rawText = $("body").text().replace(/\s+/g, " ").trim();

    return rawText;
  } catch (error) {
    console.error("Error scraping website:", error.message);
    return null;
  }
}
