/* ================== DJANGO DATA INGESTION & PROCESSING ================== */
const rawBackendData = window.djangoBackendData || [];

function processBackendData(variants) {
  const categoriesMap = {};

  variants.forEach(v => {
    const catKey = v.category_slug;
    
    if (!categoriesMap[catKey]) {
      categoriesMap[catKey] = {
        key: catKey,
        label: v.category_name,
        // 💡 জ্যাঙ্গো ব্যাক-এন্ড থেকে পাঠানো নতুন ইমেজ URL রিসিভ করার ফিক্স
        icon: v.category_icon || '',
        itemsMap: {}
      };
    }

    const itemKey = v.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    if (!categoriesMap[catKey].itemsMap[itemKey]) {
      categoriesMap[catKey].itemsMap[itemKey] = {
        key: itemKey,
        label: v.name,
        icon_url: v.icon_url,
        caps: [],
        hoursMap: {},
        variantsData: [],
        defCapIdx: 0,
        defQty: 0,
        defHours: 4
      };
    }

    const currentItem = categoriesMap[catKey].itemsMap[itemKey];
    currentItem.caps.push(v.watt);
    currentItem.hoursMap[v.watt] = v.hours;
    currentItem.variantsData.push(v);

    if (v.is_default) {
      currentItem.defCapIdx = currentItem.caps.length - 1;
      currentItem.defQty = 1;
      currentItem.defHours = v.hours;
    }
  });

  return Object.values(categoriesMap).map(cat => {
    cat.items = Object.values(cat.itemsMap);
    delete cat.itemsMap;
    return cat;
  });
}

const LOAD_CATEGORIES = processBackendData(rawBackendData);

/* ================== CONFIGURATIONS & RESOLUTIONS ================== */
const BACKUP_OPTIONS = [
  { key:'2h', label:'২ ঘণ্টা', sub:'ছোট লোডশেডিং', mult:1.00 },
  { key:'4h', label:'৪ ঘণ্টা', sub:'মাঝারি ব্যাকআপ', mult:1.10 },
  { key:'6h', label:'৬ ঘণ্টা', sub:'বড় ব্যাকআপ', mult:1.20 },
  { key:'full', label:'ফুল নাইট', sub:'সারারাত নিরাপদ', mult:1.35 },
];

const HOUSE_OPTIONS = [
  { key:'flat', label:'ফ্ল্যাট বাড়ি', sub:'অ্যাপার্টমেন্ট', mult:1.00 },
  { key:'villa', label:'স্বাধীন ভিলা/বিল্ডিং', sub:'আলাদা ছাদ ও জায়গা', mult:1.15 },
];

