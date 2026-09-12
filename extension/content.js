// TermSight Content Script: Extracts visible legal text from webpage
function extractPageTermsText() {
  // Check if there is an article, main, or legal container
  const mainEl = document.querySelector('article, main, .terms, .privacy, .legal-content, [role="main"]') || document.body;
  if (!mainEl) return '';

  const clone = mainEl.cloneNode(true);
  // Remove non-content elements
  const elementsToRemove = clone.querySelectorAll('script, style, svg, noscript, nav, header, footer, iframe, form');
  elementsToRemove.forEach(el => el.remove());

  let text = clone.innerText || clone.textContent || '';
  return text.trim();
}

chrome.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_TERMS') {
    const text = extractPageTermsText();
    sendResponse({
      title: document.title || 'Extracted Terms',
      url: window.location.href,
      text: text.slice(0, 60000),
      length: text.length
    });
  }
});
