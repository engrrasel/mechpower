/* ================== DATA CONFIGURATIONS ================== */
const APPLIANCES_DATA = [
  { key: 'led',       name: 'এলইডি লাইট (LED)',      w: 12,   icon: '💡' },
  { key: 'fan',       name: 'সিলিং ফ্যান (Fan)',      w: 75,   icon: '🌀' },
  { key: 'tv',        name: 'টেলিভিশন (LED TV)',     w: 60,   icon: '📺' },
  { key: 'fridge',    name: 'রেফ্রিজারেটর (Fridge)',    w: 150,  icon: '❄️' },
  { key: 'pc',        name: 'কম্পিউটার (Desktop)',    w: 200,  icon: '🖥️' },
  { key: 'pump',      name: 'পানির পাম্প (0.5 HP)',  w: 375,  icon: '🚰' },
  { key: 'ac',        name: 'ইনভার্টার এসি (1 Ton)',  w: 1100, icon: '🍃' }
];

const BACKUP_OPTIONS = [
  { key: '2h',  name: '২ ঘণ্টা (Standard)', h: 2, sub: 'সাধারণ ব্যবহার' },
  { key: '4h',  name: '৪ ঘণ্টা (Extended)', h: 4, sub: 'দীর্ঘ ব্যাকআপ' },
  { key: '8h',  name: '৮ ঘণ্টা (Full Night)', h: 8, sub: 'সারারাত ব্যাকআপ' }
];

const HOUSE_OPTIONS = [
  { key: 'on-grid',  name: 'অন-গ্রিড সিস্টেম', factor: 1.0, sub: 'বিদ্যুৎ বিল সাশ্রয়' },
  { key: 'off-grid', name: 'অফ-গ্রিড সিস্টেম', factor: 1.3, sub: 'লোডশেডিং মুক্ত' }
];

const PACKAGES_DATA = [
  {
    tierName: "আবাসিক ও সাধারণ সলিউশন (Residential Series)",
    packages: [
      { id: 'eco', name: 'ইকো লাইট (Eco)', maxkWh: 1.5, panel: '250W', battery: '100Ah', inverter: '400VA', price: '১৫,৫০০' },
      { id: 'smart', name: 'স্মার্ট হোম (Smart)', maxkWh: 4.5, panel: '650W', battery: '150Ah', inverter: '1000VA', price: '৩৪,০০০' },
      { id: 'premium', name: 'প্রিমিয়াম ম্যাক্স (Max)', maxkWh: 10.0, panel: '1500W', battery: '200Ah x2', inverter: '2.5kVA', price: '৭৮,৫০০' }
    ]
  },
  {
    tierName: "বাণিজ্যিক ও হাই-পাওয়ার সলিউশন (Commercial Series)",
    packages: [
      { id: 'biz-starter', name: 'বিজনেস স্টার্টার', maxkWh: 20.0, panel: '3.5kW', battery: 'Lithium 5kWh', inverter: '5kW Inverter', price: '১,৮৫,০০০' },
      { id: 'industrial', name: 'মেগা ইন্ডাস্ট্রিয়াল', maxkWh: 999.0, panel: 'Custom (10kW+)', battery: 'Custom Storage', inverter: 'Industrial Grid', price: 'আলোচনা সাপেক্ষে' }
    ]
  }
];

