import { useEffect } from 'react';

const SUFFIX = 'Yash Rokad';

/** Keeps the document title in sync with the active route. */
export default function usePageTitle(title) {
  useEffect(() => {
    if (!title) return;
    document.title = title.includes(SUFFIX) ? title : `${title} — ${SUFFIX}`;
  }, [title]);
}
