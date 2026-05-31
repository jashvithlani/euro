import { disputeAsset } from "./asset.js";
import { disputePageCopy } from "./dispute-content.js";
import "./DisputePage.css";

export default function DisputePage() {
  const { title, subtitle, integrated, portal, trust } = disputePageCopy;

  return (
    <>
      <section className="investor-dispute" aria-labelledby="investor-dispute-title">
        <header className="investor-dispute__header">
          <h2 id="investor-dispute-title">{title}</h2>
          <p className="investor-dispute__subtitle">
            {subtitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </header>

        <div className="investor-dispute__cards" data-node-id="1131:2274">
          <article className="investor-dispute__integrated">
            <img
              className="investor-dispute__integrated-watermark"
              src={disputeAsset("dispute-integrated-watermark.png")}
              alt=""
              aria-hidden="true"
            />
            <div className="investor-dispute__integrated-copy">
              <p className="investor-dispute__eyebrow">{integrated.eyebrow}</p>
              <h3>{integrated.title}</h3>
            </div>
            <a className="investor-dispute__text-cta" href={integrated.href}>
              <span>{integrated.cta}</span>
              <img src={disputeAsset("dispute-download-arrow.svg")} alt="" aria-hidden="true" />
            </a>
          </article>

          <article className="investor-dispute__portal">
            <h3 className="investor-dispute__portal-title">
              {portal.titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            <p className="investor-dispute__portal-body">
              {portal.body.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <a
              className="investor-dispute__portal-cta"
              href={portal.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{portal.cta}</span>
              <img src={disputeAsset("dispute-portal-cta-arrow.svg")} alt="" aria-hidden="true" />
            </a>
            <img
              className="investor-dispute__portal-deco"
              src={disputeAsset("dispute-portal-deco.svg")}
              alt=""
              aria-hidden="true"
            />
          </article>
        </div>
      </section>

      <section
        className="investor-dispute-trust"
        aria-labelledby="investor-dispute-trust-title"
        data-node-id="1131:2301"
      >
        <div className="investor-dispute-trust__layout" data-node-id="1131:2302">
          <div className="investor-dispute-trust__visual" data-node-id="1131:2315">
            <img src={disputeAsset("dispute-trust-photo.png")} alt="Euro India Foods leadership" />
          </div>
          <div className="investor-dispute-trust__copy">
            <h2 id="investor-dispute-trust-title">
              {trust.titleLines.map((line) => (
                <span key={line.accent}>
                  {line.text}
                  <em>{line.accent}</em>
                </span>
              ))}
            </h2>
            <p>
              {trust.body.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <div className="investor-dispute-trust__tags">
              <span className="investor-dispute-trust__tag investor-dispute-trust__tag--green">{trust.tags[0]}</span>
              <span className="investor-dispute-trust__tag investor-dispute-trust__tag--amber">{trust.tags[1]}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
