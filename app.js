// =================================================================
// 1. نظام تسجيل الدخول (Gateway Logic)
// =================================================================
let currentCode = "";
let timerInterval;
let timeLeft = 25;

function generateCode() {
    // توليد 5 أرقام
    currentCode = Math.floor(10000 + Math.random() * 90000).toString();
    const displayElement = document.getElementById('generated-code');
    if (displayElement) displayElement.innerText = currentCode;
    
    // إعادة العداد
    timeLeft = 25;
    updateTimerUI();
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) generateCode();
    }, 1000);
}

function updateTimerUI() {
    const bar = document.getElementById('timer-bar');
    const text = document.getElementById('timer-text');
    
    if (bar && text) {
        text.innerText = timeLeft + 's';
        const percentage = (timeLeft / 25) * 100;
        bar.style.width = percentage + '%';
        
        // يتغير للأحمر إذا قرب يخلص
        if (timeLeft <= 5) {
            bar.className = "h-full bg-red-500 shadow-[0_0_10px_#ef4444] transition-all duration-1000";
            text.classList.replace('text-brandBlue', 'text-red-500');
        } else {
            bar.className = "h-full bg-brandBlue shadow-[0_0_10px_#4d72f5] transition-all duration-1000";
            text.classList.replace('text-red-500', 'text-brandBlue');
        }
    }
}

function login(event) {
    event.preventDefault();
    const token = document.getElementById('token-input').value;
    const codeInput = document.getElementById('code-input').value;
    const loginCard = document.getElementById('login-card');
    const errorMsg = document.getElementById('error-msg');

    // ========== التوكن السري هو: past305 ==========
    if (token === "past305" && codeInput === currentCode) {
        // تأثير نجاح الدخول
        loginCard.style.transform = "scale(0.95)";
        loginCard.style.opacity = "0";
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 300);
    } else {
        // تأثير الرفض (الاهتزاز)
        loginCard.classList.remove('animate-shake');
        void loginCard.offsetWidth; // Trigger reflow
        loginCard.classList.add('animate-shake');
        
        errorMsg.classList.remove('hidden');
        document.getElementById('token-input').value = "";
        document.getElementById('code-input').value = "";
        generateCode(); // حماية: يغير الرمز بعد محاولة فاشلة
    }
}


// =================================================================
// 2. نظام لوحة التحكم (Dashboard Logic)
// =================================================================

// بيانات وهمية واقعية للجدول مع آيبيات كاملة
const fakeDevices = [
    { ip: "185.12.44.192", loc: "Kuwait City, KW", os: "iOS 17.2", icon: "fa-apple text-gray-200", ping: "12", status: "Online" },
    { ip: "82.114.9.21", loc: "Riyadh, SA", os: "Windows 11", icon: "fa-windows text-blue-400", ping: "45", status: "Online" },
    { ip: "104.22.18.99", loc: "London, UK", os: "Ubuntu 22.04", icon: "fa-linux text-yellow-400", ping: "120", status: "Online" },
    { ip: "192.168.1.105", loc: "Local Network", os: "Android 14", icon: "fa-android text-emerald-400", ping: "2", status: "Online" },
    { ip: "45.33.22.11", loc: "New York, US", os: "macOS Sonoma", icon: "fa-apple text-gray-200", ping: "88", status: "Online" },
    { ip: "213.66.8.4", loc: "Dubai, UAE", os: "Windows 10", icon: "fa-windows text-blue-400", ping: "34", status: "Online" },
    { ip: "172.64.19.1", loc: "Tokyo, JP", os: "Debian 11", icon: "fa-linux text-yellow-400", ping: "210", status: "Online" },
    { ip: "88.241.11.2", loc: "Istanbul, TR", os: "Android 13", icon: "fa-android text-emerald-400", ping: "67", status: "Online" }
];

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('-translate-x-full');
}

function switchTab(tabName) {
    document.getElementById('page-overview').classList.add('hidden');
    document.getElementById('page-terminal').classList.add('hidden');
    
    document.getElementById('tab-overview').className = "w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all";
    document.getElementById('tab-terminal').className = "w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all";

    document.getElementById('page-' + tabName).classList.remove('hidden');
    document.getElementById('tab-' + tabName).className = "w-full flex items-center gap-3 px-4 py-3 bg-brandBlue/10 text-brandBlue rounded-xl border border-brandBlue/20 transition-all";
}

