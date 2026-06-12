import React from "react";
import { Link } from "react-router-dom";
import { asset } from './asset.js';
import "./CareerPage.css";

const valueCards = [
  {
    title: "Growth",
    copy: "Rapid career advancement in a scale-up environment.",
    icon: asset('career-icon-growth.svg'),
    color: "#ffdea7",
  },
  {
    title: "Global Exposure",
    copy: "Work on projects reaching international markets.",
    icon: asset('career-icon-global.svg'),
    color: "#ffa9b7",
  },
  {
    title: "Modern Infra",
    copy: "State-of-the-art manufacturing & tech stacks.",
    icon: asset('career-icon-infra.svg'),
    color: "#9df197",
  },
  {
    title: "Culture",
    copy: "A collaborative workspace where every voice matters.",
    icon: asset('career-icon-culture.svg'),
    color: "#ffdad2",
  },
  {
    title: "Innovation",
    copy: "Pioneering new flavors and smart technology.",
    icon: asset('career-icon-innovation.svg'),
    color: "#ffdea7",
  },
];

const fields = [
  { name: "name", label: "Your name *", placeholder: "Full Name", required: true },
  { name: "email", label: "Your email *", placeholder: "you@example.com", type: "email", required: true },
  { name: "mobile", label: "Mobile No. *", placeholder: "+91 90000 00000", type: "tel", required: true },
  { name: "date-of-birth", label: "Date of Birth *", placeholder: "mm/dd/yyyy", type: "date", required: true },
  { name: "position", label: "Position Applied For *", placeholder: "e.g. Senior Marketing Manager", wide: true, required: true },
  { name: "education", label: "Educational Qualification *", placeholder: "Highest degree and institution", wide: true, required: true },
  { name: "experience", label: "Experience", placeholder: "Total years of experience" },
  { name: "expected-remuneration", label: "Expected Remunerations", placeholder: "LPA" },
  { name: "reference", label: "Reference", placeholder: "How did you hear about us?", wide: true },
];

function CareerField({ name, label, placeholder, type = "text", required = false, wide = false }) {
  return (
    <label className={wide ? "career-field career-field-wide" : "career-field"}>
      <span>{label}</span>
      <input type={type} name={name} placeholder={placeholder} required={required} />
    </label>
  );
}

export default function CareerPage() {
  const applicationStatus =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("careerApplication")
      : null;

  return (
    <>
      <main className="career-main">
        <section className="career-hero">
          <div className="career-hero-copy">
            <h1>
              <span>Build Your</span>
              <strong>Future</strong>
              <span>With Us</span>
            </h1>
            <p>
              Join a fast-growing FMCG powerhouse where tradition meets innovation. We're looking
              for passionate individuals to help us redefine snacking for millions.
            </p>
            <div className="career-hero-actions">
              <a href="#career-application">Apply Now</a>
              <Link to="/about">About us</Link>
            </div>
          </div>
          <div className="career-hero-media">
            <div className="career-hero-tilt"></div>
            <div className="career-hero-photo">
              <img src={asset('career-hero-team.png')} alt="Team collaborating in a modern office" />
              <div className="career-hero-gradient"></div>
              <div className="career-family-badge">Join the Family</div>
            </div>
          </div>
        </section>

        <section className="career-values">
          <div className="career-section-heading">
            <span>OUR VALUES</span>
            <h2>Why Join Us?</h2>
          </div>
          <div className="career-values-grid">
            {valueCards.map((card) => (
              <article className="career-value-card" key={card.title}>
                <div className="career-value-icon" style={{ backgroundColor: card.color }}>
                  <img src={card.icon} alt="" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="career-application" id="career-application">
          <div className="career-application-heading">
            <span>CAREERS</span>
            <h2>Send Your Application</h2>
            <p>
              We're always looking for exceptional talent to join our team. Fill out the form below
              and let's start a conversation.
            </p>
          </div>

          <form className="career-form" action="/api/career-application.php" method="post" encType="multipart/form-data">
            {applicationStatus === "sent" && (
              <p className="career-form-status career-form-status--success" role="status">
                Your application has been sent. Our team will review it and get back to you shortly.
              </p>
            )}
            {applicationStatus === "error" && (
              <p className="career-form-status career-form-status--error" role="alert">
                We could not send your application right now. Please try again or email us directly.
              </p>
            )}
            <label className="career-form-trap" aria-hidden="true">
              <span>Website</span>
              <input type="text" name="website" tabIndex="-1" autoComplete="off" />
            </label>
            <div className="career-form-grid">
              {fields.map((field) => (
                <CareerField key={field.label} {...field} />
              ))}

              <label className="career-upload career-field-wide">
                <span>Resume * (PDF)</span>
                <div>
                  <img src={asset('career-icon-upload.svg')} alt="" />
                  <p>Click to upload or drag and drop your resume</p>
                  <input type="file" name="resume" accept="application/pdf,.pdf" required />
                </div>
              </label>

              <label className="career-field career-field-wide career-message">
                <span>Your message (optional)</span>
                <textarea name="message" placeholder="Tell us something about yourself..."></textarea>
              </label>
            </div>
            <button type="submit">SUBMIT APPLICATION</button>
          </form>
        </section>
      </main>

      <section className="career-ready">
        <h2>Ready to Grow With Us?</h2>
      </section>
    </>
  );
}
