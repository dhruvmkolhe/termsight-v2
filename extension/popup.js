document.addEventListener('DOMContentLoaded', async () => {
  const pageTitleEl = document.getElementById('pageTitle');
  const btnScan = document.getElementById('btnScan');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    pageTitleEl.textContent = tab.title || tab.url || 'Current Webpage';
  }

  btnScan.addEventListener('click', async () => {
    btnScan.textContent = 'Extracting…';
    try {
      chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_TERMS' }, (response) => {
        if (!response || !response.text) {
          pageTitleEl.textContent = 'Could not extract text. Opening app...';
        }
        
        // Open TermSight web app with scraped text in session/hash or URL parameter
        const appUrl = 'http://localhost:5173';
        chrome.tabs.create({ url: `${appUrl}?url=${encodeURIComponent(tab.url)}` });
      });
    } catch (e) {
      chrome.tabs.create({ url: `http://localhost:5173?url=${encodeURIComponent(tab.url)}` });
    }
  });
});
