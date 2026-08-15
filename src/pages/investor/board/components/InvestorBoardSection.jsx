import { boardCommittees, boardIntro, boardMembers } from "../board-content.js";
import InvestorCommitteeTable from "./InvestorCommitteeTable.jsx";
import OptimizedImage from "../../../../components/OptimizedImage.jsx";
import "../BoardPage.css";

function boardAsset(fileName) {
  return new URL(`../assets/${fileName}`, import.meta.url).href;
}

function BoardMemberCard({ member }) {
  return (
    <article className={`investor-board-member investor-board-member--${member.variant}`}>
      <div className="investor-board-member__photo-wrap">
        <OptimizedImage className="investor-board-member__photo" src={boardAsset(member.image)} alt="" sizes="(max-width: 999px) calc(2052 / 242 * 92vw), 2052px" />
      </div>
      <div className="investor-board-member__copy">
        <h3>{member.name}</h3>
        <p className="investor-board-member__role">{member.role}</p>
        <p className="investor-board-member__bio">{member.bio}</p>
      </div>
    </article>
  );
}

function CommitteeBlock({ committee }) {
  const isCopyLeft = committee.layout === "copy-left";

  return (
    <section className={`investor-board-committee investor-board-committee--${committee.id}`}>
      {isCopyLeft ? (
        <>
          <div className="investor-board-committee__copy">
            <h2>
              {committee.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p>{committee.description}</p>
            {committee.meta ? (
              <div className="investor-board-committee__meta">
                {committee.metaIcon ? (
                  <img src={boardAsset(committee.metaIcon)} alt="" aria-hidden="true" />
                ) : null}
                <p>{committee.meta}</p>
              </div>
            ) : null}
            {committee.showContactIcons ? (
              <div className="investor-board-committee__icons" aria-hidden="true">
                <span className="investor-board-committee__icon investor-board-committee__icon--users">
                  <img src={boardAsset("board-icon-users.svg")} alt="" />
                </span>
                <span className="investor-board-committee__icon investor-board-committee__icon--handshake">
                  <img src={boardAsset("board-icon-handshake.svg")} alt="" />
                </span>
              </div>
            ) : null}
          </div>
          <InvestorCommitteeTable rows={committee.rows} />
        </>
      ) : (
        <>
          <InvestorCommitteeTable rows={committee.rows} />
          <div className="investor-board-committee__copy">
            <h2>
              {committee.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p>{committee.description}</p>
            {committee.showContactIcons ? (
              <div className="investor-board-committee__icons" aria-hidden="true">
                <span className="investor-board-committee__icon investor-board-committee__icon--users">
                  <img src={boardAsset("board-icon-users.svg")} alt="" />
                </span>
                <span className="investor-board-committee__icon investor-board-committee__icon--handshake">
                  <img src={boardAsset("board-icon-handshake.svg")} alt="" />
                </span>
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}

export default function InvestorBoardSection() {
  return (
    <section className="investor-board" aria-labelledby="investor-board-title">
      <header className="investor-board__intro">
        <h2 id="investor-board-title">{boardIntro.title}</h2>
        <p>{boardIntro.description}</p>
      </header>

      <div className="investor-board__members">
        {boardMembers.map((member) => (
          <BoardMemberCard key={member.id} member={member} />
        ))}
      </div>

      <div className="investor-board__committees">
        {boardCommittees.map((committee) => (
          <CommitteeBlock key={committee.id} committee={committee} />
        ))}
      </div>
    </section>
  );
}
