// home.js - অ্যাকর্ডিয়ন বেজড সোলার ক্যালকুলেটর লজিক

document.addEventListener("DOMContentLoaded", function () {
    // ১. জ্যাঙ্গো থেকে পাঠানো ক্যাটাগরি ম্যাপিং
    // আপনার ডাটাবেজের ক্যাটাগরি নামের সাথে মিল রেখে নিচের ম্যাপটি চেক করে নিন
    const categoryMapping = {
        'lighting': 'lighting-sub',
        'fan': 'fan-sub',
        'ac': 'ac-sub',
        'kitchen': 'kitchen-sub'
    };

    // ২. অ্যাকর্ডিয়নের ভেতরে লোড লিস্ট জেনারেট করা
    function renderApplianceRows() {
        // শুরুতে সব সাব-কন্টেইনার খালি করা
        Object.values(categoryMapping).forEach(id => {
            const container = document.getElementById(id);
            if (container) container.innerHTML = '';
        });

        if (!dbAppliances || dbAppliances.length === 0) {
            return;
        }

        // প্রতিটি অ্যাপ্লায়েন্সের জন্য মাল্টি-লাইন ইনপুট রো তৈরি
        dbAppliances.forEach(appliance => {
            // ডাটাবেজের ক্যাটাগরি ছোট হাতের অক্ষরে রূপান্তর
            const dbCat = (appliance.category || '').toLowerCase();
            
            // সঠিক সাব-কন্টেইনার আইডি খুঁজে বের করা
            let targetContainerId = categoryMapping[dbCat];
            
            // যদি হুবহু ম্যাচ না করে, তবে আংশিক ম্যাচ খোঁজা (যেমন: air conditioner এর জন্য ac)
            if (!targetContainerId) {
                if (dbCat.includes('light') || dbCat.includes('আলো')) targetContainerId = 'lighting-sub';
                else if (dbCat.includes('fan') || dbCat.includes('ফ্যান')) targetContainerId = 'fan-sub';
                else if (dbCat.includes('ac') || dbCat.includes('conditioner')) targetContainerId = 'ac-sub';
                else if (dbCat.includes('kitchen') || dbCat.includes('রান্না')) targetContainerId = 'kitchen-sub';
            }

            const container = document.getElementById(targetContainerId);

            if (container) {
                const rowHtml = `
                    <div class="appliance-row d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 py-3 border-bottom" data-id="${appliance.id}">
                        <div class="d-flex align-items-center gap-2" style="min-width: 200px;">
                            <span class="fw-bold text-dark" style="font-size: 0.95rem;">${appliance.name}</span>
                        </div>
                        
                        <div class="d-flex flex-wrap align-items-center gap-3 justify-content-start justify-content-md-end w-100">
                            <!-- সংখ্যা বা কোয়ান্টিটি কন্ট্রোল -->
                            <div class="d-flex align-items-center bg-light border rounded p-1">
                                <button type="button" class="btn btn-sm btn-light btn-qty-control fw-bold qty-minus">-</button>
                                <input type="text" class="form-control form-control-sm border-0 bg-transparent input-qty-box text-center qty-input" value="0" style="width: 35px; font-weight: 700;" readonly>
                                <button type="button" class="btn btn-sm btn-light btn-qty-control fw-bold qty-plus">+</button>
                            </div>
                            
                            <!-- ওয়াট ইনপুট -->
                            <div class="d-flex align-items-center gap-1">
                                <input type="number" class="form-control form-control-sm text-center watt-input" value="${appliance.default_watt || 0}" style="width: 70px;">
                                <span class="small text-muted">W</span>
                            </div>
                            
                            <!-- দৈনিক ঘণ্টা ইনপুট -->
                            <div class="d-flex align-items-center gap-1">
                                <input type="number" class="form-control form-control-sm text-center hours-input" value="${appliance.default_hours || 0}" style="width: 60px;">
                                <span class="small text-muted">Hrs</span>
                            </div>

                            <!-- এই লাইনের দৈনিক হিসাব -->
                            <div class="text-end" style="min-width: 90px;">
                                <span class="fw-bold text-secondary item-calc-val" style="font-size: 0.85rem;">0 Wh/d</span>
                            </div>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', rowHtml);
            }
        });

        // সব কন্টেইনারে রো ঢোকানো শেষে যদি কোনোটি খালি থাকে, সেখানে মেসেজ দেখানো
        Object.values(categoryMapping).forEach(id => {
            const container = document.getElementById(id);
            if (container && container.innerHTML === '') {
                container.innerHTML = '<p class="text-muted small mb-0 py-2 text-center">এই ক্যাটাগরিতে কোনো ডাটা নেই।</p>';
            }
        });

        // ইভেন্ট লিসেনারগুলো যুক্ত করা
        initRowEvents();
    }

    // ৩. কোয়ান্টিটি বাটন এবং ইনপুট পরিবর্তনের লিসেনার
    function initRowEvents() {
        const containers = Object.values(categoryMapping).map(id => document.getElementById(id)).filter(el => el);

        containers.forEach(container => {
            container.addEventListener('click', function (e) {
                // ইভেন্ট বাবলিং যেন অ্যাকর্ডিয়ন মেইন বারকে বন্ধ না করে দেয়
                e.stopPropagation();

                const row = e.target.closest('.appliance-row');
                if (!row) return;

                const qtyInput = row.querySelector('.qty-input');
                let currentQty = parseInt(qtyInput.value) || 0;

                if (e.target.classList.contains('qty-plus')) {
                    qtyInput.value = currentQty + 1;
                    calculateCalculations();
                } else if (e.target.classList.contains('qty-minus')) {
                    if (currentQty > 0) {
                        qtyInput.value = currentQty - 1;
                        calculateCalculations();
                    }
                }
            });

            // ওয়াট বা ঘণ্টা টাইপ করে চেঞ্জ করলে রিয়েল-টাইম হিসাব
            container.addEventListener('input', function (e) {
                if (e.target.classList.contains('watt-input') || e.target.classList.contains('hours-input')) {
                    calculateCalculations();
                }
            });
        });
    }

    // ৪. সোলার ক্যালকুলেশন এবং সামারি আপডেট ইঞ্জিন
    function calculateCalculations() {
        let totalConnectedLoad = 0;
        let totalDailyEnergyWh = 0;
        let selectedItemsCount = 0;

        // প্রতিটি ক্যাটাগরি ভিত্তিক সামারি ট্র্যাকিং
        const catTotals = { 'lighting-sub': 0, 'fan-sub': 0, 'ac-sub': 0, 'kitchen-sub': 0 };

        const rows = document.querySelectorAll('.appliance-row');
        rows.forEach(row => {
            const qty = parseInt(row.querySelector('.qty-input').value) || 0;
            const watt = parseFloat(row.querySelector('.watt-input').value) || 0;
            const hours = parseFloat(row.querySelector('.hours-input').value) || 0;

            const lineLoad = qty * watt;
            const lineEnergyWh = lineLoad * hours;

            // লাইনের পাশে ইন্ডিভিজুয়াল রেজাল্ট আপডেট
            row.querySelector('.item-calc-val').innerText = `${Math.round(lineEnergyWh)} Wh/d`;

            if (qty > 0) {
                totalConnectedLoad += lineLoad;
                totalDailyEnergyWh += lineEnergyWh;
                selectedItemsCount += qty;

                // কোন ক্যাটাগরির আন্ডারে এই রো-টি আছে তার টোটালে যোগ করা
                const parentContainer = row.closest('.sub-load-container');
                if (parentContainer && catTotals.hasOwnProperty(parentContainer.id)) {
                    catTotals[parentContainer.id] += lineEnergyWh;
                }
            }
        });

        // ৫. অ্যাকর্ডিয়ন বারের পাশে ক্যাটাগরি ভিত্তিক মোট হিসাব দেখানো
        document.getElementById('lighting-total-val').innerText = `${Math.round(catTotals['lighting-sub'])} Wh/day`;
        document.getElementById('fan-total-val').innerText = `${Math.round(catTotals['fan-sub'])} Wh/day`;
        document.getElementById('ac-total-val').innerText = `${Math.round(catTotals['ac-sub'])} Wh/day`;
        document.getElementById('kitchen-total-val').innerText = `${Math.round(catTotals['kitchen-sub'])} Wh/day`;

        // ৬. রাইট সাইড ড্যাশবোর্ড সামারি আপডেট
        const dailyEnergykWh = totalDailyEnergyWh / 1000;
        const monthlyEnergykWh = dailyEnergykWh * 30;

        document.getElementById('total-items-count').innerText = `${selectedItemsCount} Items Selected`;
        document.getElementById('connected-load').innerText = `${totalConnectedLoad} W`;
        document.getElementById('peak-load').innerText = `${totalConnectedLoad} W`; // সিম্পল পিক লোড লজিক
        document.getElementById('daily-energy').innerText = `${dailyEnergykWh.toFixed(2)} kWh`;
        document.getElementById('monthly-energy').innerText = `${monthlyEnergykWh.toFixed(2)} kWh`;

        // ৭. সোলার সিস্টেম রিকমেন্ডেশন অ্যালগরিদম (আপনার রুল অনুযায়ী টিউন করতে পারেন)
        let solarKw = 0;
        let inverterKw = 0;
        let batteryAh = 0;
        let estCost = 0;

        if (totalConnectedLoad > 0) {
            // প্যানেল সাইজ = (দৈনিক এনার্জি Wh / ৪.৫ পিক আওয়ার) * ১.২৫ সেফটি ফ্যাক্টর
            solarKw = (totalDailyEnergyWh / 4.5) * 1.25 / 1000;
            // ইনভার্টার সাইজ = কানেক্টেড লোড * ১.২ সেফটি ফ্যাক্টর
            inverterKw = (totalConnectedLoad * 1.2) / 1000;
            
            // একটি সক্রিয় ব্যাকআপ মান বাটন থেকে নেওয়ার লজিক (ডিফল্ট ২ ঘণ্টা ধরলাম)
            const activeBackupBtn = document.querySelector('[data-backup].active');
            const backupHours = activeBackupBtn ? parseInt(activeBackupBtn.getAttribute('data-backup')) : 2;
            
            // ব্যাটারি Ah = (দৈনিক ওয়াট-আওয়ার * ব্যাকআপ ঘণ্টা) / (১২V * ০.৭ এফিশিয়েন্সি)
            batteryAh = (totalConnectedLoad * backupHours) / (12 * 0.7);
            
            // আনুমানিক খরচ (ডামি হিসাব, আপনার রেট অনুযায়ী পরিবর্তন করতে পারেন)
            estCost = (solarKw * 85000) + (inverterKw * 40000) + ((batteryAh / 200) * 22000);
        }

        document.getElementById('solar-size').innerText = `${solarKw.toFixed(2)} kW`;
        document.getElementById('inverter-size').innerText = `${inverterKw.toFixed(2)} kW`;
        document.getElementById('battery-size').innerText = `${Math.round(batteryAh)} Ah`;
        document.getElementById('estimated-cost').innerText = `৳ ${Math.round(estCost).toLocaleString('bn-BD')}`;
    }

    // সব ক্যাটাগরি একসাথে এক্সপ্যান্ড করার বাটন লজিক
    document.getElementById('expand-all-btn').addEventListener('click', function(e) {
        e.preventDefault();
        const containers = document.querySelectorAll('.sub-load-container');
        const icons = document.querySelectorAll('.load-category-item .fa-chevron-right');
        
        const isAnyClosed = Array.from(containers).some(c => c.style.display !== "block");
        
        containers.forEach((c, index) => {
            c.style.display = isAnyClosed ? "block" : "none";
            if (icons[index]) icons[index].style.transform = isAnyClosed ? "rotate(90deg)" : "rotate(0deg)";
        });
        
        this.innerText = isAnyClosed ? "সব ক্যাটাগরি বন্ধ করুন" : "সব ক্যাটাগরি খুলুন";
    });

    // ইনিশিয়াল রান
    renderApplianceRows();
});