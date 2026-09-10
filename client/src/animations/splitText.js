/**
 * Hand-rolled split-text utility. Wraps a node's text in line > word > char
 * elements so headline reveals can stagger by char or word and clip by line.
 * Returns a revert() that restores the original markup exactly.
 */
export function splitText(el, { chars = false } = {}) {
  if (!el) return { lines: [], words: [], chars: [], revert: () => {} };

  const original = el.innerHTML;
  const source = el.textContent.replace(/\s+/g, ' ').trim();

  el.innerHTML = '';
  const words = [];
  const charEls = [];

  source.split(' ').forEach((word, i, arr) => {
    const wordEl = document.createElement('span');
    wordEl.className = 'splitWord';
    if (chars) {
      Array.from(word).forEach((ch) => {
        const c = document.createElement('span');
        c.className = 'splitChar';
        c.textContent = ch;
        wordEl.appendChild(c);
        charEls.push(c);
      });
    } else {
      wordEl.textContent = word;
    }
    el.appendChild(wordEl);
    words.push(wordEl);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });

  /* Group words into visual lines by their offsetTop, then wrap each line in
     an overflow:hidden block so masked reveals are possible. */
  const lines = [];
  let currentTop = null;
  let currentLine = null;
  words.forEach((w) => {
    const top = Math.round(w.offsetTop);
    if (top !== currentTop) {
      currentTop = top;
      currentLine = document.createElement('span');
      currentLine.className = 'splitLine';
      lines.push(currentLine);
    }
    currentLine.appendChild(w);
  });
  lines.forEach((line) => el.appendChild(line));
  /* Re-insert inter-word spaces lost by the regroup. */
  lines.forEach((line) => {
    const kids = Array.from(line.children);
    kids.forEach((k, i) => {
      if (i < kids.length - 1) line.insertBefore(document.createTextNode(' '), kids[i + 1]);
    });
  });

  return {
    lines,
    words,
    chars: charEls,
    revert() { el.innerHTML = original; },
  };
}
