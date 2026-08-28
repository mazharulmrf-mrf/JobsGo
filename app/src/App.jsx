import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  MapPin,
  Search,
  Users,
  Wallet,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

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

  const filteredJobs = jobs.filter((job) => {
    const text = `
      ${job.title || ""}
      ${job.organization || ""}
      ${job.category || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  if (selectedJob) {
    return (
      <div className="app">
        <header className="details-header">
          <button
            className="icon-button"
            onClick={() => setSelectedJob(null)}
          >
            <ArrowLeft size={21} />
          </button>

          <strong>Job Details</strong>

          <button className="icon-button">
            <Bookmark size={20} />
          </button>
        </header>

        <main className="container details-container">
          <section className="job-hero-card">
            <div className="large-job-icon">
              <BriefcaseBusiness size={28} />
            </div>

            <div>
              <span className="eyebrow">
                {selectedJob.category || "JOB CIRCULAR"}
              </span>

              <h2>{selectedJob.title}</h2>

              {selectedJob.organization && (
                <p>{selectedJob.organization}</p>
              )}
            </div>
          </section>

          <section className="info-grid">
            {selectedJob.published_date && (
              <InfoItem
                icon={<CalendarDays size={18} />}
                label="Published"
                value={selectedJob.published_date}
              />
            )}

            {selectedJob.deadline && (
              <InfoItem
                icon={<CalendarDays size={18} />}
                label="Deadline"
                value={selectedJob.deadline}
                danger
              />
            )}

            {selectedJob.vacancy && (
              <InfoItem
                icon={<Users size={18} />}
                label="Vacancy"
                value={selectedJob.vacancy}
              />
            )}

            {selectedJob.salary && (
              <InfoItem
                icon={<Wallet size={18} />}
                label="Salary"
                value={selectedJob.salary}
              />
            )}

            {selectedJob.education && (
              <InfoItem
                icon={<GraduationCap size={18} />}
                label="Education"
                value={selectedJob.education}
              />
            )}

            {selectedJob.location && (
              <InfoItem
                icon={<MapPin size={18} />}
                label="Location"
                value={selectedJob.location}
              />
            )}
          </section>

          {selectedJob.description && (
            <DetailsSection
              title="Job Summary"
              text={selectedJob.description}
            />
          )}

          {selectedJob.requirements && (
            <DetailsSection
              title="Requirements"
              text={selectedJob.requirements}
            />
          )}

          {selectedJob.experience && (
            <DetailsSection
              title="Experience"
              text={selectedJob.experience}
            />
          )}

          {selectedJob.age_limit && (
            <DetailsSection
              title="Age Limit"
              text={selectedJob.age_limit}
            />
          )}

          {selectedJob.job_type && (
            <DetailsSection
              title="Job Type"
              text={selectedJob.job_type}
            />
          )}

          {selectedJob.application_process && (
            <DetailsSection
              title="How to Apply"
              text={selectedJob.application_process}
            />
          )}

          {selectedJob.source_url && (
            <div className="apply-box">
              <p>
                Ready to apply for this job?
              </p>

              <a
                href={selectedJob.source_url}
                target="_blank"
                rel="noreferrer"
                className="apply-button"
              >
                Apply Now
                <ExternalLink size={17} />
              </a>
            </div>
          )}
        </main>
      </div>
    );
  }

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
          <span className="eyebrow">JOB CIRCULARS</span>

          <h2>
            Find your next
            <br />
            opportunity.
          </h2>

          <p>
            Latest government job circulars, all in one place.
          </p>
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
                <article
                  className="job-card clickable"
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                >
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

                    <button
                      className="details-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                    >
                      View Details
                    </button>
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

function InfoItem({ icon, label, value, danger }) {
  return (
    <div className="info-item">
      <div className="info-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong className={danger ? "danger" : ""}>
          {value}
        </strong>
      </div>
    </div>
  );
}

function DetailsSection({ title, text }) {
  return (
    <section className="details-section">
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}

export default App;  const filteredJobs = jobs.filter((job) =>
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
