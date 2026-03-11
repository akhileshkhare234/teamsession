import { useEffect, RefObject } from "react";

type RefType = RefObject<HTMLElement>;

export function useOnClickOutside(
  refs: RefType | RefType[],
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If we have an array of refs
      if (Array.isArray(refs)) {
        // Check if the click was outside all refs
        const clickedOutside = refs.every((ref) => {
          return ref.current && !ref.current.contains(event.target as Node);
        });

        if (clickedOutside) {
          callback();
        }
      }
      // If we have a single ref
      else if (refs.current && !refs.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
}
