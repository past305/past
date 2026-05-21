let currentCode = "";
let timerInterval;
let timeLeft = 25;

function generateCode() {
    currentCode = Math.floor(10000 + Math.random() * 90000).toString();
    const displayElement = document.getElementById('generated-code');
    if (displayElement) displayElement.innerText = currentCode;
    
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
        bar.style.width = (timeLeft / 25) * 100 + '%';
        
        if(timeLeft <= 5) {
            bar.className = "h-full bg-red-500 transition-all duration-1000";
            text.className = "text-[10px] font-mono text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20";
        } else {
            bar.className = "h-full bg-brandBlue transition-all duration-1000";
            text.className = "text-[10px] font-mono text-brandBlue bg-brandBlue/10 px-2 py-0.5 rounded border border-brandBlue/20";
        }
    }
}

function login(event) {
    event.preventDefault();
    const token = document.getElementById('token-input').value;
    const codeInput = document.getElementById('code-input').value;
    const loginCard = document.getElementById('login-card');
    const errorMsg = document.getElementById('error-msg');

    // Secure Root Token verification logic
    if (token === "past305" && codeInput === currentCode) {
        window.location.href = "dashboard.html";
    } else {
        if(loginCard) {
            loginCard.classList.remove('animate-shake');
            void loginCard.offsetWidth;
            loginCard.classList.add('animate-shake');
        }
        if(errorMsg) errorMsg.classList.remove('hidden');
        document.getElementById('token-input').value = "";
        document.getElementById('code-input').value = "";
        generateCode();
    }
}

// =================================================================
// 2. Command Server Live Engine (250 Raw Device Nodes Generation)
// =================================================================
let sessions = [];

function generateRealisticData() {
    const osTypes = [
        "Win NT 10.0.19045 (x64)", "Win NT 10.0.22000 (x64)", "Win NT 6.1.7601 (x86)",
        "Linux 5.15.0-generic (x86_64)", "Linux 4.4.0-armv7l", "Darwin 22.1.0 (arm64)",
        "Android 12.0 (aarch64)", "Linux 3.10.0-957.el7.x86_64"
    ];
    const protocols = ["TCP (443)", "TCP (80)", "UDP (53)", "HTTPS/API"];
    
    for (let i = 0; i < 250; i++) {
        const extIp = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        const intIp = `192.168.${Math.floor(Math.random()*10)}.${Math.floor(Math.random()*254)}`;
        const os = osTypes[Math.floor(Math.random() * osTypes.length)];
        const proto = protocols[Math.floor(Math.random() * protocols.length)];
        const sid = Math.random().toString(36).substr(2, 8).toUpperCase();
        
        sessions.push({ id: sid, extIp, intIp, os, proto, status: 'Alive', lastSeen: Math.floor(Math.random() * 12000) });
    }
}

function renderSessions() {
    const tbody = document.getElementById('sessions-table');
    if(!tbody) return;
    
    let html = '';
    sessions.forEach((sess, index) => {
        if(sess.status === 'Killed') return;
        
        const lastSeenText = sess.lastSeen < 1000 ? `${sess.lastSeen}ms` : `${(sess.lastSeen/1000).toFixed(1)}s`;
        const timeColor = sess.lastSeen > 5000 ? 'text-amber-500' : 'text-emerald-500';

        html += `
            <tr class="session-row" data-search="${sess.id} ${sess.extIp} ${sess.intIp} ${sess.os}">
                <td class="px-3 py-2 text-brandBlue">${sess.id}</td>
                <td class="px-3 py-2 text-gray-300">${sess.extIp}</td>
                <td class="px-3 py-2 text-gray-500">${sess.intIp}</td>
                <td class="px-3 py-2 text-gray-400">${sess.os}</td>
                <td class="px-3 py-2 text-purple-400">${sess.proto}</td>
                <td class="px-3 py-2 ${timeColor} update-time" data-index="${index}">${lastSeenText}</td>
                <td class="px-3 py-2 text-right">
                    <button onclick="killSession(${index})" class="text-[10px] bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 px-2 py-1 rounded transition-colors uppercase border border-transparent hover:border-red-500/30">
                        Terminate
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    const totalBeacons = document.getElementById('total-beacons');
    if(totalBeacons) totalBeacons.innerText = document.querySelectorAll('.session-row').length;
}

function filterTable() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.session-row');
    rows.forEach(row => {
        row.style.display = row.getAttribute('data-search').toLowerCase().includes(query) ? '' : 'none';
    });
}

function killSession(index) {
    sessions[index].status = 'Killed';
    renderSessions();
    showToast(`Session termination requested.`);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = 'glass-card border-l-2 border-l-brandBlue px-4 py-3 rounded shadow-2xl flex items-center gap-3 backdrop-blur-3xl bg-black/80 text-xs font-mono text-gray-300';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

function simulateLiveTraffic() {
    const thr = document.getElementById('throughput');
    if(thr) thr.innerText = (40 + Math.random() * 15).toFixed(1) + ' Mbps';

    const times = document.querySelectorAll('.update-time');
    times.forEach(el => {
        if(Math.random() > 0.8) {
            const newTime = Math.floor(Math.random() * 3000);
            el.innerText = `${newTime}ms`;
            el.className = `px-3 py-2 update-time ${newTime > 2000 ? 'text-amber-500' : 'text-emerald-500'}`;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('generated-code')) generateCode();
    if (document.getElementById('sessions-table')) {
        generateRealisticData();
        renderSessions();
        setInterval(simulateLiveTraffic, 1000);
    }
});