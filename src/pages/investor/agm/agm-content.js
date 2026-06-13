export const agmYears = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
  "2018-19",
  "2017-18"
];

const card = (title, date, fileSize, options = {}) => ({
  title,
  date,
  fileSize,
  href: options.href || "#",
  ...options,
});

const agmDocumentsByYear = {
  "2025-26": {
    grids: [
      [
        {
          title: "02.09.2025-Newspaper Advertisement for 16th AGM Dt.: 26.09.2025",
          date: "September 2, 2025",
          fileSize: "1024 KB",
          href: "/investor-pdfs/agm/EURO-Newspaper-Publish-Copy-1.pdf"
        },
        {
          title: "04.09.2025-Addendum to the Notice of AGM to be held on Dt. 26.09.2025",
          date: "September 4, 2025",
          fileSize: "426 KB",
          href: "/investor-pdfs/agm/Addendum-to-the-Notice-04.09.2025.pdf"
        },
        {
          title: "05.09.2025-Newspaper Advertisement of Addendum to the Notice of AGM Dt. 26.09.2025",
          date: "September 5, 2025",
          fileSize: "937 KB",
          href: "/investor-pdfs/agm/Addendum-Newspaper.pdf"
        }
      ],
      [
        {
          title: "Proceedings of Annual General Meeting held on 26.09.2025",
          date: "September 26, 2025",
          fileSize: "4.4 MB",
          href: "/investor-pdfs/agm/Proceedings-of-AGM-26.09.2025.pdf"
        },
        {
          title: "Voting Results of 16th AGM Held on 26.09.2025",
          date: "September 26, 2025",
          fileSize: "5.4 MB",
          href: "/investor-pdfs/agm/VotingResults.pdf"
        },
        {
          title: "Notice of Postal Ballot 18.11.2025",
          date: "November 18, 2025",
          fileSize: "4.6 MB",
          href: "/investor-pdfs/agm/Postal-Ballot-Notice.pdf"
        }
      ]
    ],
    postalBallot: {
      title: "Postal Ballot",
      documents: [
        {
          title: "Notice of Postal Ballot 18.11.2025",
          date: "November 18, 2025",
          fileSize: "4.6 MB",
          href: "/investor-pdfs/agm/Postal-Ballot-Notice.pdf"
        }
      ]
    }
  },
  "2024-25": {
    grids: [
      [
        {
          title: "02.4.2024 - Notice of Extra Ordinary General Meeting on 24.4.2024",
          date: "02.4.2024 - Notice of Extra Ordinary Gen",
          fileSize: "904 KB",
          href: "/investor-pdfs/agm/EGM_Notice-_2.4.2024.pdf"
        },
        {
          title: "24.04.2024 - Newspaper Advertisement for EGM - Dt: 04.04.2024",
          date: "April 24, 2024",
          fileSize: "671 KB",
          href: "/investor-pdfs/agm/Newspaper_Advertisement-_EGM_Notice-_24.4.2024.pdf"
        },
        {
          title: "24.04.2024 - Proceedings of Extra Ordinary General Meeting",
          date: "April 24, 2024",
          fileSize: "849 KB",
          href: "/investor-pdfs/agm/Proceedings_of_Extra_Ordinary_general_Meeting.pdf"
        }
      ],
      [
        {
          title: "Voting Result of EGM - 24.04.2024",
          date: "April 24, 2024",
          fileSize: "2.3 MB",
          href: "/investor-pdfs/agm/Votingresult.pdf"
        },
        {
          title: "04.09.2024 - Notice of Annual General Meeting dt. 27.09.2024",
          date: "September 4, 2024",
          fileSize: "591 KB",
          href: "/investor-pdfs/agm/Notice_of_AGM-27.09.2024__1_.pdf"
        },
        {
          title: "05.09.2024 - Newspaper Advertisement of 15th Annual General Meeting",
          date: "September 5, 2024",
          fileSize: "5.2 MB",
          href: "/investor-pdfs/agm/Newspaper-5.pdf"
        }
      ],
      [
        {
          title: "Proceedings of Annual General Meeting held on 27.09.2024",
          date: "September 27, 2024",
          fileSize: "1.7 MB",
          href: "/investor-pdfs/agm/Gist_of_Agm.pdf"
        },
        {
          title: "Voting Results of 15th AGM Held on 27.09.2024",
          date: "September 27, 2024",
          fileSize: "3.8 MB",
          href: "/investor-pdfs/agm/Voting_results.pdf"
        }
      ]
    ],
    postalBallot: null
  },
  "2023-24": {
    grids: [
      [
        {
          title: "Voting Result of 14th AGM held on 30.09.2023",
          date: "September 30, 2023",
          fileSize: "1.0 MB",
          href: "/investor-pdfs/agm/Voting_Result-2.pdf"
        },
        {
          title: "Proceedings of Annual general Meeting held on 29.09.2023",
          date: "September 29, 2023",
          fileSize: "761 KB",
          href: "/investor-pdfs/agm/Proceedings_of_AGM_-_29.9.2023.pdf"
        },
        {
          title: "06.09.2023 - Newspaper Advertisement for 14th AGM",
          date: "September 6, 2023",
          fileSize: "823 KB",
          href: "/investor-pdfs/agm/Newspaper-Advertisement-for-Public-Notice-of-14th-Annual-General-Meeting_-_06.09.2023-1.pdf"
        }
      ],
      [
        {
          title: "Notice of Annual General Meeting- 29.9.2023",
          date: "Notice of Annual General Meeting- 29.9.2",
          fileSize: "767 KB",
          href: "/investor-pdfs/agm/Notice_of_AGM_-_29.09.2023-2.pdf"
        }
      ]
    ],
    postalBallot: null
  },
  "2022-23": {
    grids: [
      [
        {
          title: "Voting Results and Scrutinizers Report of 13th Annual General meeting held on September 24th, 2022",
          date: "Voting Results and Scrutinizers Report o",
          fileSize: "5.1 MB",
          href: "/investor-pdfs/agm/1.-Voting-Results-and-Scrutinizers-Report-of-8th-Annual-General-meeting-held-on-September-25-2017-1.pdf"
        },
        {
          title: "Outcome of 13th Annual General Meeting held on September 24th, 2022",
          date: "Outcome of 13th Annual General Meeting h",
          fileSize: "593 KB",
          href: "/investor-pdfs/agm/2.-Outcome-of-13th-Annual-General-Meeting-held-on-September-30-2022.pdf"
        },
        {
          title: "Newspaper Advertisement for Public Notice of 13th Annual General Meeting 02.09.2022",
          date: "September 2, 2022",
          fileSize: "7.4 MB",
          href: "/investor-pdfs/agm/3.-Newspaper-Advertisement-for-Public-Notice-of-13th-Annual-General-Meeting-09-09-2022.pdf"
        }
      ],
      [
        {
          title: "Notice of 13th Annual General Meeting",
          date: "Notice of 13th Annual General Meeting",
          fileSize: "1.6 MB",
          href: "/investor-pdfs/agm/4.-Notice-of-13th-Annual-General-Meeting-07.09.2022.pdf"
        }
      ]
    ],
    postalBallot: null
  },
  "2021-22": {
    grids: [
      [
        {
          title: "Voting Results and Scrutinizers Report of 12th Annual General meeting held on September 24th, 2021",
          date: "Voting Results and Scrutinizers Report o",
          fileSize: "2.9 MB",
          href: "/investor-pdfs/agm/1.-Voting-Results-and-Scrutinizers-Report-of-12th-Annual-General-meeting-held-on-September-24-2021.pdf"
        },
        {
          title: "Outcome of 12th Annual General Meeting held on September 24th, 2021",
          date: "Outcome of 12th Annual General Meeting h",
          fileSize: "513 KB",
          href: "/investor-pdfs/agm/2.-Outcome-of-12th-Annual-General-Meeting-held-on-September-24-2021.pdf"
        },
        {
          title: "Newspaper Advertisement for Public Notice of 12th Annual General Meeting 02.09.2021",
          date: "September 2, 2021",
          fileSize: "7.4 MB",
          href: "/investor-pdfs/agm/3.-Newspaper-Advertisement-for-Public-Notice-of-12th-Annual-General-Meeting-02-09-2021.pdf"
        }
      ],
      [
        {
          title: "Notice of 12th Annual General Meeting",
          date: "Notice of 12th Annual General Meeting",
          fileSize: "1.2 MB",
          href: "/investor-pdfs/agm/4.-Notice-of-12th-Annual-General-Meeting.pdf"
        }
      ]
    ],
    postalBallot: null
  },
  "2020-21": {
    grids: [
      [
        {
          title: "Voting Results and Scrutinizers Report of Extra Ordinary General meeting held on November 04, 2020",
          date: "Voting Results and Scrutinizers Report o",
          fileSize: "2.8 MB",
          href: "/investor-pdfs/agm/1.-Voting-Results-and-Scrutinizers-Report-of-Extra-Ordinary-General-meeting-held-on-November-04-2020-1.pdf"
        },
        {
          title: "Outcome of Extra Ordinary Meeting held on November 4, 2020",
          date: "Outcome of Extra Ordinary Meeting held o",
          fileSize: "331 KB",
          href: "/investor-pdfs/agm/2.-Outcome-of-Extra-Ordinary-Meeting-held-on-November-4-2020-1.pdf"
        },
        {
          title: "Newspaper Advertisement for Public Notice of Extra Ordinary General Meeting 13-10-2020",
          date: "Newspaper Advertisement for Public Notic",
          fileSize: "7.8 MB",
          href: "/investor-pdfs/agm/3.-Newspaper-Advertisement-for-Public-Notice-of-Extra-Ordinary-General-Meeting-13-10-2020.pdf"
        }
      ],
      [
        {
          title: "Notice of Extra Ordinary General Meeting 04.11.2020",
          date: "November 4, 2020",
          fileSize: "157 KB",
          href: "/investor-pdfs/agm/4.-Notice-of-Extra-Ordinary-General-Meeting-04.11.2020.pdf"
        },
        {
          title: "Voting Results and Scrutinizers Report of 11th Annual General meeting held on September 25-2020",
          date: "Voting Results and Scrutinizers Report o",
          fileSize: "1.9 MB",
          href: "/investor-pdfs/agm/5.-Voting-Results-and-Scrutinizers-Report-of-11th-Annual-General-meeting-held-on-September-25-2020.pdf"
        },
        {
          title: "Outcome of 11th Annual Meeting held on September 25, 2020",
          date: "Outcome of 11th Annual Meeting held on S",
          fileSize: "509 KB",
          href: "/investor-pdfs/agm/6.-Outcome-of-11th-Annual-Meeting-held-on-September-25-2020.pdf"
        }
      ],
      [
        {
          title: "Newspaper Advertisement for Public Notice of 11th Annual General Meeting 2-9-2020",
          date: "Newspaper Advertisement for Public Notic",
          fileSize: "7.3 MB",
          href: "/investor-pdfs/agm/7.-Newspaper-Advertisement-for-Public-Notice-of-11th-Annual-General-Meeting-2-9-2020.pdf"
        },
        {
          title: "Notice of 11th Annual General Meeting - 22.08.2020",
          date: "August 22, 2020",
          fileSize: "171 KB",
          href: "/investor-pdfs/agm/8.-Notice-of-11th-Annual-General-Meeting-22.08.2020.pdf"
        }
      ]
    ],
    postalBallot: null
  },
  "2019-20": {
    grids: [
      [
        {
          title: "Voting Results and Scrutinizers Report of 10th Annual General meeting held on September 25, 2019",
          date: "Voting Results and Scrutinizers Report o",
          fileSize: "704 KB",
          href: "/investor-pdfs/agm/1.-Voting-Results-and-Scrutinizers-Report-of-10th-Annual-General-meeting-held-on-September-25-2019.pdf"
        },
        {
          title: "Outcome of 10th Annual General Meeting held on September 25th, 2019",
          date: "Outcome of 10th Annual General Meeting h",
          fileSize: "555 KB",
          href: "/investor-pdfs/agm/2.-Outcome-of-10th-Annual-General-Meeting-held-on-September-25-2019.pdf"
        },
        {
          title: "Newspaper Advertisement for Public Notice of 10th Annual General Meeting 02.09.2019",
          date: "September 2, 2019",
          fileSize: "6.6 MB",
          href: "/investor-pdfs/agm/3.-Newspaper-Advertisement-for-Public-Notice-of-10th-Annual-General-Meeting-02-09-2019.pdf"
        }
      ],
      [
        {
          title: "Notice of 10th Annual General Meeting- 23.08.2019",
          date: "August 23, 2019",
          fileSize: "2.4 MB",
          href: "/investor-pdfs/agm/4.-Notice-of-10th-Annual-General-Meeting-23.08.2019.pdf"
        }
      ]
    ],
    postalBallot: null
  },
  "2018-19": {
    grids: [
      [
        {
          title: "Voting Results and Scrutinizers Report of 9th Annual General meeting held on September 25, 2018",
          date: "Voting Results and Scrutinizers Report o",
          fileSize: "650 KB",
          href: "/investor-pdfs/agm/1.-Voting-Results-and-Scrutinizers-Report-of-9th-Annual-General-meeting-held-on-September-25-2018.pdf"
        },
        {
          title: "Outcome of 9th Annual General Meeting held on September 25th, 2018",
          date: "Outcome of 9th Annual General Meeting he",
          fileSize: "285 KB",
          href: "/investor-pdfs/agm/2.-Outcome-of-9th-Annual-General-Meeting-held-on-September-25-2018.pdf"
        },
        {
          title: "Notice of 9th Annual General Meeting- 23.08.2018",
          date: "August 23, 2018",
          fileSize: "2.0 MB",
          href: "/investor-pdfs/agm/3.-Notice-of-9th-Annual-General-Meeting-23.8.2018.pdf"
        }
      ]
    ],
    postalBallot: null
  },
  "2017-18": {
    grids: [
      [
        {
          title: "Voting Results and Scrutinizers Report of 8th Annual General meeting held on September 25, 2017",
          date: "Voting Results and Scrutinizers Report o",
          fileSize: "4.2 MB",
          href: "/investor-pdfs/agm/1.-Voting-Results-and-Scrutinizers-Report-of-8th-Annual-General-meeting-held-on-September-25-2017.pdf"
        },
        {
          title: "Outcome of 8th Annual General Meeting held on September 25, 2017",
          date: "Outcome of 8th Annual General Meeting he",
          fileSize: "1.8 MB",
          href: "/investor-pdfs/agm/2.-Outcome-of-8th-Annual-General-Meeting-held-on-September-25-2017.pdf"
        },
        {
          title: "Notice of 8th Annual General Meeting - 24.08.2017",
          date: "August 24, 2017",
          fileSize: "5.3 MB",
          href: "/investor-pdfs/agm/3.-Notice-of-8th-Annual-General-Meeting-24.08.2017.pdf"
        }
      ]
    ],
    postalBallot: null
  }
};

export function getAgmContent(year) {
  return (
    agmDocumentsByYear[year] || {
      grids: [],
      postalBallot: null,
    }
  );
}
