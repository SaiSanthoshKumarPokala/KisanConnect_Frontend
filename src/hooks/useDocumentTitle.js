import { useEffect } from "react";

export default function useDocumentTitle(title, suffix = "Kisan Connect") {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${suffix}` : suffix;

    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
}