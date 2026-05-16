function createSearchEnhancer(opts) {
  const inputEl = document.getElementById(opts.inputId || 'searchInput');
  const getItems = opts.getItems;
  const matchFn = opts.matchFn;
  const scrollContainer = opts.scrollContainer || window;

  let results = [];
  let currentIdx = -1;
  let bar = null;
  let countEl = null;

  function createBar() {
    bar = document.createElement('div');
    bar.className = 'search-results-bar';
    bar.innerHTML = `
      <button class="search-nav-btn" id="searchPrev">&#9650; Prev</button>
      <span class="search-count" id="searchCount"></span>
      <button class="search-nav-btn" id="searchNext">Next &#9660;</button>
    `;
    const header = document.getElementById('site-header');
    if (header) {
      header.appendChild(bar);
    } else {
      inputEl.closest('.search-bar').after(bar);
    }
    countEl = document.getElementById('searchCount');
    document.getElementById('searchPrev').addEventListener('click', function() { navigate(-1); });
    document.getElementById('searchNext').addEventListener('click', function() { navigate(1); });
  }

  function update(query) {
    if (!bar) createBar();

    const prev = document.querySelector('.search-highlight');
    if (prev) prev.classList.remove('search-highlight');

    if (!query) {
      bar.classList.remove('visible');
      results = [];
      currentIdx = -1;
      return;
    }

    results = Array.from(getItems()).filter(function(el) { return matchFn(el, query); });

    if (results.length === 0) {
      bar.classList.add('visible');
      countEl.innerHTML = 'No results';
      document.getElementById('searchPrev').disabled = true;
      document.getElementById('searchNext').disabled = true;
      return;
    }

    bar.classList.add('visible');
    currentIdx = 0;
    jumpTo(0);
  }

  function jumpTo(idx) {
    const prev = document.querySelector('.search-highlight');
    if (prev) prev.classList.remove('search-highlight');

    currentIdx = idx;
    const el = results[idx];
    el.classList.add('search-highlight');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    countEl.innerHTML = '<span class="current">' + (idx + 1) + '</span> / ' + results.length;
    document.getElementById('searchPrev').disabled = idx === 0;
    document.getElementById('searchNext').disabled = idx === results.length - 1;
  }

  function navigate(dir) {
    if (results.length === 0) return;
    const next = currentIdx + dir;
    if (next < 0 || next >= results.length) return;
    jumpTo(next);
  }

  inputEl.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    update(q);
  });

  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      navigate(e.shiftKey ? -1 : 1);
    }
  });

  return { update: update, navigate: navigate };
}
