'use strict';
(() => {
  const words = {"de": {"eyebrow": "DIREKTER KONTAKT", "heading": "Wobei können wir helfen?", "intro": "Beschreiben Sie kurz Ihre Aufgabe und das gewünschte Ergebnis. Eine Telefonnummer ist nicht erforderlich.", "directHeading": "Direkt per Mail anfragen", "contactNote": "Lieber per E-Mail? Unter dieser Adresse erreichen Sie uns auch direkt.", "formHeading": "Ihre Anfrage an BridgeWork", "formIntro": "Personalbedarf, Bewerbung, Google Ads oder Automatisierung: Schildern Sie uns Ihr Anliegen. Wir melden uns per E-Mail bei Ihnen.", "formLanguage": "Das Formular ist auf Deutsch und Englisch beschriftet.", "formDetails": "Name und Firma sind freiwillig.", "formPrivacy": "Beim Laden des Formulars verbinden Sie sich mit Google. Ihre Angaben werden in unserem geschäftlichen Google-Workspace-Konto gespeichert.", "loadForm": "Formular hier laden", "openForm": "In Google Forms öffnen", "formSafety": "Bewerbungsunterlagen stimmen wir separat mit Ihnen ab.", "privacyLink": "Datenschutz", "alternative": "Sie erreichen uns auch direkt per Mail:", "legal": "Impressum", "packageHeading": "Paket unverbindlich anfragen", "packagePrompt": "Wählen Sie das passende Paket für Ihre E-Mail-Anfrage.", "packageNote": "Der E-Mail-Entwurf benennt das Paket und seinen Umfang. Ihre Anfrage ist keine Bestellung.", "selectedPrefix": "Ausgewähltes Paket: ", "package299": "299 EUR netto · Zehn DE/EN-Akten mit Originalfragebögen", "package590": "590 EUR netto · Vollständiger DE/EN-Intake", "generalFormNote": "Für eine Paket-Anfrage nutzen Sie bitte den passenden E-Mail-Link oben. Das bestehende Formular bleibt für allgemeine Anliegen verfügbar."}, "en": {"eyebrow": "DIRECT CONTACT", "heading": "Tell us what you need.", "intro": "Briefly describe your task and the result you need. No phone number is required.", "directHeading": "Email us directly", "contactNote": "Prefer email? You can also contact us directly at this address.", "formHeading": "Your enquiry to BridgeWork", "formIntro": "Staffing needs, applications, Google Ads or automation: tell us what you need. We will get back to you by email.", "formLanguage": "The form is labelled in German and English.", "formDetails": "Name and company are optional.", "loadForm": "Load form here", "openForm": "Open in Google Forms", "formPrivacy": "Loading the form connects you to Google. Your details are stored in our business Google Workspace account.", "privacyLink": "Privacy policy", "formSafety": "We will arrange application documents with you separately.", "alternative": "You can also email us directly:", "legal": "Legal notice", "packageHeading": "Enquire about a package", "packagePrompt": "Choose the package for your email enquiry.", "packageNote": "The email draft identifies the package and its scope. Your enquiry is not an order.", "selectedPrefix": "Selected package: ", "package299": "EUR 299 net · Ten DE/EN files with original questionnaires", "package590": "EUR 590 net · Complete DE/EN intake", "generalFormNote": "For a package enquiry, please use the matching email link above. The existing form remains available for general enquiries."}};
  const subjects = {"de": {"299": "Unverbindliche Anfrage: 299 EUR netto – DE/EN-Bewerberakten", "590": "Unverbindliche Anfrage: 590 EUR netto – DE/EN-Intake"}, "en": {"299": "Non-binding enquiry: EUR 299 net – DE/EN candidate files", "590": "Non-binding enquiry: EUR 590 net – DE/EN intake"}};
  const bodies = {"de": {"299": "Guten Tag BridgeWork Germany,\n\nich interessiere mich für das Paket zur Auswertung von genau zehn vorhandenen DE/EN-Bewerberakten einschließlich der zugehörigen Originalfragebögen für 299 EUR netto. Bitte stimmen Sie Eingaben, Umfang und Abnahmekriterien vor einem Auftrag mit mir ab.\n\nMeine Aufgabe und mein gewünschtes Ergebnis:\n", "590": "Guten Tag BridgeWork Germany,\n\nich interessiere mich für den vollständigen abgestimmten DE/EN-Intake in meinem bestehenden Konto für 590 EUR netto. Bitte stimmen Sie konkrete Felder, Eingaben, Zugang und Abnahmekriterien vor einem Auftrag mit mir ab.\n\nMeine Aufgabe und mein gewünschtes Ergebnis:\n"}, "en": {"299": "Hello BridgeWork Germany,\n\nI am interested in the evaluation of exactly ten existing DE/EN candidate files and their associated original questionnaires for EUR 299 net. Please agree the inputs, scope and acceptance criteria with me before an order.\n\nMy task and desired outcome:\n", "590": "Hello BridgeWork Germany,\n\nI am interested in the complete, agreed DE/EN intake in my existing account for EUR 590 net. Please agree the specific fields, inputs, access and acceptance criteria with me before an order.\n\nMy task and desired outcome:\n"}};
  const query = new URLSearchParams(location.search);
  const requestedLanguage = query.get('lang');
  const lang = requestedLanguage === 'de' || requestedLanguage === 'en'
    ? requestedLanguage : (document.documentElement.lang === 'en' ? 'en' : 'de');
  const value = query.get('package');
  const selected = value === '299' || value === '590' ? value : null;
  const copy = words[lang];
  document.documentElement.lang = lang;
  document.title = (lang === 'de' ? 'Kontakt' : 'Contact') + ' | BridgeWork Germany';
  document.querySelectorAll('[data-key]').forEach(el => {
    if (Object.prototype.hasOwnProperty.call(copy, el.dataset.key)) el.textContent = copy[el.dataset.key];
  });
  const mail = pack => 'mailto:kontakt@bridgework-germany.de?subject=' +
    encodeURIComponent(subjects[lang][pack]) + '&body=' + encodeURIComponent(bodies[lang][pack]);
  document.querySelectorAll('[data-package-link]').forEach(link => {
    const pack = link.dataset.packageLink;
    if (pack !== '299' && pack !== '590') return;
    link.href = mail(pack);
    if (pack === selected) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  if (selected) {
    const title = document.querySelector('[data-package-title]');
    if (title) title.textContent = copy.selectedPrefix + copy['package' + selected];
    document.querySelectorAll('a[href^="mailto:kontakt@bridgework-germany.de"]:not([data-package-link])')
      .forEach(link => { link.href = mail(selected); });
  }
  const switcher = document.getElementById('language');
  if (switcher) {
    const other = lang === 'de' ? 'en' : 'de';
    const next = new URL(other === 'en' ? '/en/kontakt.html' : '/kontakt.html', location.origin);
    next.searchParams.set('lang', other);
    if (selected) next.searchParams.set('package', selected);
    switcher.href = next.pathname + next.search;
    switcher.textContent = other === 'en' ? 'English' : 'Deutsch';
  }
  document.querySelectorAll('a[href*="datenschutz.html"],a[href*="impressum.html"]').forEach(link => {
    const url = new URL(link.href, location.href); url.searchParams.set('lang', lang); link.href = url.href;
  });
  // No fetch, form prefill/submission, booking, payment or claim of receipt.
})();
