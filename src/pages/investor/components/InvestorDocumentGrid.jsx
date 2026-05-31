import InvestorDocumentGridCard from "./InvestorDocumentGridCard.jsx";

export default function InvestorDocumentGrid({ documents, columns = 3, icons, docIconNodeId }) {
  if (!documents.length) {
    return null;
  }

  return (
    <div
      className="investor-document-grid"
      style={{ "--investor-grid-columns": columns }}
      role="list"
    >
      {documents.map((document) => (
        <InvestorDocumentGridCard
          key={`${document.title}-${document.date}`}
          {...document}
          icons={icons}
          docIconNodeId={docIconNodeId}
        />
      ))}
    </div>
  );
}
