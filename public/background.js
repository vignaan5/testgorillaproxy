chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    const blob = new Blob([request.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webpage_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
});