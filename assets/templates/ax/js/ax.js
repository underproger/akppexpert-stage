/* AKPP-EXPERT — редизайн 2026. Без зависимостей (jQuery только чтобы снять старый обработчик якорей). */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement;
  html.classList.add('ax-js');

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  var desktop = window.matchMedia('(min-width: 1200px)');

  /* ---------- Шапка: состояние при скролле ---------- */
  var header = $('#axHeader');
  var totop = $('.ax-totop');
  function onScroll() {
    var y = window.pageYOffset || html.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (totop) totop.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  function headerOffset() { return header ? header.getBoundingClientRect().height + 16 : 0; }

  /* ---------- Мега-меню ---------- */
  var mega = $('#axMega');
  if (header && mega) {
    var items = $$('.ax-nav__item--mega', header);
    var closeTimer = null;
    var open = function (item) {
      clearTimeout(closeTimer);
      items.forEach(function (i) { i.classList.toggle('is-open', i === item); });
      $$('.ax-mega__col', mega).forEach(function (c) { c.classList.toggle('is-hl', c.getAttribute('data-col') === item.getAttribute('data-mega')); });
      header.classList.add('is-mega');
    };
    var close = function () {
      closeTimer = setTimeout(function () {
        header.classList.remove('is-mega');
        items.forEach(function (i) { i.classList.remove('is-open'); });
      }, 160);
    };
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () { if (desktop.matches) open(item); });
      item.addEventListener('mouseleave', function () { if (desktop.matches) close(); });
      var link = $('.ax-nav__link', item);
      link.addEventListener('focus', function () { if (desktop.matches) open(item); });
    });
    mega.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    mega.addEventListener('mouseleave', close);
    $$('.ax-nav__item:not(.ax-nav__item--mega) .ax-nav__link', header).forEach(function (l) {
      l.addEventListener('mouseenter', function () { clearTimeout(closeTimer); header.classList.remove('is-mega'); items.forEach(function (i) { i.classList.remove('is-open'); }); });
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { header.classList.remove('is-mega'); items.forEach(function (i) { i.classList.remove('is-open'); }); } });
    mega.addEventListener('focusout', function (e) { if (!mega.contains(e.relatedTarget) && !header.contains(e.relatedTarget)) close(); });
  }

  /* ---------- Язык (тач) ---------- */
  $$('.ax-lang').forEach(function (l) {
    var btn = $('.ax-lang__btn', l);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var o = l.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    doc.addEventListener('click', function () { l.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------- Мобильное меню ---------- */
  var mnav = $('#axMnav'), burger = $('.ax-burger');
  function mnavToggle(state) {
    if (!mnav) return;
    mnav.classList.toggle('is-open', state);
    mnav.setAttribute('aria-hidden', state ? 'false' : 'true');
    html.classList.toggle('ax-lock', state);
    if (burger) burger.setAttribute('aria-expanded', state ? 'true' : 'false');
  }
  if (burger) burger.addEventListener('click', function () { mnavToggle(true); });
  if (mnav) {
    $('.ax-mnav__close', mnav).addEventListener('click', function () { mnavToggle(false); });
    $$('.ax-mnav__toggle', mnav).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.closest('.ax-mnav__item'), sub = $('.ax-mnav__sub', li);
        var o = li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', o ? 'true' : 'false');
        sub.style.maxHeight = o ? sub.scrollHeight + 'px' : null;
      });
    });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { if (a.hash && a.pathname === location.pathname) mnavToggle(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') mnavToggle(false); });
    desktop.addEventListener && desktop.addEventListener('change', function (e) { if (e.matches) mnavToggle(false); });
  }

  /* ---------- Плавный скролл к якорям (с учётом фиксированной шапки) ---------- */
  function scrollToEl(el) {
    var top = el.getBoundingClientRect().top + (window.pageYOffset || html.scrollTop) - headerOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }
  function findConsultTarget() { return $('#contacts') || $('#conract'); }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    if (a.hasAttribute('data-ax-consult')) {
      var t = findConsultTarget();
      if (t) { e.preventDefault(); mnavToggle(false); header && header.classList.remove('is-mega'); scrollToEl(t); }
      return;
    }
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#' && href.length > 1) {
      var el = null;
      try { el = doc.querySelector(href); } catch (err) { el = null; }
      if (el) { e.preventDefault(); scrollToEl(el); }
    }
  });
  if (window.jQuery) {
    // старый custom.js вешает анимацию на все a[href^="#"] без учёта шапки — снимаем
    window.jQuery(function ($j) { $j('a[href^="#"]').off('click'); });
  }

  /* ---------- Аккордеон FAQ ---------- */
  $$('.ax-acc').forEach(function (acc) {
    var btn = $('.ax-acc__btn', acc), panel = $('.ax-acc__panel', acc);
    btn.addEventListener('click', function () {
      var o = acc.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      panel.style.maxHeight = o ? panel.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Показать/скрыть (форма отзыва) ---------- */
  $$('[data-ax-toggle]').forEach(function (btn) {
    var target = doc.getElementById(btn.getAttribute('data-ax-toggle'));
    if (!target) return;
    btn.addEventListener('click', function () {
      var hidden = target.hasAttribute('hidden');
      if (hidden) target.removeAttribute('hidden'); else target.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', hidden ? 'true' : 'false');
      if (hidden) { var f = $('input[type="text"],textarea', target); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 50); }
    });
  });

  /* ---------- SEO-текст «Читать полностью» (сворачивается только в одну колонку) ---------- */
  var narrow = window.matchMedia('(max-width: 1023px)');
  $$('[data-ax-more]').forEach(function (box) {
    var btn = $('.ax-seo__more', box), text = $('.ax-seo__text', box);
    if (!btn || !text) return;
    function sync() {
      if (!narrow.matches) { btn.hidden = true; return; }
      box.classList.add('is-collapsed');
      btn.hidden = text.scrollHeight <= 440;
      if (btn.hidden) box.classList.remove('is-collapsed');
    }
    btn.addEventListener('click', function () {
      var c = box.classList.toggle('is-collapsed');
      btn.firstChild.nodeValue = c ? btn.getAttribute('data-more') : btn.getAttribute('data-less');
      if (c) scrollToEl(box);
    });
    sync();
    narrow.addEventListener && narrow.addEventListener('change', sync);
  });

  /* ---------- Слайдеры (отзывы, сотрудники): кнопки, прогресс, перетаскивание мышкой ---------- */
  $$('[data-ax-slider]').forEach(function (slider) {
    var track = $('.ax-slider__track', slider);
    var prev = $('[data-dir="-1"]', slider), next = $('[data-dir="1"]', slider);
    var bar = $('.ax-slider__bar span', slider);
    if (!track) return;
    if (!track.children.length) { slider.style.display = 'none'; return; }
    function gap() { return parseFloat(getComputedStyle(track).columnGap) || 0; }
    function step() { var card = track.firstElementChild; return card ? card.getBoundingClientRect().width + gap() : track.clientWidth; }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
      slider.classList.toggle('is-static', max <= 2);
      if (bar) {
        var vis = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
        bar.style.width = Math.max(vis * 100, 8) + '%';
        bar.style.left = (max > 0 ? (track.scrollLeft / max) * (100 - vis * 100) : 0) + '%';
      }
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);

    // перетаскивание мышкой (на тач-устройствах работает нативная прокрутка)
    var drag = null, moved = false, snapTimer = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (e.target.closest('input,textarea,select,button')) return;
      clearTimeout(snapTimer);
      drag = { x: e.clientX, left: track.scrollLeft, t: Date.now() };
      moved = false;
      track.classList.add('is-dragging', 'no-snap');
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5) moved = true;
      if (moved) { e.preventDefault(); track.scrollLeft = drag.left - dx; }
    });
    function endDrag(e) {
      if (!drag) return;
      var dx = (e && e.clientX !== undefined) ? e.clientX - drag.x : 0;
      var fast = Math.abs(dx) > 40 && Date.now() - drag.t < 250;
      drag = null;
      track.classList.remove('is-dragging');
      var s = step(), pos = track.scrollLeft / s;
      var idx = fast ? (dx < 0 ? Math.ceil(pos) : Math.floor(pos)) : Math.round(pos);
      track.scrollTo({ left: idx * s, behavior: 'smooth' });
      snapTimer = setTimeout(function () { track.classList.remove('no-snap'); }, 500);
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    update();
  });

  /* ---------- Ленивое видео ---------- */
  var videos = $$('[data-ax-lazyvideo]');
  function loadVideo(v) {
    $$('source[data-src]', v).forEach(function (s) { s.src = s.getAttribute('data-src'); s.removeAttribute('data-src'); });
    v.load();
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }

  /* ---------- Появление при скролле ---------- */
  var reveal = $$('[data-ax-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute('data-ax-lazyvideo')) { loadVideo(el); } else { el.classList.add('is-in'); }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveal.forEach(function (el, i) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 6) * 60 + 'ms';
      io.observe(el);
    });
    videos.forEach(function (v) { io.observe(v); });
  } else {
    reveal.forEach(function (el) { el.classList.add('is-in'); });
    videos.forEach(loadVideo);
  }
})();
