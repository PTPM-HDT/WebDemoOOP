const DB_KEY = 'LETSCODE_DB';
let db = null;
let deleteTargetId = null;
let tempTeacherData = null; // Biến tạm lưu giáo viên

// CẤU HÌNH PHÂN TRANG
const ITEMS_PER_PAGE = 6;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadDB();
    updateGrid();
});

function loadDB() {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
        db = JSON.parse(data);
        if (!db.teachers || db.teachers.length === 0) {
             alert("Dữ liệu trống. Vui lòng quay lại trang Dashboard và bấm 'Reset Data' để nạp dữ liệu mẫu.");
        }
    } else {
        alert("Chưa có dữ liệu. Vui lòng vào trang Phân lớp hoặc Dashboard để khởi tạo dữ liệu mẫu.");
    }
}

function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 500000) { 
        alert("File ảnh quá lớn! Vui lòng chọn ảnh dưới 500KB.");
        event.target.value = ""; return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('previewAvatar').src = e.target.result;
        document.getElementById('hiddenAvatarBase64').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateGrid() {
    if (!db || !db.teachers) return;
    const totalItems = db.teachers.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    if (currentPage < 1) currentPage = 1;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = db.teachers.slice(start, end);
    renderGridItems(pageData);
    renderPagination(totalPages);
}

function renderGridItems(data) {
    const container = document.getElementById('teacherGrid');
    container.innerHTML = '';
    if (data.length === 0) {
        container.innerHTML = '<div class="text-center text-white-50 col-12 py-5">Chưa có dữ liệu giáo viên.</div>';
        return;
    }
    data.forEach(t => {
        const avatarHtml = t.avatar 
            ? `<img src="${t.avatar}" class="rounded-circle me-3" style="width: 60px; height: 60px; object-fit: cover;">`
            : `<div class="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px; font-size: 1.8rem;"><i class="bi bi-person-fill"></i></div>`;

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card-glass h-100 p-3 position-relative">
                <div class="d-flex align-items-center mb-3">
                    ${avatarHtml}
                    <div>
                        <h5 class="card-title text-white mb-0 text-truncate" style="max-width: 200px;">${t.name}</h5>
                        <small class="text-white-50">${t.id}</small>
                    </div>
                </div>
                <div class="mb-3 small">
                    <div class="mb-1 text-truncate"><i class="bi bi-code-slash me-2 text-info"></i><span class="text-white-50">Chuyên môn:</span> ${t.major || 'N/A'}</div>
                    <div class="mb-1"><i class="bi bi-telephone me-2 text-success"></i><span class="text-white-50">SĐT:</span> ${t.phone || 'N/A'}</div>
                    <div class="mb-1 text-truncate"><i class="bi bi-geo-alt me-2 text-warning"></i><span class="text-white-50">Quê quán:</span> ${t.hometown || 'N/A'}</div>
                </div>
                <div class="d-flex justify-content-end gap-2 mt-auto border-top border-white-10 pt-3">
                    <button class="btn btn-sm btn-outline-info" onclick="editTeacher('${t.id}')">Chi tiết & Sửa</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="requestDelete('${t.id}')">Xóa</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function renderPagination(totalPages) {
    const existingNav = document.getElementById('paginationContainer');
    existingNav.innerHTML = '';
    if(totalPages <= 1) return;

    let paginationHTML = '<nav><ul class="pagination pagination-sm mb-0">';
    paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link bg-dark border-secondary text-white" href="#" onclick="changePage(${currentPage - 1}); return false;">&laquo;</a></li>`;
    for(let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        const style = i === currentPage ? 'background: #0d6efd; border-color: #0d6efd;' : '';
        paginationHTML += `<li class="page-item ${activeClass}"><a class="page-link bg-dark border-secondary text-white" href="#" onclick="changePage(${i}); return false;" style="${style}">${i}</a></li>`;
    }
    paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link bg-dark border-secondary text-white" href="#" onclick="changePage(${currentPage + 1}); return false;">&raquo;</a></li></ul></nav>`;
    existingNav.innerHTML = paginationHTML;
}

window.changePage = function(page) {
    currentPage = page;
    updateGrid();
}

function openTeacherModal() {
    document.getElementById('modalTitle').innerText = "Thêm Giáo Viên";
    document.getElementById('editMode').value = "false";
    document.getElementById('inputID').value = "";
    document.getElementById('inputID').disabled = false;
    document.getElementById('inputName').value = "";
    document.getElementById('inputMajor').value = "";
    document.getElementById('inputDob').value = "";
    document.getElementById('inputPhone').value = "";
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputCCCD').value = "";
    document.getElementById('inputHometown').value = "";
    document.getElementById('inputFileAvatar').value = "";
    document.getElementById('hiddenAvatarBase64').value = "";
    document.getElementById('previewAvatar').src = "https://via.placeholder.com/80?text=Avatar";
    new bootstrap.Modal(document.getElementById('teacherFormModal')).show();
}

function editTeacher(id) {
    const t = db.teachers.find(x => x.id === id);
    if (!t) return;
    document.getElementById('modalTitle').innerText = "Cập nhật thông tin";
    document.getElementById('editMode').value = "true";
    document.getElementById('inputID').value = t.id;
    document.getElementById('inputID').disabled = true;
    document.getElementById('inputName').value = t.name || "";
    document.getElementById('inputMajor').value = t.major || "";
    if (t.dob && t.dob.includes('/')) { 
         const parts = t.dob.split('/');
         document.getElementById('inputDob').value = `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else {
         document.getElementById('inputDob').value = t.dob || "";
    }
    document.getElementById('inputPhone').value = t.phone || "";
    document.getElementById('inputEmail').value = t.email || "";
    document.getElementById('inputCCCD').value = t.cccd || "";
    document.getElementById('inputHometown').value = t.hometown || "";
    document.getElementById('inputFileAvatar').value = ""; 
    if (t.avatar) {
        document.getElementById('previewAvatar').src = t.avatar;
        document.getElementById('hiddenAvatarBase64').value = t.avatar;
    } else {
        document.getElementById('previewAvatar').src = "https://via.placeholder.com/80?text=Avatar";
        document.getElementById('hiddenAvatarBase64').value = "";
    }
    new bootstrap.Modal(document.getElementById('teacherFormModal')).show();
}

// --- BƯỚC 1: XÁC NHẬN ---
function preSaveTeacher() {
    const id = document.getElementById('inputID').value.trim();
    const name = document.getElementById('inputName').value.trim();
    
    if (!id || !name) { showToast("Lỗi", "Vui lòng nhập Mã và Tên giáo viên.", "error"); return; }

    const isEdit = document.getElementById('editMode').value === "true";
    if (!isEdit && db.teachers.some(x => x.id === id)) {
        showToast("Lỗi", "Mã giáo viên đã tồn tại!", "error"); return;
    }

    tempTeacherData = {
        id: id,
        name: name,
        major: document.getElementById('inputMajor').value.trim(),
        dob: document.getElementById('inputDob').value,
        phone: document.getElementById('inputPhone').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        cccd: document.getElementById('inputCCCD').value.trim(),
        hometown: document.getElementById('inputHometown').value.trim(),
        avatar: document.getElementById('hiddenAvatarBase64').value 
    };

    // Điền bảng xác nhận
    const ul = document.getElementById('confirmTeacherList');
    ul.innerHTML = `
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Mã GV:</strong> ${tempTeacherData.id}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Họ tên:</strong> ${tempTeacherData.name}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Chuyên môn:</strong> ${tempTeacherData.major || 'Chưa nhập'}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>SĐT:</strong> ${tempTeacherData.phone || 'Chưa nhập'}</li>
    `;

    bootstrap.Modal.getInstance(document.getElementById('teacherFormModal')).hide();
    new bootstrap.Modal(document.getElementById('confirmSaveTeacherModal')).show();
}

// --- BƯỚC 2: LƯU ---
function executeSaveTeacher() {
    if (!tempTeacherData) return;
    const isEdit = document.getElementById('editMode').value === "true";

    if (isEdit) {
        const t = db.teachers.find(x => x.id === tempTeacherData.id);
        if(t) {
            Object.assign(t, tempTeacherData); 
            saveDB();
            showToast("Thành công", "Đã cập nhật hồ sơ giáo viên.");
        }
    } else {
        db.teachers.push(tempTeacherData);
        saveDB();
        showToast("Thành công", "Đã thêm giáo viên mới.");
    }

    tempTeacherData = null;
    bootstrap.Modal.getInstance(document.getElementById('confirmSaveTeacherModal')).hide();
    updateGrid();
}

document.querySelector('#confirmSaveTeacherModal .btn-glass-secondary').addEventListener('click', () => {
    new bootstrap.Modal(document.getElementById('teacherFormModal')).show();
});

function requestDelete(id) {
    deleteTargetId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

function confirmDelete() {
    if(!deleteTargetId) return;
    const idx = db.teachers.findIndex(t => t.id === deleteTargetId);
    if (idx > -1) {
        db.teachers.splice(idx, 1);
        db.classes.forEach(cls => {
            if(cls.teacherId === deleteTargetId) cls.teacherId = null; 
        });
        saveDB();
        showToast("Đã xóa", "Đã xóa giáo viên và cập nhật lại các lớp.");
    }
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    updateGrid();
}

function showToast(title, message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    if(!toastEl) return;
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    const icon = document.getElementById('toastIcon');
    icon.className = type === 'error' ? 'bi bi-exclamation-triangle-fill text-danger me-3 fs-4' : 'bi bi-check-circle-fill text-success me-3 fs-4';
    new bootstrap.Toast(toastEl).show();
}