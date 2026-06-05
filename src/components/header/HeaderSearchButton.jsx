export default function HeaderSearchButton({ className = "nav-search" }) {
  return (
    <button className={className} type="button" aria-label="Search">
      <svg aria-hidden="true" viewBox="0 0 18 18" focusable="false">
        <path
          d="M8.25 14.25A6 6 0 1 1 8.25 2.25a6 6 0 0 1 0 12Zm4.24-1.76 3.26 3.26"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
