/* Knowledge hub: client-side search and filtering over server-rendered cards. */
(function () {
  'use strict';
  var grid = document.getElementById('kn-grid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.article-card'));
  var search = document.getElementById('kn-search');
  var author = document.getElementById('kn-author');
  var count = document.getElementById('kn-count');
  var empty = document.getElementById('kn-empty');
  var pills = Array.prototype.slice.call(document.querySelectorAll('.pill[data-cat]'));
  var premiumPill = document.querySelector('.pill[data-premium]');
  var featured = grid.querySelector('.article-card--featured');

  var state = { q: '', cat: '', author: '', premium: false };

  // Restore state from the URL (?q=…&category=…&author=…&premium=1) so filtered views are linkable.
  var params = new URLSearchParams(location.search);
  state.q = params.get('q') || '';
  state.cat = params.get('category') || '';
  state.author = params.get('author') || '';
  state.premium = params.get('premium') === '1';

  function sync() {
    search.value = state.q;
    author.value = state.author;
    pills.forEach(function (p) { p.setAttribute('aria-pressed', String(p.dataset.cat === state.cat)); });
    premiumPill.setAttribute('aria-pressed', String(state.premium));
  }

  function apply() {
    var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    var filtering = terms.length || state.cat || state.author || state.premium;
    cards.forEach(function (c) {
      var hay = c.dataset.search || '';
      var ok = (!state.cat || c.dataset.category === state.cat) &&
               (!state.author || c.dataset.author === state.author) &&
               (!state.premium || c.querySelector('.badge-premium')) &&
               terms.every(function (t) { return hay.indexOf(t) !== -1; });
      c.hidden = !ok;
      if (ok) shown++;
    });
    // The large "featured" treatment only makes sense on the unfiltered view.
    if (featured) featured.classList.toggle('article-card--featured', !filtering);
    count.textContent = shown + (shown === 1 ? ' article' : ' articles');
    empty.hidden = shown !== 0;

    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.cat) p.set('category', state.cat);
    if (state.author) p.set('author', state.author);
    if (state.premium) p.set('premium', '1');
    var qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  search.addEventListener('input', function () { state.q = search.value.trim(); apply(); });
  author.addEventListener('change', function () { state.author = author.value; apply(); });
  pills.forEach(function (p) {
    p.addEventListener('click', function () { state.cat = p.dataset.cat; sync(); apply(); });
  });
  premiumPill.addEventListener('click', function () { state.premium = !state.premium; sync(); apply(); });
  document.getElementById('kn-reset').addEventListener('click', function () {
    state = { q: '', cat: '', author: '', premium: false }; sync(); apply(); search.focus();
  });

  sync();
  apply();
})();
