const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const SOURCE_URL =
  "https://bdgovtjob.net/category/government-jobs-circular/";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

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

      jobs.push({
        title,
        source_url: url,
        status: "active"
      });
    });

    console.log(`Found ${jobs.length} jobs.`);

    fs.writeFileSync(
      "jobs.json",
      JSON.stringify(jobs, null, 2),
      "utf8"
    );

    if (jobs.length === 0) {
      throw new Error("No jobs found. Scraper may need selector changes.");
    }

    const { data, error } = await supabase
      .from("jobs")
      .upsert(jobs, {
        onConflict: "source_url"
      })
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`Saved/updated ${data.length} jobs in Supabase.`);
  } catch (error) {
    console.error("Scraping failed:");
    console.error(error.message);
    process.exit(1);
  }
}

scrapeJobs();
