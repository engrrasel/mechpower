/* home.js (ইমেজ আইকন ও সেটিংসের সাথে পুরোপুরি অপ্টিমাইজড) */

const searchInput = document.getElementById('searchAppliance');
const dropdownResults = document.getElementById('dropdownResults');
const selectedList = document.getElementById('selected-appliances-list');
const emptyStateMsg = document.getElementById('empty-state-msg');

// ১. সেফটি গার্ড: যদি জ্যাঙ্গো থেকে ডাটা না আসে
if (typeof dbAppliances === 'undefined') {
    window.dbAppliances = [];
    console.error("Django থেকে appliances_json ডাটা জাভাস্ক্রিপ্টে পৌঁছায়নি!");
}

// ২. রেসিডেন্সিয়াল / ইন্ডাস্ট্রিয়াল ফিল্টার চেঞ্জ লজিক
document.querySelectorAll('.segment-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
        searchInput.value = ''; 
        dropdownResults.style.display = 'none';
        
        // ক্যাটাগরি পরিবর্তনের সাথে সাথে তালিকা পরিষ্কার করে নতুন ডিফল্ট আইটেম লোড করা
        selectedList.innerHTML = '';
        loadDefaultAppliances();
    });
});

// ৩. রিয়েল-টাইম লাইভ সার্চ এবং ড্রপডাউন জেনারেটর (ইমেজ আইকন সহ)
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    dropdownResults.innerHTML = '';
    
    if (query.length === 0) {
        dropdownResults.style.display = 'none';
        return;
    }

    const filtered = dbAppliances.filter(item => 
        item.category.toLowerCase() === currentCategory && 
        (item.name.toLowerCase().includes(query) || (item.variant_name && item.variant_name.toLowerCase().includes(query)))
    );

    if (filtered.length > 0) {
        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-result-item d-flex justify-content-between align-items-center';
            div.innerHTML = `
                <div>
                    <img src="${item.icon_url}" alt="${item.name}" class="me-2" style="width: 22px; height: 22px; object-fit: contain;">
                    <strong>${item.name}</strong> 
                    ${item.variant_name ? `<span class="badge bg-light text-dark ms-1">${item.variant_name}</span>` : ''}
                </div>
                <small class="text-muted">${item.watt} W</small>
            `;
            div.addEventListener('click', () => {
                addApplianceRow(item);
                searchInput.value = '';
                dropdownResults.style.display = 'none';
            });
            dropdownResults.appendChild(div);
        });
        dropdownResults.style.display = 'block';
    } else {
        dropdownResults.innerHTML = `<div class="p-3 text-muted small text-center">কোনো অ্যাপ্লায়েন্স পাওয়া যায়নি।</div>`;
        dropdownResults.style.display = 'block';
    }
});

// ৪. ডাইনামিক রো অ্যাড করার মূল ফাংশন (ইমেজ আইকন সহ)
function addApplianceRow(item) {
    if(emptyStateMsg) emptyStateMsg.style.display = 'none';

    const row = document.createElement('div');
    row.className = 'selected-item-row row g-2 align-items-center';
    
    row.innerHTML = `
        <div class="col-md-3 col-12">
            <span class="fw-semibold text-dark">
                <img src="${item.icon_url}" alt="${item.name}" class="me-2" style="width: 24px; height: 24px; object-fit: contain;">
                ${item.name}
            </span>
            <small class="text-muted d-block ms-4">${item.variant_name ? item.variant_name : 'Default Variant'}</small>
        </div>
        <div class="col-md-3 col-4">
            <div class="input-group input-group-sm">
                <span class="input-group-text bg-light text-muted" style="font-size:0.75rem;">Watt</span>
                <input type="number" class="form-control watt-input" value="${item.watt}" min="1">
            </div>
        </div>
        <div class="col-md-3 col-4">
            <div class="input-group input-group-sm">
                <span class="input-group-text bg-light text-muted" style="font-size:0.75rem;">Qty</span>
                <input type="number" class="form-control qty-input" value="1" min="1">
            </div>
        </div>
        <div class="col-md-2 col-3">
            <div class="input-group input-group-sm">
                <span class="input-group-text bg-light text-muted" style="font-size:0.75rem;">Hr</span>
                <input type="number" class="form-control hour-input" value="4" min="0" max="24">
            </div>
        </div>
        <div class="col-md-1 col-1 text-end">
            <button class="btn btn-sm btn-link text-danger p-0 btn-delete-row"><i class="fa-solid fa-trash-can fs-5"></i></button>
        </div>
    `;

    selectedList.appendChild(row);
    updateTotalCount();
    calculateLoad();
}

