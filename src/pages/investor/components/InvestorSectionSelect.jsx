import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getInvestorActiveTab, getInvestorHref } from "../investor-routing.js";
import { investorFilterTabs } from "../investor-tabs.js";
import "./InvestorSectionSelect.css";

export default function InvestorSectionSelect({ className = "" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeTab = getInvestorActiveTab(pathname);
  const activeLabel = investorFilterTabs.find((tab) => tab.id === activeTab)?.label ?? "Investor section";

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listboxId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (tabId) => {
    setOpen(false);
    if (tabId !== activeTab) {
      navigate(getInvestorHref(tabId));
    }
  };

  return (
    <div
      ref={rootRef}
      className={`investor-section-select${open ? " is-open" : ""}${className ? ` ${className}` : ""}`}
    >
      <button
        type="button"
        className="investor-section-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="investor-section-select__value">{activeLabel}</span>
        <span className="investor-section-select__chevron" aria-hidden="true" />
      </button>

      {open ? (
        <ul id={listboxId} className="investor-section-select__menu" role="listbox" aria-label="Investor sections">
          {investorFilterTabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <li key={tab.id} className="investor-section-select__option-wrap" role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`investor-section-select__option${isActive ? " is-active" : ""}${
                    tab.borderTone === "muted" ? " investor-section-select__option--muted" : ""
                  }`}
                  onClick={() => handleSelect(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
