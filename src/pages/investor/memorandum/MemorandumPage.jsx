import { asset } from "./asset.js";
import { memorandumDocument } from "./memorandum-content.js";
import "./MemorandumPage.css";

/** /investor/memorandum — Figma frame 1131:2316 */
export default function MemorandumPage() {
  const doc = memorandumDocument;

  return (
    <section
      className="investor-memorandum"
      aria-labelledby="investor-memorandum-title"
      data-node-id="1131:2316"
    >
      <h2 id="investor-memorandum-title" className="investor-memorandum__title" data-node-id="1131:2498">
        <span>Memorandum of Association and</span>
        <span>Articles of Association</span>
      </h2>

      <p className="investor-memorandum__lead" data-node-id="1131:2497">
        Euro India Fresh Foods Limited is committed to maintaining transparency and trust with our stakeholders.
      </p>

      <div className="investor-memorandum__card-wrap" data-node-id="1131:2500">
        <span className="investor-memorandum__glow" aria-hidden="true" data-node-id="1131:2501" />

        <article className="investor-memorandum__card" data-node-id="1131:2502">
          <div className="investor-memorandum__card-inner" data-node-id="1131:2504">
            <div className="investor-memorandum__icon-wrap" data-node-id="1131:2534">
              <img src={asset("memorandum-pdf-icon.svg")} alt="" aria-hidden="true" />
              <span className="investor-memorandum__icon-gradient" aria-hidden="true" />
            </div>

            <h3 className="investor-memorandum__card-title" data-node-id="1131:2507">
              Constitutional Documents
            </h3>

            <p className="investor-memorandum__card-copy" data-node-id="1131:2509">
              A unified PDF containing the Memorandum and Articles of Association as amended from time to time.
            </p>

            <a className="investor-memorandum__download" href={doc.href} data-node-id="1131:2511">
              <span className="investor-memorandum__download-main">
                <img src={asset("memorandum-pdf-small.svg")} alt="" aria-hidden="true" />
                <span>{doc.title}</span>
              </span>
              <span className="investor-memorandum__download-meta">
                <span>{doc.fileSize}</span>
                <img src={asset("memorandum-download-arrow.svg")} alt="" aria-hidden="true" />
              </span>
            </a>

            <div className="investor-memorandum__meta" data-node-id="1131:2522">
              <div className="investor-memorandum__meta-item">
                <span className="investor-memorandum__meta-label">Last updated</span>
                <span className="investor-memorandum__meta-value">{doc.lastUpdated}</span>
              </div>
              <div className="investor-memorandum__meta-item">
                <span className="investor-memorandum__meta-label">Compliance ID</span>
                <span className="investor-memorandum__meta-value">{doc.complianceId}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
