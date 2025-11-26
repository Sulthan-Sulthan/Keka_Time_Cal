// function refreshPage() { location.reload(); }
let countdownInterval = null;

function pad(n){ return String(n).padStart(2,'0'); }

function clearCountdown(){
    if (countdownInterval){
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function showProgress(percent){
    const progress = document.getElementById('progress');
    if (progress) progress.style.width = Math.max(0, Math.min(100, percent)) + '%';
}

function calculateLeaveTime(){
    clearCountdown();
    const outLeave = document.getElementById('result');
    const outRemain = document.getElementById('result1');
    if (outLeave) outLeave.innerText = '';
    if (outRemain) outRemain.innerText = '';

    const inHours = parseInt(document.getElementById('inHours').value, 10);
    const inMinutes = parseInt(document.getElementById('inMinutes').value, 10);
    let effectiveHours = parseInt(document.getElementById('effectiveHours').value, 10);
    let effectiveMinutes = parseInt(document.getElementById('effectiveMinutes').value, 10);

    if (isNaN(inHours) || isNaN(inMinutes)){
        if (outLeave){ outLeave.style.color = 'crimson'; outLeave.innerText = 'Please fill in both In-Time hours and minutes.'; }
        return;
    }

    if (isNaN(effectiveHours)) effectiveHours = 0;
    if (isNaN(effectiveMinutes)) effectiveMinutes = 0;

    // Use fixed required work time (original behaviour): 8 hours 30 minutes
    const totalWorkMinutes = 8*60 + 30;
    const effectiveMinutesTotal = effectiveHours*60 + effectiveMinutes;
    const remainingMinutes = totalWorkMinutes - effectiveMinutesTotal;

    if (remainingMinutes <= 0){
        if (outLeave){ outLeave.style.color = 'green'; outLeave.innerText = 'You have already completed your required hours!'; }
        showProgress(100);
        return;
    }

    const totalInMinutes = inHours*60 + inMinutes;
    const leaveMinutesAbsolute = totalInMinutes + remainingMinutes; // minutes from today's midnight

    // Build a Date for the exact leave time (this can roll into the next day automatically)
    const now = new Date();
    const leaveDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    leaveDate.setMinutes(leaveMinutesAbsolute);

    const formattedLeaveTime = `${pad(leaveDate.getHours())}:${pad(leaveDate.getMinutes())}`;
    if (outLeave){ outLeave.style.color = '#174ea6'; outLeave.innerText = `You can leave at: ${formattedLeaveTime}`; }

    function updateCountdown(){
        const now = new Date();
        const diffMs = leaveDate - now;

        if (diffMs <= 0){
            if (outRemain){ outRemain.style.color = 'green'; outRemain.innerText = 'Your time is already completed'; }
            showProgress(100);
            clearCountdown();
            return;
        }

        const diffSeconds = Math.floor(diffMs / 1000);
        const hrs = Math.floor(diffSeconds/3600);
        const mins = Math.floor((diffSeconds%3600)/60);
        const secs = diffSeconds%60;

        if (outRemain){ outRemain.style.color = '#c0392b'; outRemain.innerText = `Remaining Time: ${pad(hrs)}:${pad(mins)}:${pad(secs)}`; }

        const workedPercent = totalWorkMinutes > 0 ? Math.min(100, Math.round((effectiveMinutesTotal / totalWorkMinutes) * 100)) : 0;
        showProgress(isFinite(workedPercent) ? workedPercent : 0);
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function fillNow(){
    const now = new Date();
    document.getElementById('inHours').value = now.getHours();
    document.getElementById('inMinutes').value = now.getMinutes();
}

function resetAll(){
    clearCountdown();
    // clear number inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(i=>i.value = '');
    // clear result texts
    ['result','result1'].forEach(id=>{ const el = document.getElementById(id); if (el) el.innerText = ''; });
    showProgress(0);
}

// Attach events and theme toggle
document.addEventListener('DOMContentLoaded', ()=>{
    const nowBtn = document.getElementById('nowBtn');
    const calcBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    if (nowBtn) nowBtn.addEventListener('click', fillNow);
    if (calcBtn) calcBtn.addEventListener('click', calculateLeaveTime);
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    // Theme toggle (persisted)
    const themeToggle = document.getElementById('themeToggle');
    function applyTheme(t){
        if (t === 'dark'){
            document.documentElement.classList.add('dark');
            if (themeToggle) { themeToggle.innerText = '☀️'; themeToggle.setAttribute('aria-pressed','true'); }
        } else {
            document.documentElement.classList.remove('dark');
            if (themeToggle) { themeToggle.innerText = '🌙'; themeToggle.setAttribute('aria-pressed','false'); }
        }
    }
    const saved = localStorage.getItem('ktc-theme');
    if (saved) applyTheme(saved);
    if (themeToggle) themeToggle.addEventListener('click', ()=>{
        const isDark = document.documentElement.classList.contains('dark');
        const next = isDark? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('ktc-theme', next);
    });
});