// ৫. এডমিন থেকে টিক দেওয়া প্রতিটি নির্দিষ্ট ভ্যারিয়েন্ট লোড করার ফাংশন
function loadDefaultAppliances() {
    dbAppliances.forEach(item => {
        // যদি ঐ নির্দিষ্ট ভ্যারিয়েন্টটিতে এডমিন প্যানেলে টিক দেওয়া থাকে এবং ক্যাটাগরি মিলে যায়
        if (item.is_default && item.category.toLowerCase() === currentCategory) {
            // কোনো ফিল্টার ছাড়াই সরাসরি প্রত্যেকটি সিলেক্টেড ভ্যারিয়েন্টকে তালিকায় যোগ করবে
            addApplianceRow(item);
        }
    });

    updateTotalCount();
    calculateLoad();
}

// ৬. ইভেন্ট ডেলিগেশন (ইনপুট চেঞ্জ এবং ডিলিট)
selectedList.addEventListener('input', function(e) {
    if(e.target.matches('.watt-input, .qty-input, .hour-input')) {
        calculateLoad();
    }
});

selectedList.addEventListener('click', function(e) {
    if(e.target.closest('.btn-delete-row')) {
        e.target.closest('.selected-item-row').remove();
        updateTotalCount();
        calculateLoad();
    }
});

// ড্রপডাউন বন্ধ করার লজিক
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !dropdownResults.contains(e.target)) {
        dropdownResults.style.display = 'none';
    }
});

function updateTotalCount() {
    const rows = document.querySelectorAll('.selected-item-row').length;
    document.getElementById('total-items-count').innerText = `${rows} Items`;
    
    if(rows === 0) {
        if(!document.getElementById('empty-state-msg')) {
            const msg = document.createElement('div');
            msg.id = 'empty-state-msg';
            msg.className = 'text-center py-5 text-muted bg-white rounded-3 border border-dashed';
            msg.innerHTML = `<i class="fa-solid fa-search fs-2 mb-2 text-secondary"></i><p class="mb-0">উপরের সার্চ বারে অ্যাপ্লায়েন্সের নাম লিখে তালিকায় যোগ করুন।</p>`;
            selectedList.appendChild(msg);
        } else {
            document.getElementById('empty-state-msg').style.display = 'block';
        }
    }
}

// ৭. লাইভ ক্যালকুলেশন কোর ফাংশন
function calculateLoad() {
    let connectedLoad = 0;
    let dailyEnergyWh = 0;

    document.querySelectorAll('.selected-item-row').forEach(row => {
        const watt = parseFloat(row.querySelector('.watt-input').value) || 0;
        const qty = parseFloat(row.querySelector('.qty-input').value) || 0;
        const hours = parseFloat(row.querySelector('.hour-input').value) || 0;

        connectedLoad += (watt * qty);
        dailyEnergyWh += (watt * qty * hours);
    });

    const dailyEnergykWh = dailyEnergyWh / 1000;
    
    // UI সামারি প্যানেল আপডেট
    if(document.getElementById('connected-load')) document.getElementById('connected-load').innerText = connectedLoad + " W";
    if(document.getElementById('peak-load')) document.getElementById('peak-load').innerText = connectedLoad + " W";
    if(document.getElementById('daily-energy')) document.getElementById('daily-energy').innerText = dailyEnergykWh.toFixed(2) + " kWh";
    if(document.getElementById('monthly-energy')) document.getElementById('monthly-energy').innerText = (dailyEnergykWh * 30).toFixed(2) + " kWh";
}

// পেজ ফার্স্ট টাইম লোড হওয়ার সাথে সাথে ডিফল্ট আইটেম জেনারেট করা
document.addEventListener("DOMContentLoaded", function() {
    loadDefaultAppliances();
});