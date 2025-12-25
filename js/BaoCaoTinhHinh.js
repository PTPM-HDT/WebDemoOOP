// --- KẾT NỐI DATABASE CHUNG ---
const DB_KEY = 'LETSCODE_DB';
let db = null;

let currentHonoredList = [];
let currentContactList = [];

document.addEventListener('DOMContentLoaded', () => {
    loadDB();
    renderClassDropdown();
});

function loadDB() {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
        db = JSON.parse(data);
        if (!db.scores) db.scores = {};
    } else {
        showToast("Chưa có dữ liệu", "Vui lòng sang trang Phân lớp để tạo dữ liệu trước.", "error");
    }
}

function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Lọc chỉ hiện lớp đang hoạt động (active)
function renderClassDropdown() {
    const select = document.getElementById('classSelect');
    if(!db || !db.classes) return;

    while (select.options.length > 1) {
        select.remove(1);
    }

    const activeClasses = db.classes.filter(c => c.status === 'active');

    if (activeClasses.length === 0) {
        const option = document.createElement('option');
        option.innerText = "(Chưa có lớp nào đang hoạt động)";
        option.disabled = true;
        select.appendChild(option);
    } else {
        activeClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.innerText = `${cls.name} (${cls.id})`;
            select.appendChild(option);
        });
    }
}

// ... (Giữ nguyên các hàm sinh báo cáo như file cũ) ...
function getRandomScore() {
    return (Math.random() * (10 - 5) + 5).toFixed(1);
}

function generateReport() {
    const classId = document.getElementById('classSelect').value;
    const monthId = document.getElementById('monthSelect').value;
    const reportArea = document.getElementById('reportArea');
    
    if (!classId) { showToast("Lỗi", "Vui lòng chọn lớp học!", "error"); return; }
    if (monthId === 'NODATA') { showToast("Lỗi", "Không tìm thấy dữ liệu.", "error"); return; }
    if (!db) { loadDB(); }

    const targetClass = db.classes.find(c => c.id === classId);
    if (!targetClass) return;
    
    const students = targetClass.students;
    let dataChanged = false;

    const computedStudents = students.map(s => {
        if (!db.scores[s.id]) {
            const oldS = parseFloat(getRandomScore());
            let newS = oldS + (Math.random() * 2 - 1);
            if(newS > 10) newS = 10;
            if(newS < 0) newS = 0;
            
            db.scores[s.id] = {
                oldScore: oldS.toFixed(1),
                newScore: newS.toFixed(1)
            };
            dataChanged = true;
        }

        const scoreData = db.scores[s.id];
        const diff = (scoreData.newScore - scoreData.oldScore).toFixed(1);

        return {
            id: s.id,
            name: s.name,
            className: classId,
            oldScore: scoreData.oldScore,
            newScore: scoreData.newScore,
            diff: diff
        };
    });

    if (dataChanged) saveDB();

    const progressList = computedStudents.filter(s => parseFloat(s.diff) > 0).sort((a, b) => b.diff - a.diff);
    const warningList = computedStudents.filter(s => parseFloat(s.diff) <= 0).sort((a, b) => a.diff - b.diff);

    if (progressList.length > 0) {
        const topStudent = progressList[0];
        document.getElementById('topCandidateSection').style.display = 'block';
        document.getElementById('candidateClass').innerText = classId;
        document.getElementById('candidateName').innerText = topStudent.name;
        document.getElementById('candidateDiff').innerHTML = `+${topStudent.diff}`;
    } else {
        document.getElementById('topCandidateSection').style.display = 'none';
    }

    document.getElementById('totalCount').innerText = students.length;
    updateHonoredCountUI();
    updateContactCountUI();
    renderProgressTable(progressList);
    renderWarningTable(warningList);

    reportArea.style.display = 'block';
    reportArea.scrollIntoView({ behavior: 'smooth' });
    showToast("Hoàn tất", `Đã tải báo cáo lớp ${classId}`);
}

function getTrendHTML(diff) {
    if (diff > 0) return `<span class="fw-bold text-success"><i class="fas fa-arrow-up me-1"></i>+${diff}</span>`;
    if (diff < 0) return `<span class="fw-bold text-danger"><i class="fas fa-arrow-down me-1"></i>${diff}</span>`;
    return `<span class="fw-bold text-muted"><i class="fas fa-minus me-1"></i>0.0</span>`;
}

