import InvestorPolicyCard from "./InvestorPolicyCard.jsx";
import { policiesDocumentGroups, policiesPageCopy } from "./policies-content.js";
import "./PoliciesPage.css";

export default function PoliciesPage() {
  return (
    <section className="investor-policies" aria-labelledby="investor-policies-title">
      <header className="investor-policies-header">
        <h2 id="investor-policies-title">{policiesPageCopy.title}</h2>
        <p className="investor-policies-subtitle">
          {policiesPageCopy.subtitle.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </header>

      <div className="investor-policies-groups">
        {policiesDocumentGroups.map((group) => (
          <section key={group.id} className="investor-policies-group" aria-labelledby={`${group.id}-label`}>
            <h3 id={`${group.id}-label`} className="investor-policies-group-label">
              {group.label}
            </h3>

            {group.rows.map((row, rowIndex) => (
              <div key={`${group.id}-row-${rowIndex}`} className="investor-policies-row">
                {row.map((card, cardIndex) => (
                  <InvestorPolicyCard
                    key={`${group.id}-${rowIndex}-${cardIndex}`}
                    card={card}
                    variant={group.variant}
                  />
                ))}
              </div>
            ))}

            {group.id === "corporate-policies" ? (
              <p className="investor-policies-view-all">
                <a href="#">{policiesPageCopy.viewAllLabel}</a>
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}
