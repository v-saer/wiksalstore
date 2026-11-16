(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n, currency = 'USD') => currency === 'KHR'
    ? `៛ ${Math.round(Number(n)).toLocaleString('en-US')}`
    : '$' + Number(n).toFixed(2);
  const TEXT = {
    en: {
      pageTitle: 'WIKSALSTORE — Telegram Premium',
      pageDescription: 'Get Telegram Premium quickly and safely with ABA payment links.',
      support: 'Support 24/7',
      giftAnyUsername: 'Gift to any username',
      telegramHeroTop: 'Get',
      telegramHeroBottom: 'without the hassle',
      telegramHeroDescription: 'Choose a duration, check the profile, then scan the QR or open the ABA payment link.',
      stepChoose: 'Choose',
      stepVerify: 'Verify account',
      stepPay: 'Scan or open link',
      stepDelivered: 'Delivered',
      paymentsByAba: 'Payments via ABA payment links',
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
      scanWithAba: 'Scan with any Mobile Banking App supporting KHQR',
      payWithAbaLink: 'Open ABA payment link',
      orderId: 'Order ID',
      changeAccount: '← Change account',
      thankYou: 'Thank you! 🎉',
      receiptOrder: 'Order',
      receiptItem: 'Item',
      receiptAccount: 'Account',
      receiptAmount: 'Amount',
      somethingWrong: 'Something not right?',
      messageSupport: 'Message @nhsalnghahh',
      withOrderNumber: 'with your order number.',
      done: 'Done',
      temporarilyUnavailable: 'Temporarily unavailable',
      uploadProofInstructions: 'After paying, upload a screenshot of your successful payment.',
      chooseReceipt: 'Upload payment screenshot',
      submitReceipt: "I've paid — submit receipt",
      sendingReceipt: 'Sending receipt…',
      proofSubmittedMessage: 'Thank you! Your payment proof has been sent for review. We will deliver Premium after verifying your payment.',
      proofFileInvalid: 'Upload a PNG, JPEG, or WebP image smaller than 5 MB.',
      proofUploadFailed: 'Could not send your payment proof. Please try again or contact support.',
      paymentLinkInvalid: 'The ABA payment link is invalid. Please contact support.',
      qrImageLoadFailed: 'Could not load the ABA KHQR image. Use the ABA payment link below instead.',
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
      paymentNotConfigured: 'Telegram payment notifications are not configured yet. Please contact support.',
      invalidProduct: 'Invalid product.',
      createPaymentFailed: 'Could not create the payment. Please try again or contact support.',
      creatingPayment: 'Creating payment…',
      paymentStartFailed: 'Payment could not start',
      couldNotLoad: 'Could not load the store. Please refresh.',
      errorTryAgain: 'Try again',
    },
    km: {
      pageTitle: 'WIKSALSTORE — Telegram Premium',
      pageDescription: 'ទទួលបាន Telegram Premium យ៉ាងរហ័ស និងមានសុវត្ថិភាព តាមតំណទូទាត់ ABA KHQR',
      support: 'ជំនួយ ២៤/៧',
      giftAnyUsername: 'ផ្ញើជាអំណោយទៅឈ្មោះអ្នកប្រើណាមួយ',
      telegramHeroTop: 'ទទួលបាន',
      telegramHeroBottom: 'ដោយមិនស្មុគស្មាញ',
      telegramHeroDescription: 'ជ្រើសរើសរយៈពេល ពិនិត្យគណនី បន្ទាប់មកស្កេន QR ឬបើកតំណទូទាត់ ABA KHQR',
      stepChoose: 'ជ្រើសរើស',
      stepVerify: 'ផ្ទៀងផ្ទាត់គណនី',
      stepPay: 'ស្កេន ឬបើកតំណ',
      stepDelivered: 'ទទួលបានសេវាកម្ម',
      paymentsByAba: 'ទូទាត់តាមតំណ ABA',
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
      scanWithAba: 'ស្កេនដោយកម្មវិធីធនាគារចល័តណាមួយដែលគាំទ្រ KHQR',
      payWithAbaLink: 'បើកតំណទូទាត់ ABA',
      orderId: 'លេខបញ្ជាទិញ',
      changeAccount: '← ប្តូរគណនី',
      thankYou: 'សូមអរគុណ! 🎉',
      receiptOrder: 'លេខបញ្ជាទិញ',
      receiptItem: 'ទំនិញ',
      receiptAccount: 'គណនី',
      receiptAmount: 'ចំនួនទឹកប្រាក់',
      somethingWrong: 'មានអ្វីមិនត្រឹមត្រូវមែនទេ?',
      messageSupport: 'ផ្ញើសារទៅ @nhsalnghahh',
      withOrderNumber: 'ដោយភ្ជាប់លេខបញ្ជាទិញរបស់អ្នក។',
      done: 'រួចរាល់',
      temporarilyUnavailable: 'មិនទាន់អាចប្រើបានទេ',
      uploadProofInstructions: 'បន្ទាប់ពីបង់ប្រាក់ សូមសូមបញ្ចូលវិក្កយប័ត្របញ្ជាក់ពីការបង់ប្រាក់ជោគជ័យ។',
      chooseReceipt: 'សូមបញ្ចូលវិក្កយប័ត្របង់ប្រាក់',
      submitReceipt: 'ខ្ញុំបានបង់ប្រាក់ — ផ្ញើបង្កាន់ដៃ',
      sendingReceipt: 'កំពុងផ្ញើបង្កាន់ដៃ…',
      proofSubmittedMessage: 'សូមអរគុណ! បង្កាន់ដៃបង់ប្រាក់របស់អ្នកត្រូវបានផ្ញើទៅពិនិត្យ។ យើងនឹងផ្តល់ Premium បន្ទាប់ពីផ្ទៀងផ្ទាត់ការបង់ប្រាក់រួច។',
      proofFileInvalid: 'សូមជ្រើសរើសរូបភាព PNG, JPEG ឬ WebP ដែលមានទំហំតិចជាង ៥ MB។',
      proofUploadFailed: 'មិនអាចផ្ញើបង្កាន់ដៃបង់ប្រាក់បានទេ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងជំនួយ។',
      paymentLinkInvalid: 'តំណទូទាត់ ABA មិនត្រឹមត្រូវទេ។ សូមទាក់ទងជំនួយ។',
      qrImageLoadFailed: 'មិនអាចបង្ហាញរូបភាព ABA KHQR បានទេ។ សូមប្រើតំណទូទាត់ ABA ខាងក្រោម។',
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
      bestPriceMonthly: 'តម្លៃល្អបំផុតក្នុងមួយឆ្នាំ',
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
      paymentNotConfigured: 'ការជូនដំណឹងការទូទាត់តាម Telegram មិនទាន់បានកំណត់ទេ។ សូមទាក់ទងជំនួយ។',
      invalidProduct: 'ផលិតផលមិនត្រឹមត្រូវទេ។',
      createPaymentFailed: 'មិនអាចបង្កើតការទូទាត់បានទេ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងជំនួយ។',
      creatingPayment: 'កំពុងបង្កើតការទូទាត់…',
      paymentStartFailed: 'មិនអាចចាប់ផ្តើមការទូទាត់បានទេ',
      couldNotLoad: 'មិនអាចផ្ទុកហាងបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ។',
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
    'Invalid product.': 'invalidProduct',
    'Could not create the payment. Please try again or contact support.': 'createPaymentFailed',
    'Could not create the payment order. Please try again or contact support.': 'createPaymentFailed',
    'This payment option is temporarily unavailable. Please contact support.': 'temporarilyUnavailable',
    'Choose a payment screenshot to upload.': 'proofFileInvalid',
    'Upload a valid PNG, JPEG, or WebP payment screenshot.': 'proofFileInvalid',
    'Payment screenshot must be 5 MB or smaller.': 'proofFileInvalid',
    'Could not send your payment proof. Please try again or contact support.': 'proofUploadFailed',
    'Your payment proof is already being sent.': 'sendingReceipt',
    'ABA payment link is invalid.': 'paymentLinkInvalid',
    'Payment proof notifications are not configured. Please contact support.': 'paymentNotConfigured',
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
    t12: { sub: 'Best price per year',  per: 'BEST VALUE' },
  };

  let cfg = null;
  let currentTab = 'telegram';
  let sel = null;            // { category, item, platform }
  let account = null;        // verified profile
  let order = null;
  let checkoutOrderId = null;
  let paymentAttempted = false;
  let verifyToken = 0;
  let debounce = null;
  let lastError = null;
  let proofPreviewUrl = null;

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
      $('#qrAmount').textContent = Number(order.amount).toFixed(2);
      $('#qrCurrency').textContent = order.currency;
    }
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
    if (it.paymentAvailable) b.addEventListener('click', () => openCheckout(cat, it, platform));
    else {
      b.disabled = true;
      b.classList.add('unavailable');
      $('.c-buy', b).textContent = t('temporarilyUnavailable');
    }
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
    $('#uname').disabled = paymentAttempted;
    $('#verifyBtn').disabled = paymentAttempted;
    if (id !== 'vErr') lastError = null;
    const idx = { v1: 0, v2: 1, v3: 2, vErr: 1 }[id];
    $$('#stepper .st').forEach((s, i) => { s.classList.toggle('active', i === idx); s.classList.toggle('done', i < idx || (id === 'v3' && i === 2)); });
    $$('#stepper u').forEach((u, i) => u.classList.toggle('fill', i < idx));
    $('#sheet').scrollTo({ top: 0 });
  }

  function openCheckout(cat, it, platform) {
    sel = { category: cat, item: it, platform };
    account = null; order = null;
    checkoutOrderId = null;
    paymentAttempted = false;
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
  $('#toPay').addEventListener('click', () => createOrder());
  $('#backBtn').addEventListener('click', () => {
    resetProof();
    order = null;
    checkoutOrderId = null;
    paymentAttempted = false;
    show('v1');
  });
  $('#errRetry').addEventListener('click', () => { order = null; show('v1'); });

  async function createOrder() {
    if (!account) return;
    const btn = $('#toPay');
    btn.disabled = true; btn.textContent = t('creatingPayment');
    try {
      if (!checkoutOrderId) checkoutOrderId = `WS-${newOrderUuid()}`;
      paymentAttempted = true;
      $('#uname').disabled = true;
      $('#verifyBtn').disabled = true;
      const r = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: sel.category,
          itemId: sel.item.id,
          username: account.username,
          currency: 'USD',
          orderId: checkoutOrderId,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || t('createPaymentFailed'));
      order = data;
      await startPayment();
    } catch (e) {
      showError('paymentStartFailed', e.message === 'Failed to fetch' ? t('networkRetry') : localize(e.message));
    } finally {
      btn.disabled = !account; btn.textContent = t('continuePayment');
    }
  }

  function newOrderUuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  async function startPayment() {
    show('v2');
    resetProof();
    $('#qrAmount').textContent = Number(order.amount).toFixed(2);
    $('#qrCurrency').textContent = order.currency;
    $('#qrOrderId').textContent = order.id;
    const qrBox = $('#qrBox');
    const qrError = $('#qrError');
    qrBox.classList.remove('ready', 'failed');
    qrError.hidden = true;

    try {
      const paymentLink = new URL(order.paymentLink);
      if (paymentLink.protocol !== 'https:' || paymentLink.hostname !== 'pay.ababank.com' || paymentLink.username || paymentLink.password) {
        throw new Error('ABA payment link is invalid.');
      }
      $('#paymentLink').href = paymentLink.href;
    } catch {
      showError('paymentStartFailed', 'ABA payment link is invalid.');
      return;
    }

    const qrImagePath = order.paymentQrImage;
    if (typeof qrImagePath !== 'string' || !/^\/img\/aba-khqr-t(?:3|6|12)\.png$/.test(qrImagePath)) {
      qrBox.classList.add('failed');
      qrError.textContent = t('qrImageLoadFailed');
      qrError.hidden = false;
      return;
    }

    const qrImage = $('#khqrImage');
    qrImage.onload = () => qrBox.classList.add('ready');
    qrImage.onerror = () => {
      qrBox.classList.add('failed');
      qrError.textContent = t('qrImageLoadFailed');
      qrError.hidden = false;
    };
    qrImage.src = qrImagePath;
    if (qrImage.complete && qrImage.naturalWidth > 0) qrBox.classList.add('ready');
  }

  function resetProof() {
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    proofPreviewUrl = null;
    $('#proofFile').value = '';
    $('#proofPreview').hidden = true;
    $('#proofPreviewImage').removeAttribute('src');
    $('#proofFileName').textContent = '';
    $('#proofError').hidden = true;
    $('#proofError').textContent = '';
    $('#submitProof').disabled = true;
    $('#submitProof').textContent = t('submitReceipt');
  }

  $('#proofFile').addEventListener('change', () => {
    const file = $('#proofFile').files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      resetProof();
      $('#proofError').textContent = t('proofFileInvalid');
      $('#proofError').hidden = false;
      return;
    }
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    proofPreviewUrl = URL.createObjectURL(file);
    $('#proofPreviewImage').src = proofPreviewUrl;
    $('#proofFileName').textContent = file.name;
    $('#proofPreview').hidden = false;
    $('#proofError').hidden = true;
    $('#submitProof').disabled = false;
  });

  $('#submitProof').addEventListener('click', async () => {
    const file = $('#proofFile').files[0];
    if (!file || !order) return;
    const button = $('#submitProof');
    button.disabled = true;
    button.textContent = t('sendingReceipt');
    $('#proofError').hidden = true;
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('proofUploadFailed'));
      order.status = result.status;
      showDone();
    } catch (e) {
      $('#proofError').textContent = e.message === 'Failed to fetch' ? t('networkRetry') : localize(e.message);
      $('#proofError').hidden = false;
      button.disabled = false;
      button.textContent = t('submitReceipt');
    }
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
    $('#rAmt').textContent = money(order.amount, order.currency);
    show('v3');
    confetti();
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