const PACKAGES = [
  { id:'noksha',   tier:'Starter',    tierBn:'🌱 স্টার্টার',    kw:1,  nameBn:'নকশা',   nameEn:'Blueprint',     tagline:'সৌরশক্তির প্রথম পদক্ষেপ', users:'নতুন সৌরবিদ্যুৎ ব্যবহারকারী', dailyMin:4, dailyMax:5,  suitable:'ছোট পরিবার, গ্রামীণ বাসা', equipment:['৪–৬টি ফ্যান','৮–১০টি LED লাইট','টিভি','Wi-Fi','মোবাইল充电'], priceMin:70000, priceMax:90000 },
  { id:'alap',     tier:'Starter',    tierBn:'🌱 স্টার্টার',    kw:1.5,nameBn:'আলাপ',   nameEn:'Introduction', tagline:'সাশ্রয়ের নতুন শুরু', users:'বিদ্যুৎ বিল কমাতে ইচ্ছুক পরিবার', dailyMin:6, dailyMax:7,  suitable:'ছোট শহর ও গ্রামীণ পরিবার', equipment:['ফ্যান','লাইট','টিভি','ফ্রিজ','ল্যাপটপ','Wi-Fi'], priceMin:105000, priceMax:135000 },
  { id:'bondhon',  tier:'Family',     tierBn:'🏡 ফ্যামিলি',     kw:2,  nameBn:'বন্ধন',  nameEn:'Family Bond',  tagline:'পরিবারের নির্ভরতার শক্তি', users:'মধ্যবিত্ত পরিবার', dailyMin:8, dailyMax:10, suitable:'৩–৫ সদস্যের পরিবার', equipment:['ফ্রিজ','টিভি','৬–৮টি ফ্যান','লাইট','কম্পিউটার'], priceMin:140000, priceMax:180000 },
  { id:'songsar',  tier:'Family',     tierBn:'🏡 ফ্যামিলি',     kw:3,  nameBn:'সংসার',  nameEn:'Household',    tagline:'প্রতিদিনের বিদ্যুৎ, নিশ্চিন্ত জীবন', users:'আধুনিক পরিবার', dailyMin:12, dailyMax:15, suitable:'শহর ও উপশহরের পরিবার', equipment:['১টি ১ টন AC (দিনে)','ফ্রিজ','ফ্যান','লাইট','টিভি'], priceMin:210000, priceMax:270000, popular:true },
  { id:'somriddhi',tier:'Comfort',    tierBn:'🌞 কমফোর্ট',     kw:5,  nameBn:'সমৃদ্ধি',nameEn:'Prosperity',   tagline:'স্মার্ট জীবনের SMART শক্তি', users:'উentered জীবনযাপনকারী পরিবার', dailyMin:20, dailyMax:25, suitable:'বড় পরিবার, ছোট ব্যবসা', equipment:['২টি AC','ফ্রিজ','ওয়াশিং মেশিন','পানি পাম্প','অফিস লোড'], priceMin:350000, priceMax:450000 },
  { id:'unnoti',   tier:'Comfort',    tierBn:'🌞 কমফোর্ট',     kw:6,  nameBn:'উন্নতি', nameEn:'Progress',     tagline:'উন্নয়নের নির্ভরযোগ্য সঙ্গী', users:'উচ্চ বিদ্যুৎ ব্যবহারকারী', dailyMin:24, dailyMax:30, suitable:'שורום, দোকান, অফিস', equipment:['একাধিক AC','কম্পিউটার','CCTV','ব্যবসায়িক লোড'], priceMin:420000, priceMax:540000 },
  { id:'durbar',   tier:'Premium',    tierBn:'💎 প্রিমিয়াম',   kw:8,  nameBn:'দুর্বার',nameEn:'Unstoppable',  tagline:'ব্যবসার গতিতে শক্তির যোগান', users:'বৃহৎ পরিবার ও SME', dailyMin:32, dailyMax:40, suitable:'ডুপ্লেক্স, রেস্টুরেন্ট, office', equipment:['৩–৪টি AC','ভারী লোড','ব্যাকআপ সুবিধা'], priceMin:560000, priceMax:720000 },
  { id:'biswas',   tier:'Premium',    tierBn:'💎 প্রিমিয়াম',   kw:10, nameBn:'বিশ্বাস',nameEn:'Trust',       tagline:'প্রতিটি ইউনিটে আস্থা', users:'মাঝারি ব্যবসা', dailyMin:40, dailyMax:50, suitable:'SME, ক্লিনিক, শিক্ষা প্রতিষ্ঠান', equipment:['অধিক বিদ্যুৎ সাশ্রয়','দ্রুত ROI'], priceMin:700000, priceMax:900000 },
  { id:'shokti',   tier:'Enterprise', tierBn:'🏭 এন্টারপ্রাইজ', kw:12, nameBn:'শক্তি',  nameEn:'Power',       tagline:'শিল্প ও প্রতিষ্ঠানের শক্তিশালী সমাধান', users:'বাণিজ্যিক প্রতিষ্ঠান', dailyMin:48, dailyMax:60, suitable:'ক্লিনিক, office, कारखाना', equipment:['২৪/৭ নির্ভরযোগ্য বিদ্যুৎ','কম অপারেটিং খরচ'], priceMin:840000, priceMax:1080000 },
  { id:'uday',     tier:'Enterprise', tierBn:'🏭 এন্টারপ্রাইজ', kw:15, nameBn:'উদয়',   nameEn:'Sunrise',     tagline:'সবুজ শক্তিতে নতুন সম্ভাবনা', users:'বড় ব্যবসা', dailyMin:60, dailyMax:75, suitable:'শিল্প প্রতিষ্ঠান, গুদাম, office', equipment:['উচ্চ ক্ষমতা','ভবিষ্যৎ সম্প্রসারণ উপযোগী'], priceMin:1050000, priceMax:1350000 },
  { id:'swapno',   tier:'Ultimate',   tierBn:'👑 আল্টিমেট',    kw:20, nameBn:'স্বপ্ন', nameEn:'Dream',       tagline:'ভবিষ্যতের জন্য সর্বোচ্চ সৌর সমাধান', users:'প্রিমিয়াম হোম ও বৃহৎ প্রতিষ্ঠান', dailyMin:80, dailyMax:100,suitable:'বড় বাড়ি, कारखाना, হাসপাতাল, হোটেল', equipment:['সর্বোচ্চ বিদ্যুৎ সাশ্রয়','দীর্ঘমেয়াদি বিনিয়োগ','বাণিজ্যিক গ্রেড সিস্টেম'], priceMin:1400000, priceMax:1800000 },
];

