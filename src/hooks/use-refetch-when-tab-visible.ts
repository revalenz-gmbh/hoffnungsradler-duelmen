import { useEffect, useRef } from "react";

/**
 * Ruft refetch auf, wenn der Browser-Tab wieder sichtbar wird
 * (z. B. nach Aktualisierung der Buchhaltung in Google Sheets).
 */
export function useRefetchWhenTabVisible(refetch: () => void | Promise<void>): void {
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void Promise.resolve(refetchRef.current());
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);
}
