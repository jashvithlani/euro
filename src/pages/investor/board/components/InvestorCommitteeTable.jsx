export default function InvestorCommitteeTable({ rows }) {
  return (
    <div className="investor-board-table" role="table" aria-label="Committee members">
      <div className="investor-board-table__header" role="row">
        <div className="investor-board-table__cell investor-board-table__cell--name" role="columnheader">
          Name of member
        </div>
        <div className="investor-board-table__cell investor-board-table__cell--role" role="columnheader">
          Designation
        </div>
      </div>
      <div className="investor-board-table__body">
        {rows.map((row) => (
          <div className="investor-board-table__row" role="row" key={`${row.name}-${row.designation}`}>
            <div className="investor-board-table__cell investor-board-table__cell--name" role="cell">
              {row.name}
            </div>
            <div className="investor-board-table__cell investor-board-table__cell--role" role="cell">
              {row.designation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
