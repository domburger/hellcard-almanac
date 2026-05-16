(function() {
  const PAGES = [
    { id: 'home', label: 'HOME', href: 'index.html' },
    { id: 'deckbuilder', label: 'BUILDER', href: 'deckbuilder.html' },
    {
      id: 'evolution-trees',
      label: 'EVOLUTIONS',
      href: 'evolutions.html',
      dropdown: [
        { cls: 'warrior', label: 'Warrior', href: 'evolutions.html?class=warrior' },
        { cls: 'bruja', label: 'Bruja', href: 'evolutions.html?class=bruja' },
        { cls: 'tinkerer', label: 'Tinkerer', href: 'evolutions.html?class=tinkerer' },
        { cls: 'rogue', label: 'Rogue', href: 'evolutions.html?class=rogue' },
        { cls: 'mage', label: 'Mage', href: 'evolutions.html?class=mage' }
      ]
    },
    {
      id: 'starter-artifacts',
      label: 'STARTERS',
      href: 'starter_artifacts.html',
      dropdown: [
        { cls: 'warrior', label: 'Warrior', href: 'starter_artifacts.html?class=warrior' },
        { cls: 'bruja', label: 'Bruja', href: 'starter_artifacts.html?class=bruja' },
        { cls: 'tinkerer', label: 'Tinkerer', href: 'starter_artifacts.html?class=tinkerer' },
        { cls: 'rogue', label: 'Rogue', href: 'starter_artifacts.html?class=rogue' },
        { cls: 'mage', label: 'Mage', href: 'starter_artifacts.html?class=mage' }
      ]
    },
    {
      id: 'cards',
      label: 'CARDS',
      href: 'cards.html',
      dropdown: [
        { cls: 'warrior', label: 'Warrior', href: 'cards.html?class=warrior' },
        { cls: 'bruja', label: 'Bruja', href: 'cards.html?class=bruja' },
        { cls: 'tinkerer', label: 'Tinkerer', href: 'cards.html?class=tinkerer' },
        { cls: 'rogue', label: 'Rogue', href: 'cards.html?class=rogue' },
        { cls: 'mage', label: 'Mage', href: 'cards.html?class=mage' }
      ]
    },
    { id: 'artifacts', label: 'ARTIFACTS', href: 'artifacts.html' },
    { id: 'enemies', label: 'ENEMIES', href: 'enemies.html' },
    { id: 'locations', label: 'LOCATIONS', href: 'locations.html' },
    { id: 'guide', label: 'GUIDE', href: 'guide.html' }
  ];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(page) {
    return currentPage === page.href.split('?')[0];
  }

  const banner = document.createElement('div');
  banner.className = 'site-banner';
  banner.innerHTML = '<img src="https://static.wikia.nocookie.net/hellcard/images/e/e6/Site-logo.png/revision/latest?cb=20240917182248" alt="Hellcard"><h1>HELLCARD ALMANAC<span class="subtitle">COMMUNITY REFERENCE</span></h1>';

  const nav = document.createElement('nav');
  nav.className = 'site-nav';

  for (const page of PAGES) {
    const item = document.createElement('div');
    item.className = 'nav-item';

    const active = isActive(page);
    const hasDropdown = page.dropdown && page.dropdown.length > 0;

    if (active && hasDropdown) {
      const btn = document.createElement('button');
      btn.className = 'nav-link active';
      btn.textContent = page.label;
      item.appendChild(btn);

      // Build class bar (rendered after nav is inserted)
      const classBar = document.createElement('div');
      classBar.className = 'class-bar';
      classBar.id = page.id + '-classbar';

      for (const sub of page.dropdown) {
        const cbtn = document.createElement('button');
        cbtn.className = sub.cls;
        cbtn.dataset.class = sub.cls;
        cbtn.textContent = sub.label;
        cbtn.addEventListener('click', function() {
          if (typeof switchClass === 'function') {
            switchClass(sub.cls);
          } else {
            window.location.href = sub.href;
          }
        });
        classBar.appendChild(cbtn);
      }
      // Store for later insertion
      item._classBar = classBar;
    } else if (hasDropdown) {
      const link = document.createElement('a');
      link.className = 'nav-link';
      link.href = page.href;
      link.innerHTML = page.label + ' <span class="arrow">&#9660;</span>';
      item.appendChild(link);

      const dd = document.createElement('div');
      dd.className = 'nav-dropdown';
      for (const sub of page.dropdown) {
        const a = document.createElement('a');
        a.className = 'dropdown-item ' + sub.cls;
        a.href = sub.href;
        a.innerHTML = '<span class="dot"></span>' + sub.label;
        dd.appendChild(a);
      }
      item.appendChild(dd);
    } else {
      const link = document.createElement('a');
      link.className = 'nav-link' + (active ? ' active' : '');
      link.href = page.href;
      link.textContent = page.label;
      item.appendChild(link);
    }

    nav.appendChild(item);
  }

  const target = document.getElementById('site-header');
  if (target) {
    target.prepend(nav);
    target.prepend(banner);

    // Insert class bars for active dropdown pages right after the nav
    for (const child of nav.children) {
      if (child._classBar) {
        nav.after(child._classBar);
      }
    }
  }

  window.updateClassDropdown = function(activeClass) {
    // Update class bar buttons
    const classBars = document.querySelectorAll('.class-bar');
    classBars.forEach(function(bar) {
      const items = bar.querySelectorAll('button');
      items.forEach(function(item) {
        item.classList.toggle('active-class', item.dataset.class === activeClass);
      });
    });
  };
})();
