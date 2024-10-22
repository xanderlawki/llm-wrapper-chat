import axios from "axios";
import cheerio from "cheerio";

const API_KEY = "9a4ec06ebdc98f5d6a288b28079ef2a8";

export const scrapeWebsite = async (url) => {
  try {
    // Using ScraperAPI to bypass CORS restrictions
    const response = await axios.get(`http://api.scraperapi.com`, {
      params: { api_key: API_KEY, url: url },
    });

    const html = response.data;
    const $ = cheerio.load(html);
    $("script, style").remove();
    const rawText = $("body").text().replace(/\s+/g, " ").trim();

    return rawText;
  } catch (error) {
    console.error("Error scraping website:", error.message);
    return null;
  }
};

const websiteUrl = "http://quotes.toscrape.com";
scrapeWebsite(websiteUrl).then((text) => {
  if (text) {
    console.log("Scraped content:", text);
  } else {
    console.log("Failed to scrape website.");
  }
});
