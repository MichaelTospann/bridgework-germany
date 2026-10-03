'use strict';
(() => {
  const panel = document.querySelector('[data-bw-google-contact]');
  if (!panel || panel.hasAttribute('data-bw-google-initialized')) return;
  const button = panel.querySelector('[data-bw-google-load]');
  const container = document.getElementById('google-form-container');
  const status = document.getElementById('google-form-status');
  if (!button || !container || !status) return;
  panel.setAttribute('data-bw-google-initialized', '');
  // A responder URL; never an editor URL or a DOM-supplied endpoint.
  const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSc8Wa50jVoifV7XeEdseia7otYZ_McdpZreT6_oBMTPX_ODGA/viewform';
  const language = () => document.documentElement.lang === 'de' ? 'de' : 'en';
  const words = {
    de:{load:'Formular hier laden',loading:'Formular wird geladen …',opened:'Formular geöffnet',
      pending:'Das Formular wird geladen. Sie können es auch direkt bei Google öffnen.',
      ready:'Bitte senden Sie Ihre Anfrage im geöffneten Formular ab.',
      failed:'Öffnen Sie das Formular bitte direkt bei Google oder kontaktieren Sie uns per E-Mail.',
      title:'BridgeWork Kontaktformular (Deutsch und Englisch)'},
    en:{load:'Load form here',loading:'Loading form …',opened:'Form opened',
      pending:'The form is loading. You can also open it directly at Google.',
      ready:'Please submit your enquiry in the open form.',
      failed:'Please open the form directly at Google or contact us by email.',
      title:'BridgeWork contact form (German and English)'}
  };
  let frame = null;
  let state = 'idle';
  const refresh = () => {
    const copy = words[language()];
    button.textContent = state === 'idle' ? copy.load : state === 'pending' ? copy.loading : copy.opened;
    button.hidden = state === 'failed';
    status.textContent = state === 'idle' ? '' : copy[state];
    if (frame) frame.title = copy.title;
    // Keep entered answers: language changes never reload an existing frame.
    // The questions are bilingual; hl only selects Google's own interface.
  };
  button.addEventListener('click', () => {
    if (frame) return;
    frame = document.createElement('iframe');
    frame.title = words[language()].title;
    frame.referrerPolicy = 'no-referrer';
    frame.height = '1700';
    frame.width = '100%';
    frame.addEventListener('load', () => {
      state = 'ready'; panel.setAttribute('aria-busy', 'false'); refresh();
      if (document.activeElement === button) frame.focus();
    });
    frame.addEventListener('error', () => {
      state = 'failed'; panel.setAttribute('aria-busy', 'false'); refresh();
    });
    // Only an explicit click creates this connection. No parent-page POST,
    // automatic submission, retry or claim of accepted/delivered mail.
    frame.src = formURL + '?embedded=true&hl=' + language();
    state = 'pending'; button.disabled = true;
    button.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-busy', 'true');
    container.hidden = false;
    container.append(frame);
    refresh();
  });
  new MutationObserver(refresh).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  refresh();
})();
