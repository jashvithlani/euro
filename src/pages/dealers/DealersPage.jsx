import React from "react";
import "./DealersPage.css";
import { asset } from "./asset.js";

const textFields = [
  {
    label: "Full Name*",
    name: "fullName",
    placeholder: "e.g. Julian Varma",
    type: "text",
  },
  {
    label: "Email Address*",
    name: "email",
    placeholder: "julian@example.com",
    type: "email",
  },
  {
    label: "Mobile No.*",
    name: "mobile",
    placeholder: "+91 00000 00000",
    type: "tel",
  },
  {
    label: "Address*",
    name: "address",
    placeholder: "Detailed Registered Address",
    wide: true,
  },
  {
    label: "Proprietary/Partnership Firm",
    name: "firmType",
    placeholder: "Entity Type",
  },
  {
    label: "Name of Proprietor*",
    name: "proprietor",
    placeholder: "Full Name of Owner",
  },
  {
    label: "Operating Since (Years)",
    name: "operatingSince",
    placeholder: "Years in Business",
    type: "number",
  },
  {
    label: "Type of Business",
    name: "businessType",
    placeholder: "FMCG / Retail / Wholesale",
  },
  {
    label: "Town/Territory Cover",
    name: "territory",
    placeholder: "Target regions or specific cities",
    wide: true,
  },
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
    title: "High ROI",
    copy: "Our optimized supply chain and high-demand products drive consistent, rapid returns.",
    icon: "dealers-icon-high-roi.svg",
    tone: "green",
  },
  {
    title: "Premium Products",
    copy: "Diverse range of over 200+ SKUs across snacks, sweets, and gourmet staples.",
    icon: "dealers-icon-premium.svg",
    tone: "pink",
  },
];

function Field({ label, name, placeholder, type = "text", wide = false }) {
  return (
    <label className={wide ? "dealers-field dealers-field-wide" : "dealers-field"}>
      <span>{label}</span>
      <input name={name} type={type} placeholder={placeholder} />
    </label>
  );
}

function SelectField({ label, name, children, options = [] }) {
  return (
    <label className="dealers-field dealers-select-field">
      <span>{label}</span>
      <select name={name} defaultValue="">
        <option value="" disabled>
          {children}
        </option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

export default function DealersPage() {
  return (
    <main className="dealers-main" data-node-id="1079:3487">
      <div className="dealers-hero-block" data-node-id="245:2036">
        <div className="dealers-hero-meta">
          <span className="dealers-pill">Distribution Partnership</span>
          <p className="dealers-hero-lede">
            Join India&apos;s trusted snack brand and grow with a proven distribution network.
          </p>
        </div>

        <h1 id="dealers-title" data-node-id="245:2093">
          <span>Partner with a</span>
          <em>Global snack distributor</em>
        </h1>
      </div>

      <section className="dealers-form-section" aria-labelledby="dealers-title">
        <div className="dealers-form-intro" data-node-id="489:301">
          <h2>Dealer Inquiry Application</h2>
          <p>Please provide the details of your established entity or proposed venture.</p>
        </div>

        <form className="dealers-form" action="#" data-node-id="489:305">
          <div className="dealers-form-grid">
            <Field {...textFields[0]} />
            <Field {...textFields[1]} />
            <Field {...textFields[2]} />
            <SelectField label="State" name="state" options={["Gujarat", "Maharashtra", "Rajasthan", "Madhya Pradesh"]}>
              Select State
            </SelectField>
            {/* Address (wide) */}
            <Field {...textFields[3]} />
            {/* Firm type + Proprietor */}
            <Field {...textFields[4]} />
            <Field {...textFields[5]} />
            {/* Operating Since + Warehouse Capacity */}
            <Field {...textFields[6]} />
            <SelectField
              label="Warehouse Capacity*"
              name="warehouseCapacity"
              options={["Below 1,000 sq ft", "1,000–5,000 sq ft", "Above 5,000 sq ft"]}
            >
              Below 1,000 sq ft
            </SelectField>
            {/* Type of Business */}
            <Field {...textFields[7]} />
            {/* Town/Territory Cover (wide) */}
            <Field {...textFields[8]} />

            <label className="dealers-field dealers-field-wide dealers-notes">
              <span>Message / Additional Notes</span>
              <textarea
                name="notes"
                placeholder="Briefly describe your vision for this partnership..."
              ></textarea>
            </label>
          </div>

          <button type="submit">Submit Inquiry</button>
        </form>
      </section>

      <section className="dealers-footprint" aria-labelledby="dealers-footprint-title" data-node-id="489:671">
        <div className="dealers-footprint-copy">
          <span>DOMESTIC</span>
          <h2 id="dealers-footprint-title">
            Our Footprint:
            <em>10+ States</em>
          </h2>
          <p>
            Experience the taste of quality in 10+ States. With a heavy density in Gujarat and
            Maharashtra, we are rapidly expanding our distribution network.
          </p>
          <div className="dealers-footprint-stats">
            <div className="dealers-footprint-stat">
              <strong>10+</strong>
              <small>Active State</small>
            </div>
          </div>
        </div>

        <div className="dealers-footprint-photo" aria-label="Euro India distribution network">
          <img src={asset("dealers-footprint-photo.jpg")} alt="Euro India snack distribution" />
        </div>
      </section>

      <section className="dealers-partnership" aria-labelledby="dealers-partnership-title">
        <h2 id="dealers-partnership-title" data-node-id="245:2097">
          Join our network of <span>successful</span> partnerships.
        </h2>

        <div className="dealers-why" data-node-id="489:627">
          <div className="dealers-why-heading">
            <h3>Why Partner with EURO?</h3>
            <p>We provide a business model designed for scalability and long-term profitability.</p>
          </div>
          <div className="dealers-rule" aria-hidden="true"></div>
          <div className="dealers-card-grid">
            {partnerCards.map((card) => (
              <article className="dealers-card" key={card.title}>
                <div className={`dealers-card-icon dealers-card-icon-${card.tone}`}>
                  <img src={asset(card.icon)} alt="" />
                </div>
                <h4>{card.title}</h4>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