function renderProgressTable(list) {
    const tbody = document.getElementById('progressTable');
    tbody.innerHTML = '';
    list.forEach(s => {
        const isHonored = currentHonoredList.some(h => h.id === s.id);
        const btnHtml = isHonored
            ? `<button class="btn btn-sm btn-secondary" disabled><i class="fas fa-check me-1"></i>Đã thêm</button>`
            : `<button class="btn btn-sm btn-outline-success" onclick="addToBestOfMonth('${s.id}', '${s.name}', '${s.className}', '${s.newScore}')"><i class="fas fa-star me-1"></i>Vinh danh</button>`;
        
        tbody.innerHTML += `<tr><td><div class="student-name">${s.name}</div></td><td class="text-secondary">${s.oldScore}</td><td class="fw-bold text-white">${s.newScore}</td><td>${getTrendHTML(s.diff)}</td><td>${btnHtml}</td></tr>`;
    });
    if (list.length === 0) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Không có dữ liệu.</td></tr>';
}

function renderWarningTable(list) {
    const tbody = document.getElementById('warningTable');
    tbody.innerHTML = '';
    list.forEach(s => {
        const isInContactList = currentContactList.some(c => c.id === s.id);
        const btnHtml = isInContactList
            ? `<button class="btn btn-sm btn-secondary" disabled><i class="fas fa-check me-1"></i>Đã thêm</button>`
            : `<button class="btn btn-sm btn-outline-danger" onclick="addToContactList('${s.id}', '${s.name}', '${s.className}', '${s.diff}')"><i class="fas fa-plus me-1"></i>Thêm vào DS</button>`;
        
        tbody.innerHTML += `<tr><td><div class="student-name">${s.name}</div><small class="text-secondary">Điểm: ${s.newScore}</small></td><td>${getTrendHTML(s.diff)}</td><td>${btnHtml}</td></tr>`;
    });
    if (list.length === 0) tbody.innerHTML = '<tr><td colspan="3" class="text-center text-success">Không có cảnh báo!</td></tr>';
}

function addToBestOfMonth(id, name, className, score) {
    currentHonoredList.push({ id, name, className, score });
    generateReport(); 
    showToast("Đã thêm", `Vinh danh học viên ${name}`);
}

function addToContactList(id, name, className, diff) {
    currentContactList.push({ id, name, className, diff });
    generateReport(); 
    showToast("Đã thêm", `Thêm ${name} vào danh sách gửi tin`);
}

function updateHonoredCountUI() {
    const el = document.getElementById('honoredCount'); el.innerText = currentHonoredList.length;
    el.style.transform = "scale(1.2)"; setTimeout(() => el.style.transform = "scale(1)", 200);
}

function updateContactCountUI() {
    const el = document.getElementById('contactListCount'); el.innerText = currentContactList.length;
    el.style.transform = "scale(1.2)"; setTimeout(() => el.style.transform = "scale(1)", 200);
}

function showBestOfMonthModal() {
    const body = document.getElementById('bestOfMonthListBody');
    const msg = document.getElementById('emptyHonoredMsg');
    body.innerHTML = '';
    if (currentHonoredList.length === 0) msg.style.display = 'block';
    else { msg.style.display = 'none'; currentHonoredList.forEach(s => body.innerHTML += `<tr><td class="text-white fw-bold">${s.name}</td><td class="text-secondary">${s.className}</td><td class="text-end text-warning fw-bold">${s.score}</td></tr>`); }
    new bootstrap.Modal(document.getElementById('bestOfMonthModal')).show();
}

function showContactModal() {
    const body = document.getElementById('contactListBody');
    const msg = document.getElementById('emptyContactMsg');
    body.innerHTML = '';
    if (currentContactList.length === 0) msg.style.display = 'block';
    else { msg.style.display = 'none'; currentContactList.forEach(s => body.innerHTML += `<tr><td class="text-white fw-bold">${s.name}</td><td class="text-secondary">${s.className}</td><td class="text-end text-danger fw-bold">${s.diff}</td></tr>`); }
    new bootstrap.Modal(document.getElementById('contactModal')).show();
}

function sendBulkNotifications() {
    if (currentContactList.length === 0) return;
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
    showToast("Đang gửi...", "Hệ thống đang xử lý", "loading");
    setTimeout(() => { showToast("Hoàn tất", "Đã gửi tin nhắn thành công"); currentContactList = []; updateContactCountUI(); generateReport(); }, 2000);
}

function exportReport() { showToast("Đang xử lý", "Đang tạo file Excel...", "loading"); setTimeout(() => showToast("Hoàn tất", "Đã tải xuống file."), 2000); }

function showToast(title, message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    
    toastEl.className = 'toast toast-glass align-items-center hide'; 
    const icon = document.getElementById('toastIcon');
    
    if (type === 'error') {
        toastEl.classList.add('toast-error');
        icon.className = 'fas fa-exclamation-circle text-danger me-3 fs-4';
    } else if (type === 'loading') {
        toastEl.classList.add('toast-loading');
        icon.className = 'fas fa-spinner fa-spin text-warning me-3 fs-4';
    } else {
        icon.className = 'fas fa-check-circle text-success me-3 fs-4';
    }
    
    new bootstrap.Toast(toastEl).show();
}