function renderTable() {
    const tbody = document.getElementById('devices-table');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    fakeDevices.forEach((device, index) => {
        const isOnline = device.status === "Online";
        const statusClass = isOnline ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-red-400 bg-red-400/10 border-red-400/20";
        const statusDot = isOnline ? `<i class="fa-solid fa-circle text-[8px] animate-pulse mr-1"></i>` : `<i class="fa-solid fa-circle-xmark text-[10px] mr-1"></i>`;
        
        const row = `
            <tr class="hover:bg-white/[0.03] transition-colors device-row" data-ip="${device.ip}" data-loc="${device.loc}">
                <td class="px-4 py-3 text-gray-200">${device.ip}</td>
                <td class="px-4 py-3 text-gray-400">${device.loc}</td>
                <td class="px-4 py-3 text-gray-300"><i class="fa-brands ${device.icon} mr-2"></i> ${device.os}</td>
                <td class="px-4 py-3 text-brandBlue">${device.ping}ms</td>
                <td class="px-4 py-3">
                    <span id="status-${index}" class="px-2 py-1 rounded text-[10px] border ${statusClass} flex items-center w-fit font-bold">
                        ${statusDot} ${device.status}
                    </span>
                </td>
                <td class="px-4 py-3 text-right">
                    <button onclick="shutdownDevice(${index}, '${device.ip}')" id="btn-shut-${index}" class="text-[10px] bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded border border-red-500/20 transition-all font-mono uppercase tracking-wider">
                        Shutdown
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function shutdownDevice(index, ip) {
    const btn = document.getElementById(`btn-shut-${index}`);
    const statusBadge = document.getElementById(`status-${index}`);
    
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> EXECUTING`;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    btn.disabled = true;

    // محاكاة الاتصال (ثانيتين)
    setTimeout(() => {
        // تغيير الحالة إلى Offline
        fakeDevices[index].status = "Offline";
        fakeDevices[index].ping = "---";
        statusBadge.className = "px-2 py-1 rounded text-[10px] border text-red-400 bg-red-400/10 border-red-400/20 flex items-center w-fit font-bold";
        statusBadge.innerHTML = `<i class="fa-solid fa-circle-xmark text-[10px] mr-1"></i> Offline`;
        
        btn.innerHTML = `KILLED`;
        
        // إظهار إشعار فخم
        showToast(`Fatal shutdown command executed on <span class="text-white">${ip}</span>`);
    }, 1500);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = 'glass-card border-l-2 border-l-brandBlue px-4 py-3 rounded shadow-2xl flex items-center gap-3 toast-enter min-w-[280px] backdrop-blur-3xl bg-black/80';
    toast.innerHTML = `
        <i class="fa-solid fa-satellite-dish text-brandBlue animate-pulse text-lg"></i>
        <p class="text-[10px] text-gray-300 font-mono uppercase tracking-widest">${message}</p>
    `;
    container.appendChild(toast);

    // إخفاء الإشعار بعد 4 ثواني
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ================= شريط البحث =================
function filterTable() {
    const input = document.getElementById('global-search').value.toLowerCase();
    const rows = document.querySelectorAll('.device-row');
    
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}

// ================= أرقام حية تتحرك =================
function updateLiveStats() {
    // تغيير البنق بشكل عشوائي للواقعية
    const pingEl = document.getElementById('stat-ping');
    if(pingEl) pingEl.innerText = Math.floor(15 + Math.random() * 10) + ' ms';

    // تغيير الحمل (Load)
    const loadEl = document.getElementById('stat-load');
    if(loadEl) loadEl.innerText = (40 + Math.random() * 5).toFixed(1) + '%';
    
    // إضافة نصوص وهمية للـ Terminal إذا كان مفتوح
    const term = document.getElementById('terminal-output');
    if(term && document.getElementById('page-terminal').classList.contains('hidden') === false) {
        const msgs = [
            "[INFO] Scanning subnets for vulnerabilities...",
            "[WARN] Firewall resistance detected on IP 104.22.*.*",
            "[SUCCESS] Payload injected via SSH backdoor.",
            "Retrieving packet headers... 0x88A21C",
            "Bypassing active directory credentials..."
        ];
        const p = document.createElement('p');
        p.className = "text-gray-400 mt-1";
        p.innerText = msgs[Math.floor(Math.random() * msgs.length)];
        term.appendChild(p);
        term.scrollTop = term.scrollHeight; // النزول للأسفل تلقائياً
    }
}

// =================================================================
// 3. المشغل الأساسي (Initialization)
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    // إذا كانت صفحة الدخول
    if (document.getElementById('generated-code')) {
        generateCode();
    }
    
    // إذا كانت صفحة الداشبورد
    if (document.getElementById('devices-table')) {
        renderTable();
        setInterval(updateLiveStats, 2000); // تحديث الأرقام كل ثانيتين
    }
});
