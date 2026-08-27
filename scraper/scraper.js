const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const SOURCE_URL =
  "https://bdgovtjob.net/category/government-jobs-circular/";

// ================================
// Supabase configuration
// ================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing from GitHub Secrets.");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing from GitHub Secrets.");
}

console.log("Supabase URL: OK");
console.log("Supabase Secret Key: OK");

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

// ================================
// Scraper
// ================================

async function scrapeJobs() {
  try {
    console.log("");
    console.log("================================");
    console.log("JobsGo Scraper Started");
    console.log("================================");
    console.log("");

    console.log("Fetching:");
    console.log(SOURCE_URL);

    const response = await axios.get(SOURCE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      timeout: 20000
    });

    console.log("Website response: OK");

    const $ = cheerio.load(response.data);

    const jobs = [];

    // ================================
    // Find job posts
    // ================================

    $("article").each((index, element) => {
      const article = $(element);

      const linkElement = article
        .
