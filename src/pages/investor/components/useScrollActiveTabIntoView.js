import { useEffect, useRef } from "react";

export function useScrollActiveTabIntoView(activeKey) {
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [activeKey]);

  return activeRef;
}
