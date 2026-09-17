// CapitalFlow — Cookie / privacy notice banner.
// This site sets NO cookies and uses NO browser storage for tracking or
// profiling. Language and theme preferences travel only in the URL
// (?lang=, ?theme=), not in cookies or localStorage. The only thing this
// script itself stores is the fact that this notice was acknowledged —
// via localStorage, which is "strictly necessary" storage under the
// ePrivacy Directive and does not require consent.
//
// If analytics or other non-essential trackers are ever added to the
// site, gate them behind hasConsent() below, e.g.:
//   if (window.CapitalFlowCookieConsent.hasConsent()) { loadAnalytics(); }
// and change this banner to a real Accept/Reject choice at that point —
// right now there is nothing optional to accept or reject, so a single
// acknowledgment button is the honest UI, not a shortcut.

(function () {
  var STORAGE_KEY = 'cf_cookie_notice_ack';

  var LANG = (function () {
    try {
      var p = new URLSearchParams(window.location.search).get('lang');
      return p === 'en' ? 'en' : 'it';
    } catch (e) {
      return 'it';
    }
  })();

  var TXT = {
it: {
  msg: 'Questo sito non usa cookie di profilazione o di tracciamento. Usa Umami, uno strumento di analisi statistica anonimo e senza cookie, che non raccoglie dati personali. L\u2019unico dato conservato localmente \u00e8 il fatto che tu abbia visto questo avviso.',
  more: 'Maggiori informazioni',
  ack: 'Ho capito'
},
en: {
  msg: 'This site does not use profiling or tracking cookies. It uses Umami, an anonymous, cookie-less analytics tool that collects no personal data. The only thing stored locally is the fact that you\u2019ve seen this notice.',
  more: 'Learn more',
  ack: 'Got it'
}
  };

  function hasConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setConsent() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      /* localStorage unavailable (e.g. private browsing) — banner will just
         reappear next visit, which is a harmless fallback, not a bug. */
    }
  }

  function clearConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function injectStyle() {
    if (document.getElementById('cf-cookie-style')) return;
    var css = document.createElement('style');
    css.id = 'cf-cookie-style';
    css.textContent =
      '#cf-cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
      'background:var(--panel,#161c26);border-top:1px solid var(--gold-dim,#8a7238);' +
      'padding:14px 20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;' +
      'box-shadow:0 -4px 16px rgba(0,0,0,0.25);}' +
      '#cf-cookie-banner p{margin:0;font-size:12.5px;color:var(--ink-dim,#9aa3b2);' +
      'flex:1 1 380px;line-height:1.5;}' +
      '#cf-cookie-banner a{color:var(--gold,#c9a24b);text-decoration:underline;}' +
      '#cf-cookie-banner button{background:var(--gold,#c9a24b);color:#231a06;border:none;' +
      'padding:9px 18px;border-radius:3px;font-size:13px;cursor:pointer;white-space:nowrap;' +
      'font-family:inherit;}' +
      '#cf-cookie-banner button:hover{background:#d9b45f;}';
    document.head.appendChild(css);
  }

  function showBanner() {
    if (document.getElementById('cf-cookie-banner')) return;
    injectStyle();
    var t = TXT[LANG];
    var bar = document.createElement('div');
    bar.id = 'cf-cookie-banner';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie notice');
    var langParam = LANG === 'en' ? '?lang=en' : '?lang=it';
    bar.innerHTML =
      '<p>' + t.msg + ' <a href="disclaimer.html' + langParam + '#cookie">' + t.more + '</a></p>' +
      '<button id="cf-cookie-ack" type="button">' + t.ack + '</button>';
    document.body.appendChild(bar);
    document.getElementById('cf-cookie-ack').addEventListener('click', function () {
      setConsent();
      bar.remove();
    });
  }

  function init() {
    if (!hasConsent()) showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Small public API — used by the "manage preferences" link on the
  // Disclaimer page, and available for future use (e.g. gating analytics).
  window.CapitalFlowCookieConsent = {
    hasConsent: hasConsent,
    reopen: function () {
      clearConsent();
      showBanner();
    }
  };
})();