/* ================== DOM GENERATORS ================== */
function initLayout() {
  // 1. Appliances Layout
  const eqGrid = document.getElementById('equipmentGrid');
  if(eqGrid) {
    eqGrid.innerHTML = APPLIANCES_DATA.map(a => `
      <div class="equip-container relative">
        <input type="checkbox" id="chk-${a.key}" class="equip-check hidden">
        <label for="chk-${a.key}" class="equip-card border border-leaf-100 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4 cursor-pointer select-none bg-white block">
          <div class="flex items-center gap-3">
            <div class="text-2xl">${a.icon}</div>
            <div>
              <p class="font-semibold text-leaf-900 text-sm">${a.name}</p>
              <p class="text-xs text-ink-700/60">${a.w} ওয়াট</p>
            </div>
          </div>
          <div class="qty-box flex items-center border border-leaf-200 rounded-lg overflow-hidden bg-leaf-50" onclick="e => e.preventDefault();">
            <button type="button" class="qty-btn px-2.5 py-1 font-bold text-leaf-700 hover:bg-leaf-100" data-action="minus" data-key="${a.key}">-</button>
            <input type="number" min="0" value="0" class="qty-input w-8 text-center bg-transparent font-bold text-sm text-leaf-900 focus:outline-none" data-key="${a.key}" readonly>
            <button type="button" class="qty-btn px-2.5 py-1 font-bold text-leaf-700 hover:bg-leaf-100" data-action="plus" data-key="${a.key}">+</button>
          </div>
        </label>
      </div>
    `).join('');
  }

  // 2. Backup Options
  const buGroup = document.getElementById('backupGroup');
  if(buGroup) {
    buGroup.innerHTML = BACKUP_OPTIONS.map((o, idx) => `
      <label class="pill-radio flex-1 min-w-[140px] cursor-pointer">
        <input type="radio" name="backup_time" value="${o.key}" ${idx===0?'checked':''} class="hidden">
        <div class="pill-label border border-leaf-200 rounded-xl p-3 bg-white text-center">
          <p class="text-xs font-semibold text-leaf-800">${o.name}</p>
          <p class="pill-sub text-[10px] text-ink-700/50 mt-0.5">${o.sub}</p>
        </div>
      </label>
    `).join('');
  }

  // 3. House Options
  const hsGroup = document.getElementById('houseGroup');
  if(hsGroup) {
    hsGroup.innerHTML = HOUSE_OPTIONS.map((o, idx) => `
      <label class="pill-radio flex-1 min-w-[140px] cursor-pointer">
        <input type="radio" name="house_type" value="${o.key}" ${idx===0?'checked':''} class="hidden">
        <div class="pill-label border border-leaf-200 rounded-xl p-3 bg-white text-center">
          <p class="text-xs font-semibold text-leaf-800">${o.name}</p>
          <p class="pill-sub text-[10px] text-ink-700/50 mt-0.5">${o.sub}</p>
        </div>
      </label>
    `).join('');
  }

  // 4. Power Packages Static
  const tierContainer = document.getElementById('tierContainer');
  if(tierContainer) {
    tierContainer.innerHTML = PACKAGES_DATA.map(tier => `
      <div>
        <h3 class="font-display text-lg text-leaf-800 mb-6 border-l-4 border-sun-500 pl-3">${tier.tierName}</h3>
        <div class="grid md:grid-cols-3 gap-6">
          ${tier.packages.map(p => `
            <div class="pkg-card bg-white border border-leaf-100 rounded-2xl p-6 shadow-soft flex flex-col justify-between">
              <div>
                <h4 class="font-display text-lg text-leaf-900">${p.name}</h4>
                <p class="text-xs text-ink-700/60 mt-1">দৈনিক সর্বোচ্চ উৎপাদন: ${p.maxkWh} kWh</p>
                <div class="mt-4 space-y-2 border-t border-dashed border-slate-100 pt-4 text-xs font-medium text-ink-700">
                  <p>☀️ প্যানেল: <span class="text-leaf-700">${p.panel}</span></p>
                  <p>🔋 ব্যাটারি: <span class="text-leaf-700">${p.battery}</span></p>
                  <p>🔌 ইনভার্টার: <span class="text-leaf-700">${p.inverter}</span></p>
                </div>
              </div>
              <div class="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <p class="text-[10px] uppercase text-ink-700/50">প্যাকেজ মূল্য</p>
                  <p class="font-display text-lg text-sun-600 font-extrabold">${p.price} ৳</p>
                </div>
                <button type="button" class="open-modal-btn bg-leaf-700 hover:bg-leaf-800 text-white text-xs font-bold px-4 py-2 rounded-full" data-name="${p.name}">বুক করুন</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
}

/* ================== METRICS LOGIC ================== */
function calculateMetrics() {
  let totalW = 0;
  APPLIANCES_DATA.forEach(a => {
    const check = document.getElementById(`chk-${a.key}`);
    const input = document.querySelector(`.qty-input[data-key="${a.key}"]`);
    if(check && check.checked) {
      const qty = parseInt(input ? input.value : '1', 10) || 1;
      totalW += (a.w * qty);
    }
  });

  const selectedBackupKey = document.querySelector('input[name="backup_time"]:checked')?.value || '2h';
  const backupHours = BACKUP_OPTIONS.find(o => o.key === selectedBackupKey)?.h || 2;

  const selectedHouseKey = document.querySelector('input[name="house_type"]:checked')?.value || 'on-grid';
  const houseFactor = HOUSE_OPTIONS.find(o => o.key === selectedHouseKey)?.factor || 1.0;

  let dailykWh = (totalW * backupHours * houseFactor) / 1000;
  return { totalW, dailykWh };
}

function updateLiveDials() {
  const { dailykWh } = calculateMetrics();
  const formattedValue = dailykWh.toFixed(1);

  // Live text update
  const liveTxt = document.getElementById('livekWh');
  if(liveTxt) liveTxt.textContent = formattedValue;

  // Sync Live SVG Arc
  const liveArc = document.getElementById('liveDialArc');
  if(liveArc) {
    const maxDash = 251;
    let offset = maxDash - (Math.min(dailykWh, 15) / 15) * maxDash;
    liveArc.style.strokeDashoffset = offset;
  }
}

function triggerHeroDialAnimation() {
  const heroVal = document.getElementById('heroDialValue');
  const heroArc = document.getElementById('heroDialArc');
  if(!heroVal || !heroArc) return;

  let current = 0;
  const target = 3.6; // standard base loading effect
  const duration = 1000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = progress * (2 - progress);

    let val = easeOutQuad * target;
    heroVal.textContent = val.toFixed(1);

    const maxDash = 515;
    heroArc.style.strokeDashoffset = maxDash - (val / 15) * maxDash;

    if (progress < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ================== ALERTS & MODALS ================== */
let activePackageName = "";

function showToastNotification(msg) {
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translate(-50%, 0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, 1rem)";
  }, 3000);
}

function openModal(pkgName) {
  activePackageName = pkgName;
  const modal = document.getElementById('contactModal');
  const subTitle = document.getElementById('modalSub');
  if(modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if(subTitle && pkgName) subTitle.innerHTML = `প্যাকেজ: <span class="text-leaf-700 font-bold">${pkgName}</span> এর জন্য আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবে।`;
  }
}

function closeModal() {
  const modal = document.getElementById('contactModal');
  if(modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  document.getElementById('contactForm')?.reset();
}

/* ================== ACTIONS / HANDLERS ================== */
function setupEventHandlers() {
  // Input checkboxes/radio states update logic
  document.body.addEventListener('change', e => {
    if(e.target.classList.contains('equip-check')) {
      const key = e.target.id.replace('chk-', '');
      const input = document.querySelector(`.qty-input[data-key="${key}"]`);
      if(e.target.checked && input && parseInt(input.value) === 0) {
        input.value = 1;
      } else if(!e.target.checked && input) {
        input.value = 0;
      }
    }
    updateLiveDials();
  });

  // Quantity control system (+ / -)
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if(!btn) return;
    
    e.preventDefault(); 
    e.stopPropagation();

    const key = btn.dataset.key;
    const action = btn.dataset.action;
    const input = document.querySelector(`.qty-input[data-key="${key}"]`);
    const check = document.getElementById(`chk-${key}`);
    
    if(!input || !check) return;

    let val = parseInt(input.value, 10) || 0;
    if(action === 'plus') val++;
    if(action === 'minus') val = Math.max(0, val - 1);
    
    input.value = val;
    check.checked = (val > 0);
    
    updateLiveDials();
  });

  // Open modal click handler
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.open-modal-btn');
    if(btn) openModal(btn.dataset.name);
  });

  // Calculator selector engine
  const findBtn = document.getElementById('findPackageBtn');
  if(findBtn) {
    findBtn.addEventListener('click', () => {
      const { totalW, dailykWh } = calculateMetrics();
      const errBox = document.getElementById('formError');
      const resBox = document.getElementById('resultBox');
      const resContent = document.getElementById('resultContent');

      if(totalW === 0) {
        if(errBox) errBox.classList.remove('hidden');
        if(resBox) resBox.classList.add('hidden');
        return;
      }
      if(errBox) errBox.classList.add('hidden');

      // Best matched package algorithm matching daily kWh load
      let recommended = null;
      for (const tier of PACKAGES_DATA) {
        for (const pkg of tier.packages) {
          if (dailykWh <= pkg.maxkWh) {
            recommended = pkg;
            break;
          }
        }
        if(recommended) break;
      }
      if(!recommended) recommended = PACKAGES_DATA[1].packages[1];

      if(resBox && resContent) {
        resContent.innerHTML = `
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 class="font-display text-xl text-leaf-900 font-bold">${recommended.name}</h4>
              <p class="text-sm text-ink-700/80 mt-1">আপনার হিসাবকৃত দৈনিক লোড: <strong>${dailykWh.toFixed(2)} kWh</strong></p>
              <div class="mt-3 text-xs text-ink-700 space-y-1">
                <p>☀️ প্যানেল মডিউল: ${recommended.panel}</p>
                <p>🔋 ব্যাটারি ব্যাংক: ${recommended.battery}</p>
                <p>🔌 সোলার ইনভার্টার: ${recommended.inverter}</p>
              </div>
            </div>
            <div class="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 flex justify-between sm:block">
              <div>
                <p class="text-xs text-ink-700/50">আনুমানিক প্রারম্ভিক মূল্য</p>
                <p class="font-display text-2xl text-sun-600 font-black">${recommended.price} ৳</p>
              </div>
              <button type="button" class="open-modal-btn mt-2 bg-sun-500 hover:bg-sun-600 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-soft" data-name="${recommended.name}">বুকিং ও ফ্রি ভিজিট অনুরোধ</button>
            </div>
          </div>
        `;
        resBox.classList.remove('hidden');
        resBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Close modal action trigger
  document.getElementById('closeModal')?.addEventListener('click', closeModal);

  // Form submission validation logic
  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const phone = document.getElementById('inputPhone').value.trim();
    const phoneErr = document.getElementById('phoneError');
    
    if(!/^01[3-9]\d{8}$/.test(phone)) {
      if(phoneErr) phoneErr.classList.remove('hidden');
      return;
    }
    if(phoneErr) phoneErr.classList.add('hidden');

    closeModal();
    showToastNotification(`ধন্যবাদ! আপনার ${activePackageName || 'প্যাকেজ'} বুকিং সফল হয়েছে।`);
  });
}

/* ================== INIT SYSTEM ================== */
document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  setupEventHandlers();
  triggerHeroDialAnimation();
});