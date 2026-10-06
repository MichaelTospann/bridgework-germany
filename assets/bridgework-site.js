'use strict';
(() => {
  const langs = ['de', 'en', 'fr', 'pl', 'sq', 'sr', 'ar', 'ru', 'es', 'ja', 'tr', 'id', 'it', 'pt', 'vi', 'zh', 'ne', 'km', 'lo', 'th', 'my', 'ur'];
  const core = ['index.html', 'housekeeping-personal.html', 'bau-handwerk-personal.html', 'logistik-spedition-personal.html', 'pflege-soziales-personal.html', 'bewerber.html'];
  const legacy = ['kontakt.html', 'jobs-housekeeping.html', 'jobs-bau-handwerk.html', 'jobs-logistik.html', 'jobs-pflege.html', 'datenschutz.html', 'impressum.html', 'google-ads-audit.html', 'automatisierung.html'];
  const names = {de:'Deutsch', en:'English', fr:'Français', pl:'Polski', sq:'Shqip', sr:'Srpski', ar:'العربية', ru:'Русский', es:'Español', ja:'日本語', tr:'Türkçe', id:'Bahasa Indonesia', it:'Italiano', pt:'Português', vi:'Tiếng Việt', zh:'中文', ne:'नेपाली', km:'ខ្មែរ', lo:'ລາວ', th:'ภาษาไทย', my:'မြန်မာ', ur:'اردو'};
  const prompts = {de:'Sprache wählen', en:'Choose language', fr:'Choisir la langue', pl:'Wybierz język', sq:'Zgjidh gjuhën', sr:'Izaberite jezik', ar:'اختر اللغة', ru:'Выбрать язык', es:'Elegir idioma', ja:'言語を選択', tr:'Dil seçin', id:'Pilih bahasa', it:'Scegli la lingua', pt:'Escolher idioma', vi:'Chọn ngôn ngữ', zh:'选择语言', ne:'भाषा छान्नुहोस्', km:'ជ្រើសរើសភាសា', lo:'ເລືອກພາສາ', th:'เลือกภาษา', my:'ဘာသာစကားရွေးပါ', ur:'زبان منتخب کریں'};
  const here = new URL(location.href);
  const pieces = here.pathname.split('/').filter(Boolean);
  const currentPrefix = langs.includes(pieces[0]) ? pieces.shift() : 'de';
  const filename = pieces.length ? pieces[pieces.length - 1] : 'index.html';
  const asked = here.searchParams.get('lang');
  // Compatibility for existing explicit ?lang=en/de links only. Never infer a
  // language from IP, browser preferences, previous storage or the visitor.
  if (asked && langs.includes(asked) && core.includes(filename)) {
    const next = new URL(here);
    next.pathname = (asked === 'de' ? '/' : '/' + asked + '/') + (filename === 'index.html' ? '' : filename);
    next.searchParams.delete('lang');
    if (next.href !== here.href) { location.replace(next.href); return; }
  }

  const currentLanguage = () => langs.includes(document.documentElement.lang) ? document.documentElement.lang : currentPrefix;
  const pagePath = (page, code) => (code === 'de' ? '/' : '/' + code + '/') + (page === 'index.html' ? '' : page);
  const flagImage = (code, className) => {
    const img = document.createElement('img');
    img.className = className;
    img.setAttribute('src', '/assets/flags/' + code + '.svg');
    img.setAttribute('alt', ''); img.setAttribute('aria-hidden', 'true');
    img.setAttribute('width', '24'); img.setAttribute('height', '18');
    if (className === 'bw-language-flag') {
      img.setAttribute('loading', 'lazy'); img.setAttribute('decoding', 'async');
    }
    return img;
  };
  // Legacy DE/EN text buttons retain their nodes, IDs and existing listeners.
  // The flag control adds real links; it never selects a language on its own.
  if (legacy.includes(filename) && !document.querySelector('.bw-language-flags')) {
    const button = document.querySelector('#langBtn') || document.querySelector('#language');
    const nav = button?.closest('nav');
    if (button && nav) {
      let controls = button.closest('.bw-language-controls');
      if (!controls) {
        controls = document.createElement('div'); controls.className = 'bw-language-controls';
        // Outside .nav-links, so the original full text button stays visible
        // next to the new flag control on narrow screens too.
        nav.append(controls); controls.append(button);
      }
      const menu = document.createElement('details'); menu.className = 'lang-menu bw-language-flags';
      const summary = document.createElement('summary');
      const currentFlag = flagImage(currentLanguage(), 'bw-current-flag');
      currentFlag.setAttribute('data-bw-current-flag', ''); summary.append(currentFlag);
      const chevron = document.createElement('span'); chevron.className = 'lang-chevron';
      chevron.setAttribute('aria-hidden', 'true'); chevron.textContent = '⌄'; summary.append(chevron);
      const options = document.createElement('div'); options.className = 'bw-language-switch';
      langs.forEach(code => {
        const link = document.createElement('a');
        if (code === 'de' || code === 'en') {
          const destination = new URL(location.href);
          destination.pathname = '/' + filename; destination.searchParams.set('lang', code);
          link.setAttribute('href', destination.pathname + destination.search + destination.hash);
        } else {
          link.setAttribute('href', pagePath(filename.startsWith('jobs-') ? 'bewerber.html' : 'index.html', code));
        }
        link.setAttribute('hreflang', code); link.setAttribute('lang', code);
        const label = document.createElement('span'); label.textContent = names[code];
        link.append(flagImage(code, 'bw-language-flag'), label); options.append(link);
      });
      menu.append(summary, options); controls.append(menu);
      // The old duplicate abbreviated mobile toggle remains in the DOM, but
      // the full text button above now covers both desktop and mobile.
      const duplicate = document.querySelector('#langBtnMobile');
      if (duplicate && duplicate !== button) duplicate.hidden = true;
    }
  }
  const menus = [...document.querySelectorAll('.lang-menu')];
  const homeLinks = [...document.querySelectorAll('[data-bw-home]')];
  const homeLabels = {de:'Startseite', en:'Home', fr:'Accueil', pl:'Strona główna', sq:'Faqja kryesore', sr:'Početna stranica', ar:'الصفحة الرئيسية', ru:'Главная', es:'Inicio', ja:'ホーム', tr:'Ana sayfa', id:'Beranda', it:'Pagina iniziale', pt:'Início', vi:'Trang chủ', zh:'首页', ne:'गृहपृष्ठ', km:'ទំព័រដើម', lo:'ໜ້າຫຼັກ', th:'หน้าแรก', my:'ပင်မစာမျက်နှာ', ur:'صفحۂ اول'};
  const syncPageLanguage = () => {
    const code = currentLanguage();
    menus.forEach(menu => {
      const summary = menu.querySelector('summary');
      summary?.setAttribute('aria-label', prompts[code] + ': ' + names[code]);
      summary?.setAttribute('title', names[code]);
      const label = summary?.querySelector('[data-bw-current-language]');
      if (label && label.textContent !== names[code]) label.textContent = names[code];
      const flag = summary?.querySelector('[data-bw-current-flag]');
      if (flag) flag.setAttribute('src', '/assets/flags/' + code + '.svg');
      menu.querySelectorAll('a[hreflang]').forEach(link => {
        if (link.getAttribute('hreflang') === code) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    });
    homeLinks.forEach(link => {
      link.setAttribute('href', pagePath('index.html', code));
      link.setAttribute('aria-label', 'BridgeWork Germany — ' + homeLabels[code]);
    });
    // Existing legacy content may insert new topic links during translation.
    // Language-option destinations always remain explicit and untouched.
    if (!homeLinks.length) return;
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.getAttribute('data-bw-home') !== null || link.closest('.bw-language-switch') || link.classList.contains('lang-toggle')) return;
      let target;
      try { target = new URL(link.getAttribute('href'), location.href); } catch { return; }
      if (target.origin !== location.origin) return;
      const name = target.pathname.split('/').filter(Boolean).at(-1) || 'index.html';
      if (core.includes(name)) {
        target.pathname = pagePath(name, code); target.searchParams.delete('lang');
      } else if (name.startsWith('jobs-') || ['kontakt.html','impressum.html','datenschutz.html'].includes(name)) {
        target.searchParams.set('lang', code === 'de' ? 'de' : 'en');
      } else return;
      link.setAttribute('href', target.pathname + target.search + target.hash);
    });
  };
  syncPageLanguage();
  if (menus.length || homeLinks.length) {
    new MutationObserver(syncPageLanguage).observe(document.documentElement, {attributes:true, attributeFilter:['lang'], childList:true, subtree:true});
  }
  menus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) menus.forEach(other => { if (other !== menu) other.open = false; });
  }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    menus.forEach(menu => {
      if (menu.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
    });
    document.querySelectorAll('.nav-dropdown.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('a')?.setAttribute('aria-expanded', 'false');
    });
  });
  const closeOutside = event => {
    menus.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
    document.querySelectorAll('.nav-dropdown.open').forEach(item => {
      if (!item.contains(event.target)) {
        item.classList.remove('open');
        item.querySelector('a')?.setAttribute('aria-expanded', 'false');
      }
    });
  };
  document.addEventListener('pointerdown', closeOutside);
  document.addEventListener('click', closeOutside);
  // Preserve the original industry's dropdown interaction after removing the
  // legacy language-mutating inline script from static language editions.
  document.querySelectorAll('.nav-dropdown > a').forEach(link => {
    link.removeAttribute('onclick');
    link.addEventListener('click', event => {
      if (matchMedia('(hover: none)').matches) {
        event.preventDefault();
        const item = link.parentElement;
        item.classList.toggle('open');
        link.setAttribute('aria-expanded', String(item.classList.contains('open')));
      }
    });
  });

  const consentCopies = {
    de:['Optionale Statistik','Mit Ihrer Einwilligung verwenden wir Google Analytics, um die Nutzung dieser Website zu verstehen.','Statistik erlauben','Nur notwendige Funktionen','Statistik-Einstellungen'],
    en:['Optional analytics','With your consent, we use Google Analytics to understand how this website is used.','Allow analytics','Essential functions only','Analytics preferences'],
    fr:['Statistiques facultatives','Avec votre consentement, nous utilisons Google Analytics pour comprendre l’utilisation de ce site.','Autoriser les statistiques','Fonctions nécessaires uniquement','Préférences statistiques'],
    pl:['Opcjonalne statystyki','Za Twoją zgodą używamy Google Analytics, aby zrozumieć korzystanie z tej strony.','Zezwól na statystyki','Tylko niezbędne funkcje','Ustawienia statystyk'],
    sq:['Statistika opsionale','Me pëlqimin tuaj përdorim Google Analytics për të kuptuar përdorimin e kësaj faqeje.','Lejo statistikat','Vetëm funksionet e nevojshme','Cilësimet e statistikave'],
    sr:['Opciona statistika','Uz vašu saglasnost koristimo Google Analytics da razumemo korišćenje ovog sajta.','Dozvoli statistiku','Samo neophodne funkcije','Podešavanja statistike'],
    ar:['إحصاءات اختيارية','بموافقتك نستخدم Google Analytics لفهم كيفية استخدام هذا الموقع.','السماح بالإحصاءات','الوظائف الضرورية فقط','إعدادات الإحصاءات'],
    ru:['Необязательная статистика','С вашего согласия мы используем Google Analytics, чтобы понять, как используется этот сайт.','Разрешить статистику','Только необходимые функции','Настройки статистики'],
    es:['Estadísticas opcionales','Con tu consentimiento, utilizamos Google Analytics para comprender cómo se utiliza este sitio.','Permitir estadísticas','Solo funciones necesarias','Preferencias de estadísticas'],
    ja:['任意のアクセス解析','同意いただいた場合に、Google Analytics を使用して、このサイトの利用状況を把握します。','アクセス解析を許可','必要な機能のみ','アクセス解析の設定'],
    tr:['İsteğe bağlı analiz','Onayınızla, bu web sitesinin nasıl kullanıldığını anlamak için Google Analytics kullanıyoruz.','Analize izin ver','Yalnızca gerekli işlevler','Analiz tercihleri'],
    id:['Analisis opsional','Dengan persetujuan Anda, kami menggunakan Google Analytics untuk memahami penggunaan situs ini.','Izinkan analisis','Hanya fungsi yang diperlukan','Preferensi analisis'],
    it:['Statistiche facoltative','Con il tuo consenso usiamo Google Analytics per capire come viene utilizzato questo sito.','Consenti statistiche','Solo funzioni necessarie','Preferenze statistiche'],
    pt:['Estatísticas opcionais','Com o seu consentimento, usamos o Google Analytics para compreender a utilização deste site.','Permitir estatísticas','Apenas funções necessárias','Preferências de estatísticas'],
    vi:['Thống kê tùy chọn','Với sự đồng ý của bạn, chúng tôi sử dụng Google Analytics để hiểu cách trang web này được sử dụng.','Cho phép thống kê','Chỉ chức năng cần thiết','Tùy chọn thống kê'],
    zh:['可选统计','经您同意，我们使用 Google Analytics 了解本网站的使用情况。','允许统计','仅必要功能','统计偏好设置'],
    ne:['वैकल्पिक तथ्याङ्क','तपाईंको सहमतिमा यो वेबसाइट कसरी प्रयोग हुन्छ बुझ्न हामी Google Analytics प्रयोग गर्छौँ।','तथ्याङ्क अनुमति दिनुहोस्','आवश्यक कार्य मात्र','तथ्याङ्क प्राथमिकता'],
    km:['ស្ថិតិជាជម្រើស','ដោយមានការយល់ព្រមរបស់អ្នក យើងប្រើ Google Analytics ដើម្បីយល់ពីការប្រើប្រាស់គេហទំព័រនេះ។','អនុញ្ញាតស្ថិតិ','មុខងារចាំបាច់តែប៉ុណ្ណោះ','ការកំណត់ស្ថិតិ'],
    lo:['ສະຖິຕິທາງເລືອກ','ເມື່ອທ່ານຍິນຍອມ ພວກເຮົາໃຊ້ Google Analytics ເພື່ອເຂົ້າໃຈການໃຊ້ເວັບໄຊນີ້.','ອະນຸຍາດສະຖິຕິ','ສະເພາະຟັງຊັນທີ່ຈຳເປັນ','ການຕັ້ງຄ່າສະຖິຕິ'],
    th:['สถิติทางเลือก','เมื่อคุณยินยอม เราใช้ Google Analytics เพื่อทำความเข้าใจการใช้งานเว็บไซต์นี้','อนุญาตสถิติ','เฉพาะฟังก์ชันที่จำเป็น','การตั้งค่าสถิติ'],
    my:['ရွေးချယ်နိုင်သော စာရင်းအင်း','သင်၏ သဘောတူညီချက်ဖြင့် ဤဝက်ဘ်ဆိုက် အသုံးပြုမှုကို နားလည်ရန် Google Analytics ကို အသုံးပြုပါသည်။','စာရင်းအင်းကို ခွင့်ပြုမည်','လိုအပ်သော လုပ်ဆောင်ချက်များသာ','စာရင်းအင်း ဆက်တင်များ'],
    ur:['اختیاری اعداد و شمار','آپ کی رضامندی سے ہم اس ویب سائٹ کے استعمال کو سمجھنے کے لیے Google Analytics استعمال کرتے ہیں۔','اعداد و شمار کی اجازت دیں','صرف ضروری افعال','اعداد و شمار کی ترجیحات']
  };
  // Preserve the two existing digital-service pages' promise of no analytics.
  const production = ['https://bridgework-germany.de', 'https://www.bridgework-germany.de'].includes(location.origin)
    && !['automatisierung.html', 'google-ads-audit.html'].includes(filename);
  const consentKey = 'bw_analytics_consent';
  const safeRead = () => { try { return localStorage.getItem(consentKey); } catch { return null; } };
  const safeWrite = value => { try { localStorage.setItem(consentKey, value); } catch { /* Work for this page without storage. */ } };
  let accepted = safeRead() === 'accepted';
  let started = false;
  let banner, preferences;
  const syncConsentLanguage = () => {
    const copy = consentCopies[currentLanguage()];
    if (banner) {
      banner.setAttribute('aria-label', copy[0]);
      banner.querySelector('h2').textContent = copy[0];
      banner.querySelector('p').textContent = copy[1];
      banner.querySelectorAll('button').forEach((button, index) => { button.textContent = copy[index + 2]; });
    }
    if (preferences) preferences.textContent = copy[4];
  };
  function google() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
  const startAnalytics = () => {
    if (!production || !accepted || started) return;
    started = true;
    window['ga-disable-G-MRHHB7GQGB'] = false;
    google('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    google('consent', 'update', {analytics_storage:'granted'});
    google('js', new Date());
    // External path segments can contain personal identifiers too. Retain
    // only a web origin, never credentials, paths, queries or fragments.
    const referrer = (() => { try { const ref = new URL(document.referrer); return ['https:', 'http:'].includes(ref.protocol) ? ref.origin : ''; } catch { return ''; } })();
    google('config', 'G-MRHHB7GQGB', {page_location:location.origin + location.pathname, page_referrer:referrer, allow_google_signals:false, allow_ad_personalization_signals:false});
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-MRHHB7GQGB';
    document.head.append(tag);
  };
  const el = (tag, text, cls) => { const node=document.createElement(tag); if(text)node.textContent=text; if(cls)node.className=cls; return node; };
  const choose = value => {
    accepted = value === 'accepted';
    safeWrite(value);
    if (banner) banner.hidden = true;
    if (accepted) startAnalytics();
    else if (started) {
      // Stop collection immediately, including a Google script still loading.
      // The subsequent reload also removes the loaded tag and its listeners.
      window['ga-disable-G-MRHHB7GQGB'] = true;
      google('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      // Expire first-party GA identifiers after withdrawing analytics consent.
      document.cookie.split(';').forEach(entry => {
        const name = entry.trim().split('=')[0];
        if (!/^_ga(?:_|$)/.test(name)) return;
        ['', location.hostname, '.'+location.hostname, 'bridgework-germany.de', '.bridgework-germany.de'].forEach(domain => {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? '; Domain='+domain : ''}`;
        });
      });
      location.reload();
    }
  };
  const showPreferences = () => {
    if (banner) { syncConsentLanguage(); banner.hidden=false; banner.querySelector('button')?.focus(); return; }
    const copy = consentCopies[currentLanguage()];
    banner=el('aside',null,'bw-consent');
    banner.setAttribute('aria-label',copy[0]);
    banner.append(el('h2',copy[0]),el('p',copy[1]));
    const buttons=el('div',null,'bw-consent-actions');
    const yes=el('button',copy[2]); yes.type='button'; yes.addEventListener('click',()=>choose('accepted'));
    const no=el('button',copy[3]); no.type='button'; no.addEventListener('click',()=>choose('declined'));
    buttons.append(yes,no);banner.append(buttons);document.body.append(banner);
  };
  // Do not load analytics or show the consent prompt on the local preview.
  if (production) {
    if (accepted) startAnalytics();
    else if (!safeRead()) showPreferences();
    preferences=el('button',consentCopies[currentLanguage()][4],'bw-consent-preferences');preferences.type='button';preferences.addEventListener('click',showPreferences);
    (document.querySelector('footer') || document.body).append(preferences);
    new MutationObserver(syncConsentLanguage).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  }
  document.addEventListener('click', event => {
    if (!production || !accepted || !started) return;
    const link=event.target.closest('a');
    if (!link) return;
    const href=link.getAttribute('href') || '';
    const lang=currentLanguage();
    // Only event categories; no names, email addresses, form text or profiles.
    const category = ['candidate','employer','service'].includes(link.dataset.inquiry) ? link.dataset.inquiry : filename.startsWith('jobs-') || filename==='bewerber.html' ? 'candidate' : filename==='leistungen.html' ? 'service' : 'employer';
    if (href.startsWith('mailto:')) google('event','contact_email_click',{page_language:lang,inquiry_type:category});
    else if (/kontakt\.html/.test(href)) google('event','contact_form_open',{page_language:lang,inquiry_type:category});
    else if (/arbeitgeber\.html/.test(href)) google('event','employer_intake_open',{page_language:lang,inquiry_type:'employer'});
    else if (/script\.google\.com\/macros\/s\//.test(href)) google('event','intake_open',{page_language:lang,inquiry_type:category});
    else if (link.closest('.bw-language-switch')) google('event','language_switch',{target_language:link.hreflang || ''});
  });
})();