const TIER_ORDER = ['Starter','Family','Comfort','Premium','Enterprise','Ultimate'];

/* ================== RENDERING ENGINE ================== */
const bnNum = n => n.toLocaleString('bn-BD');
const taka = n => '৳' + bnNum(Math.round(n));

function buildLoadAccordion(){
  const wrap = document.getElementById('loadAccordion');
  if(!LOAD_CATEGORIES.length) {
    wrap.innerHTML = `<p class="text-center text-ink-700/60 p-5">কোনো ডাটা পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে ক্যাটাগরি ও আইটেম যুক্ত করুন।</p>`;
    return;
  }
  wrap.innerHTML = LOAD_CATEGORIES.map(cat => `
    <div class="cat-card border border-leaf-100 rounded-2xl bg-white shadow-card overflow-hidden" data-cat="${cat.key}">
      <div class="cat-header flex items-center justify-between px-5 sm:px-6 py-4.5 bg-leaf-50 cursor-pointer">
        <span class="flex items-center gap-3 font-semibold text-xl text-ink-800">
          <!-- 💡 ক্যাটাগরি ইমেজের জন্য রেন্ডারিং ফিক্স এবং সেফটি ফ্যালব্যাক চেক -->
          ${cat.icon && cat.icon !== '' ? 
            `<img src="${cat.icon}" class="w-7 h-7 object-contain inline-block" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" alt="${cat.label}" /><span class="text-2xl hidden">🔌</span>` 
            : '<span class="text-2xl">🔌</span>'
          } 
          ${cat.label}
        </span>
        <span class="flex items-center gap-4">
          <span class="cat-subtotal text-base sm:text-lg text-leaf-700 font-semibold">০ Wh/day</span>
          <svg class="cat-chevron w-4 h-4 text-leaf-700" viewBox="0 0 10 10" fill="none"><path d="M2 1l6 4-6 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>
      <div class="cat-body">
        <div class="hidden sm:grid grid-cols-[32px_1.6fr_1fr_0.9fr_0.9fr_1fr] gap-4 px-6 py-3 text-sm font-semibold text-ink-700/60 border-b border-leaf-50">
          <span></span><span>আইটেম</span><span>ক্যাপাসিটি (W)</span><span>পরিমাণ</span><span>ঘণ্টা/দিন</span><span>দৈনিক শক্তি (Wh/day)</span>
        </div>
        ${cat.items.map(it => itemRowHtml(it)).join('')}
      </div>
    </div>
  `).join('');
}

function itemRowHtml(it){
  // 💡 ফিক্স: টেইলউইন্ডের 'py-4.5' পরিবর্তন করে 'py-6' (ডেস্কটপ) এবং 'sm:py-6' করা হলো যাতে কার্ডের হাইট বাড়ে
  return `
  <label class="block relative cursor-pointer border-b border-leaf-50 last:border-b-0">
    <input type="checkbox" class="item-check sr-only" data-item="${it.key}" ${it.defQty > 0 ? 'checked' : ''}>
    <div class="item-row grid sm:grid-cols-[32px_1.6fr_1fr_0.9fr_0.9fr_1fr] gap-4 items-center px-6 py-6">
      <span class="item-dot w-3.5 h-3.5 rounded-full bg-leaf-100 border border-leaf-200"></span>
      <span class="text-base font-semibold text-ink-800 flex items-center gap-3">
        <img src="${it.icon_url}" class="w-6 h-6 object-contain inline" onerror="this.style.display='none'">
        ${it.label}
      </span>
      <span class="item-fields">
        <select class="cap-select text-base font-medium border border-leaf-200 rounded-xl px-3 py-2.5 w-full bg-white" data-item="${it.key}">
          ${it.caps.map((c,i) => `<option value="${c}" ${i===it.defCapIdx?'selected':''}>${c}W</option>`).join('')}
        </select>
      </span>
      <span class="item-fields flex items-center gap-1.5">
        <button type="button" class="qty-minus w-8 h-8 rounded-full bg-leaf-50 hover:bg-leaf-100 text-leaf-700 text-lg font-bold shrink-0" data-item="${it.key}">−</button>
        <input type="number" min="0" value="${it.defQty}" class="qty-input w-12 text-center border border-leaf-200 rounded-lg py-1.5 text-base font-semibold" data-item="${it.key}">
        <button type="button" class="qty-plus w-8 h-8 rounded-full bg-leaf-50 hover:bg-leaf-100 text-leaf-700 text-lg font-bold shrink-0" data-item="${it.key}">+</button>
      </span>
      <span class="item-fields">
        <input type="number" min="0" step="0.1" value="${it.defHours}" class="hours-input w-full text-center border border-leaf-200 rounded-lg py-2 text-base font-semibold" data-item="${it.key}">
      </span>
      <span class="item-fields item-wh text-base font-bold text-leaf-800" data-item="${it.key}">০</span>
    </div>
  </label>`;
}

function buildRadioGroup(containerId, options, name){
  const el = document.getElementById(containerId);
  el.innerHTML = options.map((o,i) => `
    <label class="pill-radio cursor-pointer">
      <input type="radio" name="${name}" value="${o.key}" class="sr-only" ${i===0?'checked':''}>
      <div class="pill-label bg-leaf-50 hover:bg-leaf-100 rounded-2xl px-6 py-4 text-center min-w-[150px] border border-leaf-100">
        <div class="font-bold text-lg text-ink-800">${o.label}</div>
        <div class="pill-sub text-base text-ink-700/70 mt-1">${o.sub}</div>
      </div>
    </label>
  `).join('');
}

function findItemMeta(key){
  for (const cat of LOAD_CATEGORIES){
    const it = cat.items.find(i => i.key === key);
    if (it) return { item: it, cat };
  }
  return null;
}

function getSelectedLoadItems(){
  const checks = document.querySelectorAll('.item-check:checked');
  return Array.from(checks).map(c => {
    const key = c.dataset.item;
    const cap = parseFloat(document.querySelector(`.cap-select[data-item="${key}"]`).value || '0');
    const qty = Math.max(0, parseInt(document.querySelector(`.qty-input[data-item="${key}"]`).value || '0', 10));
    const hours = Math.max(0, parseFloat(document.querySelector(`.hours-input[data-item="${key}"]`).value || '0'));
    return { key, cap, qty, hours, wh: cap * qty * hours };
  });
}

function getMultiplier(name, list){
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  const opt = list.find(o => o.key === (checked ? checked.value : list[0].key));
  return opt.mult;
}

function calcDailykWh(){
  const items = getSelectedLoadItems();
  const wh = items.reduce((sum, i) => sum + i.wh, 0);
  const houseMult = getMultiplier('house', HOUSE_OPTIONS);
  const backupMult = getMultiplier('backup', BACKUP_OPTIONS);
  return (wh * houseMult * backupMult) / 1000;
}

function refreshLoadDisplays(){
  document.querySelectorAll('.item-check').forEach(cb => {
    const key = cb.dataset.item;
    const whEl = document.querySelector(`.item-wh[data-item="${key}"]`);
    if (!whEl) return;
    if (!cb.checked){ whEl.textContent = '০'; return; }
    const cap = parseFloat(document.querySelector(`.cap-select[data-item="${key}"]`).value || '0');
    const qty = Math.max(0, parseInt(document.querySelector(`.qty-input[data-item="${key}"]`).value || '0', 10));
    const hours = Math.max(0, parseFloat(document.querySelector(`.hours-input[data-item="${key}"]`).value || '0'));
    whEl.textContent = bnNum(Math.round(cap * qty * hours));
  });

  document.querySelectorAll('.cat-card').forEach(card => {
    const catKey = card.dataset.cat;
    const cat = LOAD_CATEGORIES.find(c => c.key === catKey);
    let sub = 0;
    cat.items.forEach(it => {
      const cb = document.querySelector(`.item-check[data-item="${it.key}"]`);
      if (cb && cb.checked){
        const cap = parseFloat(document.querySelector(`.cap-select[data-item="${it.key}"]`).value || '0');
        const qty = Math.max(0, parseInt(document.querySelector(`.qty-input[data-item="${it.key}"]`).value || '0', 10));
        const hours = Math.max(0, parseFloat(document.querySelector(`.hours-input[data-item="${it.key}"]`).value || '0'));
        sub += cap * qty * hours;
      }
    });
    card.querySelector('.cat-subtotal').textContent = `${bnNum(Math.round(sub))} Wh/day`;
  });
}

function matchPackage(neededkWh){
  const sorted = [...PACKAGES].sort((a,b) => a.kw - b.kw);
  for (const p of sorted){
    if (neededkWh <= p.dailyMax) return p;
  }
  return sorted[sorted.length - 1];
}

function setDial(arcEl, valueEl, kWh, maxScale, circumference){
  const ratio = Math.min(kWh / maxScale, 1);
  arcEl.setAttribute('stroke-dashoffset', String(circumference * (1 - ratio)));
  if (valueEl) valueEl.textContent = kWh.toLocaleString('bn-BD', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

function refreshLivePreview(){
  refreshLoadDisplays();
  const kWh = calcDailykWh();
  setDial(document.getElementById('liveDialArc'), document.getElementById('livekWh'), kWh, 50, 251);
  setDial(document.getElementById('heroDialArc'), document.getElementById('heroDialValue'), kWh, 50, 515);
}

function renderPackages(){
  const wrap = document.getElementById('tierContainer');
  wrap.innerHTML = TIER_ORDER.map(tier => {
    const items = PACKAGES.filter(p => p.tier === tier);
    return `
      <div>
        <div class="flex items-center gap-3 mb-5">
          <span class="font-display text-lg text-leaf-800">${items[0].tierBn}</span>
          <span class="h-px flex-1 bg-leaf-100"></span>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${items.map(p => packageCardHtml(p)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function packageCardHtml(p){
  return `
  <div id="card-${p.id}" class="pkg-card relative bg-white border border-leaf-100 rounded-3xl shadow-card overflow-hidden">
    <div class="h-1.5 bg-gradient-to-r from-leaf-500 to-sun-400"></div>
    ${p.popular ? `<span class="absolute top-4 right-4 bg-gold-400 text-leaf-900 text-[11px] font-bold px-3 py-1 rounded-full">সবচেয়ে জনপ্রিয়</span>` : ''}
    <div class="p-6">
      <span class="text-sun-600 font-semibold text-sm">${p.kw} kW</span>
      <h3 class="font-display text-2xl text-leaf-900 mt-1">${p.nameBn}</h3>
      <p class="text-ink-700/70 text-sm italic">"${p.nameBn}" — ${p.nameEn}</p>
      <p class="text-ink-700 text-sm mt-2">${p.tagline}</p>
      <ul class="mt-4 space-y-1.5 text-sm text-ink-800">
        ${p.equipment.map(e => `<li class="flex gap-2"><span class="text-leaf-500">●</span>${e}</li>`).join('')}
      </ul>
      <div class="mt-4 flex items-center justify-between text-sm bg-leaf-50 rounded-xl px-3 py-2">
        <span class="text-ink-700">দৈনিক উৎপাদন</span>
        <span class="font-semibold text-leaf-800">${bnNum(p.dailyMin)}–${bnNum(p.dailyMax)} ইউনিট/দিন</span>
      </div>
      <div class="mt-4">
        <p class="text-xs text-ink-700/60">আনুমানিক মূল্য</p>
        <p class="font-display text-lg text-leaf-800">${taka(p.priceMin)} – ${taka(p.priceMax)}</p>
      </div>
      <button class="book-btn mt-5 w-full bg-leaf-700 hover:bg-leaf-800 text-white font-semibold py-2.5 rounded-full" data-pkg="${p.nameBn} (${p.kw}kW)">বुक করুন</button>
    </div>
  </div>`;
}

function showResult(p, neededkWh){
  const box = document.getElementById('resultBox');
  const content = document.getElementById('resultContent');
  content.innerHTML = `
    <div class="grid sm:grid-cols-[1fr_auto] gap-6 items-center">
      <div>
        <p class="text-ink-700 text-base">আপনার আনুমানিক প্রয়োজন: <span class="font-semibold text-leaf-800">${neededkWh.toLocaleString('bn-BD',{maximumFractionDigits:1})} ইউনিট/দিন</span></p>
        <h3 class="font-display text-3xl text-leaf-900 mt-2">${p.nameBn} <span class="text-lg text-ink-700/60">(${p.kw} kW) — ${p.nameEn}</span></h3>
        <p class="text-ink-700 text-base mt-1">${p.tagline}</p>
        <p class="text-base text-ink-700 mt-3"><strong>উপযুক্ত:</strong> ${p.suitable}</p>
        <p class="font-display text-xl text-leaf-800 mt-2">${taka(p.priceMin)} – ${taka(p.priceMax)}</p>
      </div>
      <button id="resultBookBtn" data-pkg="${p.nameBn} (${p.kw}kW)" class="book-btn bg-sun-500 hover:bg-sun-600 text-white font-semibold text-base px-8 py-3.5 rounded-full whitespace-nowrap">এই প্যাকেজ বুক করুন</button>
    </div>
  `;
  box.classList.remove('hidden');
  box.scrollIntoView({ behavior:'smooth', block:'center' });

  const card = document.getElementById(`card-${p.id}`);
  if (card){
    setTimeout(() => {
      card.classList.add('pkg-highlight', 'ring-2', 'ring-sun-400');
    }, 600);
  }
}

/* ================== EVENT HANDLERS & BINDINGS ================== */
const modal = document.getElementById('contactModal');
let modalPurpose = null;
let pendingBookPkg = null;

function openModal(purpose, pkgName){
  modalPurpose = purpose;
  pendingBookPkg = pkgName || null;
  document.getElementById('modalTitle').textContent = purpose === 'book' ? 'প্যাকেজ বুক করুন' : 'আপনার প্যাকেজ দেখার জন্য তথ্য দিন';
  document.getElementById('modalSub').textContent = purpose === 'book' ? `আপনি "${pkgName}" প্যাকেজের জন্য আগ্রহ প্রকাশ করছেন।` : 'ফলাফল দেখানোর আগে আপনার যোগাযোগের তথ্যটি দিন।';
  document.getElementById('contactForm').reset();
  document.getElementById('phoneError').classList.add('hidden');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModalFn(){
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('opacity-0','translate-y-4');
  setTimeout(() => t.classList.add('opacity-0','translate-y-4'), 3200);
}

document.getElementById('closeModal').addEventListener('click', closeModalFn);
modal.addEventListener('click', e => { if (e.target === modal) closeModalFn(); });

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('inputName').value.trim();
  const phone = document.getElementById('inputPhone').value.trim();
  if (!/^01[3-9]\d{8}$/.test(phone)){
    document.getElementById('phoneError').classList.remove('hidden');
    return;
  }
  document.getElementById('phoneError').classList.add('hidden');
  closeModalFn();

  if (modalPurpose === 'calculate'){
    const kWh = calcDailykWh();
    const pkg = matchPackage(kWh);
    showResult(pkg, kWh);
    showToast(`ধন্যবাদ ${name}! আপনার প্যাকেজ নিচে দেখানো হয়েছে।`);
  } else {
    showToast(`ধন্যবাদ ${name}! "${pendingBookPkg}" প্যাকেজের জন্য আমরা শীঘ্রই যোগাযোগ করব।`);
  }
});

function attachLoadEvents(){
  document.querySelectorAll('.cat-header').forEach(header => {
    header.addEventListener('click', () => { header.closest('.cat-card').classList.toggle('open'); });
  });
  
  document.getElementById('expandAllBtn').addEventListener('click', () => {
    const cards = document.querySelectorAll('.cat-card');
    const allOpen = Array.from(cards).every(c => c.classList.contains('open'));
    cards.forEach(c => c.classList.toggle('open', !allOpen));
    document.getElementById('expandAllBtn').textContent = allOpen ? 'সব ক্যাটাগরি খুলুন' : 'সব ক্যাটাগরি বন্ধ করুন';
  });

  document.querySelectorAll('.cap-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const itemKey = e.target.dataset.item;
      const selectedWatt = e.target.value;
      const meta = findItemMeta(itemKey);
      if(meta && meta.item.hoursMap[selectedWatt] !== undefined) {
        const hoursInp = document.querySelector(`.hours-input[data-item="${itemKey}"]`);
        if(hoursInp) hoursInp.value = meta.item.hoursMap[selectedWatt];
      }
      refreshLivePreview();
    });
  });

  document.querySelectorAll('.item-check').forEach(cb => { cb.addEventListener('change', refreshLivePreview); });
  document.querySelectorAll('.hours-input').forEach(el => {
    el.addEventListener('change', refreshLivePreview);
    el.addEventListener('input', refreshLivePreview);
  });
  document.querySelectorAll('.qty-input').forEach(inp => inp.addEventListener('input', refreshLivePreview));
  
  document.querySelectorAll('.qty-plus').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const inp = document.querySelector(`.qty-input[data-item="${btn.dataset.item}"]`);
    inp.value = (parseInt(inp.value||'0',10) + 1);
    const cb = document.querySelector('.item-check[data-item="' + btn.dataset.item + '"]');
    if (cb && !cb.checked) cb.checked = true;
    refreshLivePreview();
  }));
  
  document.querySelectorAll('.qty-minus').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const inp = document.querySelector(`.qty-input[data-item="${btn.dataset.item}"]`);
    inp.value = Math.max(0, parseInt(inp.value||'0',10) - 1);
    refreshLivePreview();
  }));
}

document.getElementById('findPackageBtn').addEventListener('click', () => {
  const errEl = document.getElementById('formError');
  if (!getSelectedLoadItems().length){
    errEl.classList.remove('hidden');
    return;
  }
  errEl.classList.add('hidden');
  openModal('calculate');
});

/* ================== DOM INITIALIZATION ================== */
document.addEventListener('DOMContentLoaded', () => {
  buildLoadAccordion();
  buildRadioGroup('backupGroup', BACKUP_OPTIONS, 'backup');
  buildRadioGroup('houseGroup', HOUSE_OPTIONS, 'house');
  renderPackages();
  attachLoadEvents();
  
  document.querySelectorAll('input[name="house"], input[name="backup"]').forEach(r => r.addEventListener('change', refreshLivePreview));
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.book-btn');
    if (btn) openModal('book', btn.dataset.pkg);
  });
  
  refreshLivePreview();
});