import "./DealersPage.css";
import { asset } from "./asset.js";

const formFields = [
  { id: "fullName", label: "Full Name*", placeholder: "e.g. Julian Varma", col: "left", row: 1 },
  { id: "email", label: "Email Address*", placeholder: "julian@example.com", type: "email", col: "right", row: 1 },
  { id: "mobile", label: "Mobile No.*", placeholder: "+91 00000 00000", type: "tel", col: "left", row: 2 },
  {
    id: "state",
    label: "State",
    placeholder: "Select State",
    select: true,
    options: ["Gujarat", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Delhi", "Karnataka"],
    col: "right",
    row: 2,
  },
  { id: "address", label: "Address*", placeholder: "Detailed Registered Address", col: "left", row: 3, wide: true },
  { id: "firm", label: "Proprietary/Partnership Firm", placeholder: "Entity Type", col: "left", row: 4 },
  { id: "proprietor", label: "Name of Proprietor*", placeholder: "Full Name of Owner", col: "right", row: 4 },
  { id: "since", label: "Operating Since (Years)", placeholder: "Years in Business", col: "left", row: 5 },
  {
    id: "warehouse",
    label: "Warehouse Capacity*",
    placeholder: "Below 1,000 sq ft",
    select: true,
    options: ["Below 1,000 sq ft", "1,000 - 5,000 sq ft", "5,000 - 10,000 sq ft", "Above 10,000 sq ft"],
    col: "right",
    row: 5,
  },
  { id: "business", label: "Type of Business", placeholder: "FMCG / Retail / Wholesale", col: "left", row: 6 },
  { id: "town", label: "Town/Territory Cover", placeholder: "Target regions or specific cities", col: "left", row: 7, wide: true },
];

const partnerCards = [
  {
    title: "Established Brand",
    copy: "Leverage our reputation as a trusted leader in the Indian snack and packaged food market.",
    icon: "dealers-icon-established.svg",
    tone: "rose",
  },
  {
    title: "Extensive Support",
    copy: "From site selection to staff training, our dedicated operations team ensures your success.",
    icon: "dealers-icon-support.svg",
    tone: "gold",
  },
  {
    title: "Scalable Business Model",
    copy: "A proven framework designed to support growth across multiple locations and markets.",
    icon: "dealers-icon-high-roi.svg",
    tone: "green",
  },
  {
    title: "Premium Products",
    copy: "Extensive Range of 500+ SKU across snacks, sweets, and gourmet staples.",
    icon: "dealers-icon-premium.svg",
    tone: "pink",
  },
];

function FormField({ field }) {
  const className = `dealers-field dealers-field--${field.col}${field.wide ? " dealers-field--wide" : ""} dealers-field--row-${field.row}`;
  const required = field.label.includes("*");

  return (
    <label className={className}>
      <span className="dealers-field-label">{field.label}</span>
      {field.select ? (
        <span className="dealers-field-select">
          <select name={field.id} defaultValue="" aria-label={field.label} required={required}>
            <option value="" disabled>
              {field.placeholder}
            </option>
            {field.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <img src={asset("dealers-select.svg")} alt="" aria-hidden="true" />
        </span>
      ) : (
        <input type={field.type || "text"} name={field.id} placeholder={field.placeholder} required={required} />
      )}
    </label>
  );
}

export default function DealersPage() {
  const dealerStatus =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("dealerInquiry")
      : null;

  return (
    <main className="dealers-main" data-node-id="1079:3487">
      {/* Form / hero card — Figma 1079:3688 */}
      <section className="dealers-apply" aria-labelledby="dealers-apply-title">
        <h1 className="dealers-apply-hero">
          Partner with a
          <br />
          <em>Global snack distributor</em>
        </h1>
        <h2 className="dealers-apply-title" id="dealers-apply-title">
          Dealer Inquiry Application
        </h2>
        <p className="dealers-apply-note">
          Please provide the details of your established entity or proposed venture.
        </p>

        <form className="dealers-form" action="/api/dealer-inquiry.php" method="post" encType="multipart/form-data">
          {dealerStatus === "sent" && (
            <p className="dealers-form-status dealers-form-status--success" role="status">
              Your dealer inquiry has been sent. Our team will get back to you shortly.
            </p>
          )}
          {dealerStatus === "error" && (
            <p className="dealers-form-status dealers-form-status--error" role="alert">
              We could not send your inquiry right now. Please try again or email us directly.
            </p>
          )}
          <label className="dealers-form-trap" aria-hidden="true">
            <span>Website</span>
            <input type="text" name="website" tabIndex="-1" autoComplete="off" />
          </label>
          <div className="dealers-fields">
            {formFields.map((field) => (
              <FormField key={field.id} field={field} />
            ))}
          </div>

          <div className="dealers-upload">
            <span className="dealers-upload-label">COMPANY GST CERTIFICATE*</span>
            <div className="dealers-upload-drop">
              <img src={asset("dealers-upload.svg")} alt="" aria-hidden="true" />
              <p>Click to upload or drag and drop your official company GST certificate</p>
              <input type="file" name="gst-certificate" accept="application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg" required />
            </div>
          </div>

          <label className="dealers-field dealers-field--message">
            <span className="dealers-field-label">Message / Additional Notes</span>
            <textarea name="message" placeholder="Briefly describe your vision for this partnership..."></textarea>
          </label>

          <div className="dealers-submit-row">
            <button className="dealers-submit" type="submit">
              Submit Inquiry
            </button>
          </div>
        </form>
      </section>

      {/* Footprint map — Figma 1079:3868 */}
      <section className="dealers-footprint" aria-labelledby="dealers-footprint-title">
        <div className="dealers-footprint-copy">
          <span className="dealers-footprint-kicker">Domestic</span>
          <h2 className="dealers-footprint-heading" id="dealers-footprint-title">
            Our Footprint:
            <br />
            <span>10+States</span>
          </h2>
          <p>
            Experience the taste of quality in 10+ States. With a heavy density in Gujarat and Maharashtra, we are
            rapidly expanding our distribution network.
          </p>
          <div className="dealers-footprint-stat">
            <strong>10+</strong>
            <span>Active State</span>
          </div>
        </div>
        <div className="dealers-footprint-map" aria-hidden="true">
          <img src={asset("dealers-footprint-photo.jpg")} alt="" />
        </div>
      </section>

      {/* Join the network — Figma 1079:3849 */}
      <h2 className="dealers-join">
        Join our network of <span>successful </span>partnerships.
      </h2>

      {/* Why partner — Figma 1079:3884 */}
      <section className="dealers-why" aria-labelledby="dealers-why-title">
        <div className="dealers-why-head">
          <div className="dealers-why-heading">
            <h2 id="dealers-why-title">Why Partner with EURO?</h2>
            <p>We provide a business model designed for scalability and long-term profitability.</p>
          </div>
          <div className="dealers-rule" aria-hidden="true"></div>
        </div>
        <div className="dealers-card-grid">
          {partnerCards.map((card) => (
            <article className="dealers-card" key={card.title}>
              <div className={`dealers-card-icon dealers-card-icon--${card.tone}`}>
                <img src={asset(card.icon)} alt="" />
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
