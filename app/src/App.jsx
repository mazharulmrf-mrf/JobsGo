import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Search } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setJobs([]);
    } else {
      setJobs(data || []);
    }

    setLoading(false);
  }

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <h1>JobsGo</h1>
            <p>Never Miss a Job Circular!</p>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <span className="eyebrow">JOB CIRCULARS</span>

            <h2>
              Find your next
              <br />
              opportunity.
            </h2>

            <p>
              Latest government job circulars, all in one place.
            </p>
          </div>
        </section>

        <div className="search-box">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search job circular..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <section className="section">
          <div className="section-title">
            <div>
              <span className="eyebrow">LATEST</span>
              <h3>Latest Job Circulars</h3>
            </div>

            <span className="job-count">
              {filteredJobs.length} Jobs
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              No jobs found.
            </div>
          ) : (
            <div className="job-list">
              {filteredJobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="job-icon">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div className="job-content">
                    <h4>{job.title}</h4>

                    {job.organization && (
                      <p className="organization">
                        {job.organization}
                      </p>
                    )}

                    <div className="job-meta">
                      {job.deadline && (
                        <span>
                          <CalendarDays size={15} />
                          Deadline: {job.deadline}
                        </span>
                      )}
                    </div>

                    <a
                      href={job.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="details-button"
                    >
                      View Details
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
