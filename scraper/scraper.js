const axios = require("axios");
const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");

const URL = "https://bdgovtjob.net/category/government-jobs-circular/";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) throw new Error("SUPABASE_URL is missing from GitHub Secrets.");
if (!supabaseKey) throw new Error("SUPABASE_SECRET_KEY is missing from GitHub Secrets.");

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("JobsGo scraper started");
  console.log("Supabase URL: OK");
  console.log("Supabase Secret Key: OK");

  const res = await axios.get(URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 20000
  });

  const $ = cheerio.load(res.data);
  const jobs = [];

  $("article").each((_, el) => {
    const a = $(el).find("h1 a, h2 a, h3 a, h4 a").first();
    const title = a.text().trim();
    const source_url = a.attr("href");

    if (title && source_url) {
      jobs.push({
        title,
        source_url,
        status: "active"
      });
    }
  });

  console.log(`Found ${jobs.length} jobs.`);

  if (!jobs.length) {
    throw new Error("No jobs found. Website selector may need adjustment.");
  }

  const { data, error } = await supabase
    .from("jobs")
    .upsert(jobs, { onConflict: "source_url" })
    .select("id, title, source_url");

  if (error) throw new Error(`Supabase error: ${error.message}`);

  console.log(`Saved/updated ${data.length} jobs in Supabase.`);
  console.log("JobsGo scraper finished successfully.");
}

main().catch((err) => {
  console.error("SCRAPER FAILED");
  console.error(err.message);
  process.exit(1);
});
