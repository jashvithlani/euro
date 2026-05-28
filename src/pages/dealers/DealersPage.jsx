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
    copy: "Leverage our reputation and trusted product portfolio across the Indian snack market.",
    icon: "dealers-icon-established.svg",
    tone: "rose",
  },
  {
    title: "Extensive Support",
    copy: "From sales collateral to training, our team ensures your success.",
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

function SelectField({ label, name, children }) {
  return (
    <label className="dealers-field dealers-select-field">
      <span>{label}</span>
      <select name={name} defaultValue="">
        <option value="" disabled>
          {children}
        </option>
        <option>Gujarat</option>
        <option>Maharashtra</option>
        <option>Rajasthan</option>
        <option>Madhya Pradesh</option>
      </select>
    </label>
  );
}

export default function DealersPage() {
  return (
    <main className="dealers-main">
      <section className="dealers-form-section" aria-labelledby="dealers-title">
        <h1 id="dealers-title">
          <span>Partner with a</span>
          <em>Global snack distributor</em>
        </h1>

        <div className="dealers-form-intro">
          <h2>Dealer Inquiry Application</h2>
          <p>Please provide the details of your established entity or proposed venture.</p>
        </div>

        <form className="dealers-form" action="#">
          <div className="dealers-form-grid">
            <Field {...textFields[0]} />
            <Field {...textFields[1]} />
            <Field {...textFields[2]} />
            <SelectField label="State" name="state">
              Select State
            </SelectField>
            {textFields.slice(3, 7).map((field) => (
              <Field key={field.name} {...field} />
            ))}
            <SelectField label="Warehouse Capacity*" name="warehouseCapacity">
              Below 1,000 sq ft
            </SelectField>
            {textFields.slice(7).map((field) => (
              <Field key={field.name} {...field} />
            ))}

            <label className="dealers-upload dealers-field-wide">
              <span>Company GST Certificate*</span>
              <input type="file" name="gstCertificate" accept=".pdf,.jpg,.jpeg,.png" />
              <div>
                <img src={asset("dealers-upload.svg")} alt="" />
                <p>Click to upload or drag and drop your official company GST certificate</p>
              </div>
            </label>

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

      <section className="dealers-footprint" aria-labelledby="dealers-footprint-title">
        <div className="dealers-footprint-copy">
          <span>Outlets</span>
          <h2 id="dealers-footprint-title">
            Our Footprint:
            <em>Gujarat &amp; Maharashtra</em>
          </h2>
          <p>
            Experience the taste of quality in 10+ Stores. With a heavy density in Gujarat and
            Maharashtra, we are rapidly expanding our distribution network.
          </p>
          <strong>10+</strong>
          <small>Active Outlets</small>
        </div>

        <div className="dealers-map-panel" aria-label="Outlet footprint map">
          <img src={asset("dealers-map.png")} alt="India map highlighting Gujarat and Maharashtra" />
          <span className="dealers-pin dealers-pin-surat"></span>
          <span className="dealers-pin dealers-pin-bhavnagar"></span>
          <span className="dealers-pin dealers-pin-mumbai"></span>
          <span className="dealers-map-label dealers-map-label-surat">Surat</span>
          <span className="dealers-map-label dealers-map-label-bhavnagar">Bhavnagar</span>
          <span className="dealers-map-label dealers-map-label-mumbai">Mumbai</span>
        </div>
      </section>

      <section className="dealers-partnership" aria-labelledby="dealers-partnership-title">
        <h2 id="dealers-partnership-title">
          Join our network of <span>successful</span> partnerships.
        </h2>

        <div className="dealers-why">
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
