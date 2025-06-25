const btn = document.getElementById('shortenBtn');
const input = document.getElementById('urlInput');
const resultContainer = document.getElementById('result');
const shortInput = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');

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
  } else {
    alert('Error shortening URL');
  }
}

btn.addEventListener('click', shorten);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') shorten();
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
