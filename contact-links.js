(() => {
  const update = () => {
    const lang = document.documentElement.lang === 'de' ? 'de' : 'en';
    document.querySelectorAll('[data-bw-contact]').forEach(a => {
      a.textContent = lang === 'de' ? 'Kontaktformular' : 'Contact form';
      a.href = 'kontakt.html?lang=' + lang;
    });
  };
  update();
  new MutationObserver(update).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
})();
