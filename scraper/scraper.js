const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const SOURCE_URL =
  "https://bdgovtjob.net/category/government-jobs-circular/";

async function scrapeJobs() {
  try {
    console.log("Fetching JobsGo source...");

    const response = await axios.get(SOURCE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36"
      },
      timeout: 20000
    });

    const $ = cheerio.load(response.data);
    const jobs = [];

    $("article").each((index, element) => {
      const article = $(element);

      const linkElement = article
        .find("h1 a, h2 a, h3 a, h4 a")
        .first();

      const title = linkElement.text().trim();
      const url = linkElement.attr("href");

      if (!title || !url) return;

      const text = article
        .text()
        .replace(/\s+/g, " ")
        .trim();

      jobs.push({
        title,
        url,
        source: "bdgovtjob.net",
        rawText: text
      });
    });

    fs.writeFileSync(
      "jobs.json",
      JSON.stringify(jobs, null, 2),
      "utf8"
    );

    console.log(`Found ${jobs.length} jobs.`);
    console.log("Data saved to jobs.json");

  } catch (error) {
    console.error("Scraping failed.");

    if (error.response) {
      console.error(
        `HTTP ${error.response.status}: ${error.response.statusText}`
      );
    } else {
      console.error(error.message);
    }
  }
}

scrapeJobs();
