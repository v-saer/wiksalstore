(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => '$' + Number(n).toFixed(2);
  const TEXT = {
    en: {
      pageTitle: 'WIKSALSTORE — Telegram Premium',
      pageDescription: 'Get Telegram Premium quickly and safely. Pay with ABA KHQR.',
      support: 'Support 24/7',
      giftAnyUsername: 'Gift to any username',
      telegramHeroTop: 'Get',
      telegramHeroBottom: 'without the hassle',
      telegramHeroDescription: 'Choose a duration, check the profile, and pay with ABA KHQR.',
      stepChoose: 'Choose',
      stepVerify: 'Verify account',
      stepPay: 'Scan & pay',
      stepDelivered: 'Delivered',
      paymentsByAba: 'Payments by ABA',
      orderProblem: 'Problem with an order?',
      contactSupport: 'Contact @nhsalnghahh',
      disclaimer: 'Not affiliated with Telegram FZ-LLC.',
      stepAccount: 'Account',
      stepPayShort: 'Pay',
      stepDone: 'Done',
      close: 'Close',
      check: 'Check',
      verified: 'Verified',
      view: 'View',
      viewProfile: 'View profile',
      continuePayment: 'Continue to payment',
      passwordSafety: '🔒 We never ask for your password.',
      scanWithAba: 'Scan to pay with any banking app',
      amountToPay: 'Amount to pay',
      expiresIn: 'Expires in',
      saveQr: 'Save QR image',
      changeAccount: '← Change account',
      thankYou: 'Thank you! 🎉',
      paymentReceived: 'Payment received. Please wait about',
      oneMinute: '1 minute',
      processingOrder: 'while we process your order.',
      receiptOrder: 'Order',
      receiptItem: 'Item',
      receiptAccount: 'Account',
      receiptPaid: 'Paid',
      somethingWrong: 'Something not right?',
      messageSupport: 'Message @nhsalnghahh',
      withOrderNumber: 'with your order number.',
      done: 'Done',
      somethingWentWrong: 'Something went wrong',
      tryAgain: 'Try again',
      contactSupportFull: 'Contact support @nhsalnghahh',
      chooseLanguage: 'Choose language',
      services: 'Services',
      categoryTelegram: 'Telegram Premium',
      unlockPremium: 'Unlock all Premium features',
      giftedUsername: 'Gifted to any @username',
      popular: 'POPULAR',
      bestValue: 'BEST VALUE',
      recommended: 'RECOMMENDED',
      buyNow: 'Buy now',
      perfectToTry: 'Perfect to try it out',
      saveMoreMonthly: 'Save more every month',
      bestPriceMonthly: 'Best price per month',
      telegramUsername: 'Telegram username',
      enterUsername: 'Enter username',
      exampleDurov: 'e.g. durov',
      lookupHintTelegram: 'Type the Telegram @username that will receive Premium.',
      profileLookupHint: "We'll look up the profile so you can confirm it's the right one.",
      lookingUp: 'Looking up profile…',
      confirmAccount: 'Is this your account? If yes, continue to payment.',
      noUsername: 'Please enter a username first.',
      invalidTelegramUsername: 'Telegram usernames are 5–32 letters, numbers or underscores.',
      noTelegramAccount: 'No public Telegram account found with that username.',
      telegramUnavailable: 'Could not reach Telegram right now. Please try again.',
      networkCheck: 'Network error. Check your connection.',
      networkRetry: 'Network error. Please check your connection and try again.',
      accountUnverified: 'Account could not be verified.',
      paymentNotConfigured: 'ABA QR payments are not configured yet. Please contact support.',
      paymentModeInvalid: 'ABA QR API is the only supported payment option. Please contact support.',
      qrResponseMissing: 'ABA QR API returned no QR string or image.',
      invalidProduct: 'Invalid product.',
      createPaymentFailed: 'Could not create the payment. Please try again or contact support.',
      creatingPayment: 'Creating payment…',
      paymentStartFailed: 'Payment could not start',
      qrExpired: 'QR code expired',
      qrExpiredMessage: 'The payment time ran out. If you already paid, contact support with your order number {order}. Otherwise try again.',
      tryNewPayment: 'Please create a new payment and try again.',
      waitingPayment: 'Waiting for your payment…',
      savedQr: 'QR saved to your device',
      couldNotLoad: 'Could not load the store. Please refresh.',
      processingSeconds: 'Processing your order… about {seconds}s left',
      processingAlmostDone: "Almost there — if it isn't delivered yet, message support with your order number.",
      statusPaid: 'Payment received. Please wait about 1 minute while we process your order.',
      errorTryAgain: 'Try again',
    },
    km: {
      pageTitle: 'WIKSALSTORE — Telegram Premium',
      pageDescription: 'ទទួលបាន Telegram Premium យ៉ាងរហ័ស និងមានសុវត្ថិភាព។ បង់ប្រាក់តាម ABA។',
      support: 'ជំនួយ ២៤/៧',
      giftAnyUsername: 'ផ្ញើជាអំណោយទៅឈ្មោះអ្នកប្រើណាមួយ',
      telegramHeroTop: 'ទទួលបាន',
      telegramHeroBottom: 'ដោយមិនស្មុគស្មាញ',
      telegramHeroDescription: 'ជ្រើសរើសរយៈពេល ពិនិត្យប្រវត្តិរូប ហើយបង់ប្រាក់តាម ABA KHQR',
      stepChoose: 'ជ្រើសរើស',
      stepVerify: 'ផ្ទៀងផ្ទាត់គណនី',
      stepPay: 'ស្កេន និងបង់ប្រាក់',
      stepDelivered: 'ទទួលបានសេវាកម្ម',
      paymentsByAba: 'ទូទាត់តាម ABA KHQR',
      orderProblem: 'មានបញ្ហាជាមួយការបញ្ជាទិញ?',
      contactSupport: 'ទាក់ទង @nhsalnghahh',
      disclaimer: 'មិនមានទំនាក់ទំនងជាមួយ Telegram FZ-LLC ទេ។',
      stepAccount: 'គណនី',
      stepPayShort: 'បង់ប្រាក់',
      stepDone: 'រួចរាល់',
      close: 'បិទ',
      check: 'ពិនិត្យ',
      verified: 'បានផ្ទៀងផ្ទាត់',
      view: 'មើល',
      viewProfile: 'មើលប្រវត្តិរូប',
      continuePayment: 'បន្តទៅការបង់ប្រាក់',
      passwordSafety: '🔒 យើងមិនស្នើសុំពាក្យសម្ងាត់របស់អ្នកទេ។',
      scanWithAba: 'ស្កេនដើម្បីបង់ប្រាក់តាមកម្មវិធីធនាគារណាមួយ',
      amountToPay: 'ចំនួនទឹកប្រាក់ត្រូវបង់',
      expiresIn: 'ផុតកំណត់ក្នុង',
      saveQr: 'រក្សាទុករូបភាព QR',
      changeAccount: '← ប្តូរគណនី',
      thankYou: 'សូមអរគុណ! 🎉',
      paymentReceived: 'បានទទួលការទូទាត់។ សូមរង់ចាំប្រហែល',
      oneMinute: '១ ទៅ ៥ នាទី',
      processingOrder: 'ខណៈពេលយើងដំណើរការការបញ្ជាទិញរបស់អ្នក។',
      receiptOrder: 'លេខបញ្ជាទិញ',
      receiptItem: 'ទំនិញ',
      receiptAccount: 'គណនី',
      receiptPaid: 'បានបង់',
      somethingWrong: 'មានអ្វីមិនត្រឹមត្រូវមែនទេ?',
      messageSupport: 'ផ្ញើសារទៅ @nhsalnghahh',
      withOrderNumber: 'ដោយភ្ជាប់លេខបញ្ជាទិញរបស់អ្នក។',
      done: 'រួចរាល់',
      somethingWentWrong: 'មានបញ្ហាកើតឡើង',
      tryAgain: 'ព្យាយាមម្តងទៀត',
      contactSupportFull: 'ទាក់ទងជំនួយ @nhsalnghahh',
      chooseLanguage: 'ជ្រើសរើសភាសា',
      services: 'សេវាកម្ម',
      categoryTelegram: 'Telegram Premium',
      unlockPremium: 'ប្រើមុខងារ Premium ទាំងអស់',
      giftedUsername: 'ផ្ញើជាអំណោយទៅ @username ណាមួយ',
      popular: 'ពេញនិយម',
      bestValue: 'តម្លៃល្អបំផុត',
      recommended: 'ណែនាំ',
      buyNow: 'ទិញឥឡូវនេះ',
      perfectToTry: 'ល្អសម្រាប់សាកល្បង',
      saveMoreMonthly: 'សន្សំច្រើនក្នុងមួយខែ',
      bestPriceMonthly: 'តម្លៃល្អបំផុតក្នុងមួយខែ',
      telegramUsername: 'ឈ្មោះអ្នកប្រើ Telegram',
      enterUsername: 'បញ្ចូលឈ្មោះអ្នកប្រើ',
      exampleDurov: 'ឧ. durov123',
      lookupHintTelegram: 'បញ្ចូល @username Telegram ដែលនឹងទទួលបាន Premium។',
      profileLookupHint: 'យើងនឹងស្វែងរកប្រវត្តិរូប ដើម្បីឱ្យអ្នកអាចបញ្ជាក់ថាត្រឹមត្រូវ។',
      lookingUp: 'កំពុងស្វែងរកប្រវត្តិរូប…',
      confirmAccount: 'តើនេះជាគណនីរបស់អ្នកមែនទេ? បើមែន សូមបន្តទៅការបង់ប្រាក់។',
      noUsername: 'សូមបញ្ចូលឈ្មោះអ្នកប្រើជាមុនសិន។',
      invalidTelegramUsername: 'ឈ្មោះអ្នកប្រើ Telegram ត្រូវមាន ៥–៣២ តួអក្សរ លេខ ឬសញ្ញា _។',
      noTelegramAccount: 'រកមិនឃើញគណនី Telegram សាធារណៈដែលមានឈ្មោះនេះទេ។',
      telegramUnavailable: 'មិនអាចភ្ជាប់ទៅ Telegram បានទេ។ សូមព្យាយាមម្តងទៀត។',
      networkCheck: 'មានបញ្ហាបណ្តាញ។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក។',
      networkRetry: 'មានបញ្ហាបណ្តាញ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។',
      accountUnverified: 'មិនអាចផ្ទៀងផ្ទាត់គណនីបានទេ។',
      paymentNotConfigured: 'ការទូទាត់ ABA QR មិនទាន់បានកំណត់រចនាសម្ព័ន្ធទេ។ សូមទាក់ទងជំនួយ។',
      paymentModeInvalid: 'អាចប្រើតែ ABA QR API សម្រាប់ការទូទាត់ប៉ុណ្ណោះ។ សូមទាក់ទងជំនួយ។',
      qrResponseMissing: 'ABA QR API មិនបានផ្តល់ QR string ឬរូបភាពទេ។',
      invalidProduct: 'ផលិតផលមិនត្រឹមត្រូវទេ។',
      createPaymentFailed: 'មិនអាចបង្កើតការទូទាត់បានទេ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងជំនួយ។',
      creatingPayment: 'កំពុងបង្កើតការទូទាត់…',
      paymentStartFailed: 'មិនអាចចាប់ផ្តើមការទូទាត់បានទេ',
      qrExpired: 'QR ផុតកំណត់',
      qrExpiredMessage: 'ពេលវេលាទូទាត់បានផុតកំណត់។ បើអ្នកបានបង់រួច សូមទាក់ទងជំនួយដោយផ្តល់លេខបញ្ជាទិញ {order}។ បើមិនទាន់ទេ សូមសាកល្បងម្តងទៀត។',
      tryNewPayment: 'សូមបង្កើតការទូទាត់ថ្មី ហើយព្យាយាមម្តងទៀត។',
      waitingPayment: 'កំពុងរង់ចាំការទូទាត់របស់អ្នក…',
      savedQr: 'បានរក្សាទុក QR ក្នុងឧបករណ៍របស់អ្នក',
      couldNotLoad: 'មិនអាចផ្ទុកហាងបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ។',
      processingSeconds: 'កំពុងដំណើរការការបញ្ជាទិញ… នៅសល់ប្រហែល {seconds} វិនាទី',
      processingAlmostDone: 'ជិតរួចរាល់ហើយ — បើមិនទាន់បានទទួល សូមផ្ញើលេខបញ្ជាទិញទៅជំនួយ។',
      statusPaid: 'បានទទួលការទូទាត់។ សូមរង់ចាំប្រហែល ១ ទៅ ៥ នាទី ខណៈពេលយើងដំណើរការការបញ្ជាទិញ។',
      errorTryAgain: 'ព្យាយាមម្តងទៀត',
    },
  };
  const ERROR_KEYS = {
    'Please enter a username first.': 'noUsername',
    'Telegram usernames are 5–32 letters, numbers or _.': 'invalidTelegramUsername',
    'Telegram usernames are 5–32 letters, numbers or underscores.': 'invalidTelegramUsername',
    'Failed to fetch': 'networkCheck',
    'No public Telegram account found with that username.': 'noTelegramAccount',
    'Could not reach Telegram right now. Please try again.': 'telegramUnavailable',
    'Network error. Check your connection.': 'networkCheck',
    'Network error. Please check your connection and try again.': 'networkRetry',
    'Account could not be verified.': 'accountUnverified',
    'ABA QR payments are not configured yet. Please contact support.': 'paymentNotConfigured',
    'Only ABA QR API payments are supported.': 'paymentModeInvalid',
    'ABA QR API returned no QR string or image.': 'qrResponseMissing',
    'Invalid product.': 'invalidProduct',
    'Could not create the payment. Please try again or contact support.': 'createPaymentFailed',
  };
  let language = localStorage.getItem('wiksalstore-language') === 'en' ? 'en' : 'km';
  const t = (key) => TEXT[language][key] || TEXT.en[key] || key;
  const localize = (value) => TEXT[language][ERROR_KEYS[value]] || value;
  const format = (key, values) => Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, value), t(key));

  const ICON = {
    tg: '<img src="/img/premium.gif" alt="">',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  const TG_META = {
    t3:  { sub: 'Perfect to try it out', per: '' },
    t6:  { sub: 'Save more every month', per: 'RECOMMEND' },
    t12: { sub: 'Best price per month',  per: 'BEST VALUE' },
  };

  let cfg = null;
  let currentTab = 'telegram';
  let sel = null;            // { category, item, platform }
  let account = null;        // verified profile
  let order = null;
  let verifyToken = 0;
  let debounce = null;
  let pollT = null, countT = null, doneT = null;
  let lastError = null;
  let doneSeconds = 0;

  /* ---------------- toast ---------------- */
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3200);
  }

  /* ---------------- sliding indicators ---------------- */
  function moveInd(ind, btn) {
    if (!btn) return;
    ind.style.width = btn.offsetWidth + 'px';
    ind.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
  const placeAll = () => {
    moveInd($('#tabInd'), $('.tab.active'));
    moveInd($('#segInd'), $('.seg-btn.active'));
  };

  function categoryName(cat) {
    return t('categoryTelegram');
  }

  function itemName(cat, item) {
    const telegramNames = { t3: 'Premium 3 Months', t6: 'Premium 6 Months', t12: 'Premium 12 Months' };
    const monthNames = { t3: 'Premium 3 ខែ', t6: 'Premium 6 ខែ', t12: 'Premium 12 ខែ' };
    return cat === 'telegram' && language === 'km' ? monthNames[item.id] : (telegramNames[item.id] || item.name);
  }

  function updateCheckoutLanguage() {
    if (!sel) return;
    $('#olCat').textContent = categoryName(sel.category);
    $('#sheetTitle').textContent = itemName(sel.category, sel.item);
    $('#olPrice').textContent = money(sel.item.price);
    $('#unameLabel').textContent = t('telegramUsername');
    $('#uname').placeholder = t('exampleDurov');
    $('#verifyBtn .bl').textContent = t('check');
    if ($('#verifyBtn').classList.contains('loading')) setHint(t('lookingUp'));
    else if (account) setHint(t('confirmAccount'), 'ok');
    else setHint(t('lookupHintTelegram'));

    if (order) {
      $('#qrAmount').textContent = money(order.amount);
      $('#waitText').textContent = t('waitingPayment');
    }
  }

  function updateDoneProgress() {
    const remaining = Math.max(0, 60 - doneSeconds);
    $('#doneCount').textContent = remaining
      ? format('processingSeconds', { seconds: remaining })
      : t('processingAlmostDone');
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage === 'en' ? 'en' : 'km';
    localStorage.setItem('wiksalstore-language', language);
    document.documentElement.lang = language;
    document.title = t('pageTitle');
    $('meta[name="description"]').content = t('pageDescription');
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    $$('.lang-switch [data-language]').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#uname').placeholder = t('enterUsername');
    if (cfg) renderCatalog();
    if (sel) updateCheckoutLanguage();
    if (lastError && !$('#vErr').hidden) {
      $('#errTitle').textContent = t(lastError.title);
      $('#errMsg').textContent = localize(lastError.message);
    }
    if (!$('#v3').hidden) updateDoneProgress();
    placeAll();
  }

  $$('.lang-switch [data-language]').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.language));
  });

  /* ---------------- tabs ---------------- */
  function setTab(name) {
    if (name === currentTab) return;
    currentTab = name;
    $$('.tab').forEach((b) => { const on = b.dataset.tab === name; b.classList.toggle('active', on); b.setAttribute('aria-selected', on); });
    $$('.panel').forEach((p) => { p.hidden = p.id !== 'panel-' + name; });
    moveInd($('#tabInd'), $('.tab.active'));
    revealCards('#grid-telegram');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $$('.tab').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));

  /* ---------------- cards ---------------- */
  function revealCards(sel) {
    $$(sel + ' .card').forEach((c) => c.classList.remove('in'));
    $$(sel + ' .card').forEach((c, i) => setTimeout(() => c.classList.add('in'), 60 + i * 70));
  }

  function buildCard(cat, it, platform) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    const name = itemName(cat, it);
    b.setAttribute('aria-label', `${name}, ${it.was ? `discounted from ${money(it.was)} to ` : ''}${money(it.price)}`);
    let html = '', badge = '', list = '';
    const price = `<div class="c-price">${it.was ? `<s>${money(it.was)}</s>` : ''}${money(it.price)}</div>`;
    let sub = '';
    const m = TG_META[it.id];
    html = ICON.tg;
    sub = t(({ 'Perfect to try it out': 'perfectToTry', 'Save more every month': 'saveMoreMonthly', 'Best price per month': 'bestPriceMonthly' })[m.sub]);
    if (m.per) {
      const tag = m.per === 'POPULAR' ? t('popular') : m.per === 'RECOMMEND' ? t('recommended') : t('bestValue');
      badge = `<span class="badge${m.per === 'POPULAR' ? ' hot' : ''}">${tag}</span>`;
      if (m.per === 'POPULAR') b.classList.add('pop');
    }
    list = `<ul class="c-list"><li>${ICON.check}${t('unlockPremium')}</li><li>${ICON.check}${t('giftedUsername')}</li></ul>`;
    b.innerHTML = `${badge}<div class="c-ico">${html}</div><div class="c-name"></div><div class="c-sub"></div>${list}<div class="c-foot">${price}<span class="c-buy"></span></div>`;
    $('.c-name', b).textContent = name;
    $('.c-sub', b).textContent = sub;
    $('.c-buy', b).textContent = t('buyNow');
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', e.clientX - r.left + 'px');
      b.style.setProperty('--my', e.clientY - r.top + 'px');
    });
    b.addEventListener('click', () => openCheckout(cat, it, platform));
    return b;
  }

  function renderCatalog() {
    for (const [cat, c] of Object.entries(cfg.catalog)) {
      const grid = $('#grid-' + cat);
      grid.innerHTML = '';
      c.items.forEach((it) => grid.appendChild(buildCard(cat, it, c.platform)));
    }
    $('#supportTop').href = 'https://t.me/' + cfg.support;
    revealCards('#grid-telegram');
  }

  /* ---------------- checkout sheet ---------------- */
  function show(id) {
    ['v1', 'v2', 'v3', 'vErr'].forEach((v) => { const el = $('#' + v); el.hidden = v !== id; });
    if (id !== 'vErr') lastError = null;
    const idx = { v1: 0, v2: 1, v3: 2, vErr: 1 }[id];
    $$('#stepper .st').forEach((s, i) => { s.classList.toggle('active', i === idx); s.classList.toggle('done', i < idx || (id === 'v3' && i === 2)); });
    $$('#stepper u').forEach((u, i) => u.classList.toggle('fill', i < idx));
    $('#sheet').scrollTo({ top: 0 });
  }

  function openCheckout(cat, it, platform) {
    sel = { category: cat, item: it, platform };
    account = null; order = null;
    stopTimers();
    $('#olCat').textContent = categoryName(cat);
    $('#sheetTitle').textContent = itemName(cat, it);
    $('#olPrice').textContent = money(it.price);
    $('#unameLabel').textContent = t('telegramUsername');
    $('#uname').placeholder = t('exampleDurov');
    $('#uname').value = '';
    $('#atSign').hidden = false;
    $('#uname').maxLength = 32;
    resetVerify();
    show('v1');
    $('#overlay').hidden = false;
    $('#overlay').classList.remove('closing');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#uname').focus({ preventScroll: true }), 350);
  }

  function closeCheckout() {
    const ov = $('#overlay');
    if (ov.hidden) return;
    ov.classList.add('closing');
    stopTimers();
    setTimeout(() => { ov.hidden = true; ov.classList.remove('closing'); document.body.style.overflow = ''; }, 250);
  }
  $('#closeBtn').addEventListener('click', closeCheckout);
  $('#doneClose').addEventListener('click', closeCheckout);
  // clicking the dark backdrop closes the sheet, except while a payment is in progress
  $('#overlay').addEventListener('mousedown', (e) => { if (e.target.id === 'overlay' && $('#v2').hidden) closeCheckout(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCheckout(); });

  /* ---------------- username verify ---------------- */
  function setHint(text, kind) {
    const h = $('#hint');
    h.textContent = text;
    h.className = 'hint' + (kind ? ' ' + kind : '');
  }
  function resetVerify() {
    account = null;
    $('#profile').hidden = true;
    $('#toPay').disabled = true;
    $('#inputWrap').className = 'input-wrap';
    $('#verifyBtn').classList.remove('loading');
    setHint(t('lookupHintTelegram'));
  }

  const validName = (v) => /^[A-Za-z0-9_]{5,32}$/.test(v);

  async function verify(auto) {
    let v = $('#uname').value.trim().replace(/^@/, '');
    if (!v) { if (!auto) { $('#inputWrap').className = 'input-wrap bad'; setHint(t('noUsername'), 'err'); } return; }
    if (!validName(v)) {
      if (!auto) { $('#inputWrap').className = 'input-wrap bad'; setHint(t('invalidTelegramUsername'), 'err'); }
      return;
    }
    const my = ++verifyToken;
    const btn = $('#verifyBtn');
    btn.classList.add('loading');
    $('#profile').hidden = true; $('#toPay').disabled = true; account = null;
    $('#inputWrap').className = 'input-wrap';
    setHint(t('lookingUp'));
    try {
      const r = await fetch(`/api/${sel.platform}/${encodeURIComponent(v)}`);
      const data = await r.json();
      if (my !== verifyToken) return;
      if (!r.ok) throw new Error(data.error || 'Lookup failed');
      account = data;
      showProfile(data);
      $('#inputWrap').className = 'input-wrap ok';
      setHint(t('confirmAccount'), 'ok');
      $('#toPay').disabled = false;
    } catch (e) {
      if (my !== verifyToken) return;
      $('#inputWrap').className = 'input-wrap bad';
      setHint(e.message === 'Failed to fetch' ? t('networkCheck') : localize(e.message), 'err');
    } finally {
      if (my === verifyToken) btn.classList.remove('loading');
    }
  }

  function showProfile(p) {
    $('#pName').textContent = p.displayName || p.username;
    $('#pUser').textContent = '@' + p.username;
    $('#pDesc').textContent = p.description || p.extra || '';
    $('#pInitial').textContent = (p.displayName || p.username || '?').trim().charAt(0).toUpperCase();
    const img = $('#pAvatar');
    img.style.display = 'none';
    img.onload = () => { img.style.display = ''; };
    img.onerror = () => { img.style.display = 'none'; };
    if (p.avatar && /^https:\/\//i.test(p.avatar)) { img.referrerPolicy = 'no-referrer'; img.src = p.avatar; } else img.removeAttribute('src');
    const a = $('#pLink');
    a.href = p.profileUrl; a.textContent = t('viewProfile');
    $('#profile').hidden = false;
  }

  $('#verifyBtn').addEventListener('click', () => verify(false));
  $('#uname').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(debounce); verify(false); } });
  $('#uname').addEventListener('input', () => {
    verifyToken++;
    resetVerify();
    clearTimeout(debounce);
    debounce = setTimeout(() => verify(true), 800);
  });

  /* ---------------- ripple ---------------- */
  document.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.primary');
    if (!b || b.disabled) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) / 4;
    const d = document.createElement('span');
    d.className = 'rip';
    d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(d);
    setTimeout(() => d.remove(), 650);
  });

  /* ---------------- payment ---------------- */
  function stopTimers() { clearInterval(pollT); clearInterval(countT); clearInterval(doneT); pollT = countT = doneT = null; }

  $('#toPay').addEventListener('click', () => createOrder());
  $('#backBtn').addEventListener('click', () => { stopTimers(); order = null; show('v1'); });
  $('#errRetry').addEventListener('click', () => { stopTimers(); order = null; show('v1'); });

  async function createOrder() {
    if (!account) return;
    const btn = $('#toPay');
    btn.disabled = true; btn.textContent = t('creatingPayment');
    try {
      const r = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: sel.category, itemId: sel.item.id, username: account.username }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || t('createPaymentFailed'));
      order = data;
      startPayment();
    } catch (e) {
      showError('paymentStartFailed', e.message === 'Failed to fetch' ? t('networkRetry') : localize(e.message));
    } finally {
      btn.disabled = !account; btn.textContent = t('continuePayment');
    }
  }

  function startPayment() {
    show('v2');
    $('#qrAmount').textContent = money(order.amount);
    const img = $('#qrImg');
    img.classList.remove('show');
    $('#qrBox').classList.remove('ready');
    img.onload = () => { img.classList.add('show'); $('#qrBox').classList.add('ready'); };
    img.src = order.qrImage;
    $('#waitText').textContent = t('waitingPayment');

    const tick = () => {
      const left = Math.max(0, Math.round((order.expiresAt - Date.now()) / 1000));
      $('#qrTimer').textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
      $('.timer').classList.toggle('low', left <= 60);
      if (left === 0) {
        stopTimers();
        showError('qrExpired', format('qrExpiredMessage', { order: order.id }));
      }
    };
    tick();
    countT = setInterval(tick, 1000);
    pollT = setInterval(poll, 3000);
  }

  let polling = false;
  async function poll() {
    if (polling || !order) return;
    polling = true;
    try {
      const r = await fetch(`/api/orders/${encodeURIComponent(order.id)}/status`);
      const d = await r.json();
      if (d.status === 'paid') { stopTimers(); showDone(); }
      else if (d.status === 'expired') {
        stopTimers();
        showError('qrExpired', t('tryNewPayment'));
      }
    } catch { /* network blip – next tick retries */ }
    polling = false;
  }

  $('#downloadQr').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = order.qrImage; a.download = `wiksalstore-${order.id}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    toast(t('savedQr'));
  });

  function showError(title, message) {
    lastError = { title, message };
    $('#errTitle').textContent = t(title);
    $('#errMsg').textContent = localize(message);
    show('vErr');
  }

  function showDone() {
    $('#rId').textContent = order.id;
    $('#rItem').textContent = itemName(sel.category, sel.item);
    $('#rAcc').textContent = '@' + account.username;
    $('#rAmt').textContent = money(order.amount);
    show('v3');
    confetti();
    const total = 60; doneSeconds = 0;
    const bar = $('#doneBar'), cnt = $('#doneCount');
    bar.style.width = '0%';
    doneT = setInterval(() => {
      doneSeconds++;
      bar.style.width = Math.min(100, (doneSeconds / total) * 100) + '%';
      updateDoneProgress();
      if (doneSeconds >= total) clearInterval(doneT);
    }, 1000);
    updateDoneProgress();
  }

  /* ---------------- confetti ---------------- */
  function confetti() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = $('#confetti'), x = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;
    const colors = ['#6ee7ff', '#8b5cf6', '#d946ef', '#34d399', '#fbbf24', '#fb7185'];
    const ps = Array.from({ length: 130 }, () => ({
      x: innerWidth / 2, y: innerHeight * 0.45, r: 4 + Math.random() * 5,
      vx: (Math.random() - 0.5) * 16, vy: -8 - Math.random() * 12, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4,
      col: colors[(Math.random() * colors.length) | 0],
    }));
    let f = 0;
    (function step() {
      x.clearRect(0, 0, c.width, c.height);
      ps.forEach((p) => {
        p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.col;
        x.globalAlpha = Math.max(0, 1 - f / 140);
        x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); x.restore();
      });
      if (++f < 140) requestAnimationFrame(step); else x.clearRect(0, 0, c.width, c.height);
    })();
  }

  /* ---------------- init ---------------- */
  $('#yr').textContent = new Date().getFullYear();
  addEventListener('resize', placeAll);
  document.fonts && document.fonts.ready.then(placeAll);
  applyLanguage(language);
  placeAll();
  fetch('/api/config').then((r) => r.json()).then((c) => { cfg = c; renderCatalog(); placeAll(); })
    .catch(() => toast(t('couldNotLoad')));
})();
