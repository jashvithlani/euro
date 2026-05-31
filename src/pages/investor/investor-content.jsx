import { investorFilterTabs } from "./investor-tabs.js";

const sectionContent = {
  prospectus: {
    title: "Prospectus",
    cardTitle: "Prospectus Dated: March 14, 2017",
    cardCopy: (
      <>
        Official filing for Euro India Fresh Foods Limited.
        <br />
        Review our financial foundations and strategic growth vision.
      </>
    ),
    downloadHref: "#",
  },
};

export function getInvestorSectionContent(tabId) {
  return (
    sectionContent[tabId] || {
      title: investorFilterTabs.find((tab) => tab.id === tabId)?.label || "Investor Relations",
      cardTitle: "Documents coming soon",
      cardCopy: "Selected investor resources will be published here.",
      downloadHref: "#",
    }
  );
}
