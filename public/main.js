const btn = document.getElementById('shortenBtn');
const input = document.getElementById('urlInput');
const resultContainer = document.getElementById('result');
const shortInput = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const historyList = document.getElementById('history');

function loadHistory() {
  const items = JSON.parse(localStorage.getItem('history') || '[]');
  items.forEach(addHistoryItem);
}

function saveHistory(items) {
  localStorage.setItem('history', JSON.stringify(items));
}

function addHistoryItem(item) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = item.short;
  a.textContent = `${item.short} → ${item.url}`;
  a.target = '_blank';
  li.appendChild(a);
  historyList.prepend(li);
}

async function shorten() {
  const url = input.value.trim();
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  const res = await fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (res.ok) {
    const data = await res.json();
    const shortUrl = `${location.origin}/${data.slug}`;
    shortInput.value = shortUrl;
    resultContainer.classList.remove('hidden');

    const items = JSON.parse(localStorage.getItem('history') || '[]');
    const item = { short: shortUrl, url };
    items.unshift(item);
    items.splice(5);
    saveHistory(items);
    addHistoryItem(item);
  } else {
    alert('Error shortening URL');
  }
}

btn.addEventListener('click', shorten);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') shorten();
});

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key.toLowerCase() === 's') {
    e.preventDefault();
    shorten();
  }
  if (e.ctrlKey && e.key.toLowerCase() === 'c' && !resultContainer.classList.contains('hidden')) {
    e.preventDefault();
    copyBtn.click();
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(shortInput.value);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1000);
});

const dot = document.getElementById('cursor-dot');
document.addEventListener('mousemove', e => {
  dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

loadHistory();
