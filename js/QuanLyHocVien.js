const DB_KEY = 'LETSCODE_DB';
let db = null;
let deleteTarget = null;

// CẤU HÌNH PHÂN TRANG
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let currentFilteredData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadDB();
    updateTable(); // Thay cho renderTable
    
    document.getElementById('searchKeyword').addEventListener('input', () => { currentPage = 1; updateTable(); });
    document.getElementById('filterClass').addEventListener('change', () => { currentPage = 1; updateTable(); });
});

function loadDB() {
    const data = localStorage.getItem(DB_KEY);
    if (data) db = JSON.parse(data);
    else alert("Chưa có dữ liệu. Vui lòng truy cập trang Phân lớp để khởi tạo.");
}

function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function resetData() {
    if (confirm("Xác nhận xóa toàn bộ dữ liệu và quay về mặc định?")) {
        localStorage.removeItem(DB_KEY);
        location.reload();
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 500000) { 
        alert("File ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 500KB.");
        event.target.value = ""; return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('previewAvatar').src = e.target.result;
        document.getElementById('hiddenAvatarBase64').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

function getAllStudents() {
    let all = [];
    if (db.unassignedStudents) {
        db.unassignedStudents.forEach(s => {
            all.push({ ...s, className: "Chưa phân lớp", classId: null, type: 'UNASSIGNED' });
        });
    }
    if (db.classes) {
        db.classes.forEach(cls => {
            cls.students.forEach(s => {
                all.push({ ...s, className: cls.name, classId: cls.id, type: 'ASSIGNED' });
            });
        });
    }
    return all;
}

// --- LOGIC PHÂN TRANG & RENDER ---
function updateTable() {
    const keyword = document.getElementById('searchKeyword').value.toLowerCase();
    const filter = document.getElementById('filterClass').value;
    let students = getAllStudents();

    currentFilteredData = students.filter(s => {
        const matchName = (s.name || '').toLowerCase().includes(keyword) || 
                          (s.id || '').toLowerCase().includes(keyword) ||
                          (s.phone || '').includes(keyword);
        let matchFilter = true;
        if (filter === 'ASSIGNED') matchFilter = s.type === 'ASSIGNED';
        if (filter === 'UNASSIGNED') matchFilter = s.type === 'UNASSIGNED';
        return matchName && matchFilter;
    });

    const totalPages = Math.ceil(currentFilteredData.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageData = currentFilteredData.slice(start, start + ITEMS_PER_PAGE);

    renderTableRows(pageData);
    renderPagination(totalPages);
}

function renderTableRows(data) {
    const tbody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    if (data.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        data.forEach(s => {
            const classBadge = s.type === 'UNASSIGNED' 
                ? `<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Chưa phân lớp</span>`
                : `<span class="badge bg-primary-subtle text-primary border border-primary-subtle">${s.className}</span>`;

            const avatarImg = s.avatar 
                ? `<img src="${s.avatar}" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;">`
                : `<div class="d-inline-block rounded-circle bg-secondary text-center text-white me-2" style="width: 40px; height: 40px; line-height: 40px;"><i class="bi bi-person"></i></div>`;

            let contactInfo = '';
            if(s.phone) contactInfo += `<div><i class="bi bi-telephone me-1 text-success"></i>${s.phone}</div>`;
            if(s.email) contactInfo += `<div class="small text-white-50"><i class="bi bi-envelope me-1"></i>${s.email}</div>`;
            if(!contactInfo) contactInfo = '<span class="text-white-50 small">--</span>';

            const dobDisplay = (s.dob && s.dob.includes('-')) ? s.dob.split('-').reverse().join('/') : '--/--/----';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="font-monospace text-white-50">${s.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        ${avatarImg}
                        <div>
                            <div class="fw-bold text-white">${s.name}</div>
                            <div class="small text-white-50">${s.gender || 'Chưa rõ'}</div>
                        </div>
                    </div>
                </td>
                <td>${dobDisplay}</td>
                <td>${contactInfo}</td>
                <td>${classBadge}</td>
                <td>
                    <button class="btn btn-sm btn-icon btn-outline-info" onclick="editStudent('${s.id}', '${s.type}', '${s.classId || ''}')" title="Sửa">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-icon btn-outline-danger" onclick="requestDelete('${s.id}', '${s.type}', '${s.classId || ''}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function renderPagination(totalPages) {
    const ul = document.getElementById('paginationControls');
    ul.innerHTML = '';
    if(totalPages <= 1) return;

    ul.innerHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link bg-dark border-secondary text-white" href="#" onclick="changePage(${currentPage - 1})">&laquo;</a></li>`;
    for(let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        const style = i === currentPage ? 'background: #0d6efd; border-color: #0d6efd;' : '';
        ul.innerHTML += `<li class="page-item ${activeClass}"><a class="page-link bg-dark border-secondary text-white" href="#" onclick="changePage(${i})" style="${style}">${i}</a></li>`;
    }
    ul.innerHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link bg-dark border-secondary text-white" href="#" onclick="changePage(${currentPage + 1})">&raquo;</a></li>`;
}

function changePage(page) {
    currentPage = page;
    updateTable();
}

function openStudentModal() {
    document.getElementById('modalTitle').innerText = "Thêm Học Viên Mới";
    document.getElementById('editMode').value = "false";
    document.getElementById('inputID').value = "";
    document.getElementById('inputID').disabled = false;
    document.getElementById('inputName').value = "";
    document.getElementById('inputDob').value = "";
    document.getElementById('inputGender').value = "Nam";
    document.getElementById('inputPhone').value = "";
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputAddress').value = "";
    document.getElementById('inputFileAvatar').value = "";
    document.getElementById('hiddenAvatarBase64').value = "";
    document.getElementById('previewAvatar').src = "https://via.placeholder.com/60?text=HV";
    document.getElementById('inputDateAdded').value = new Date().toISOString().split('T')[0];
    new bootstrap.Modal(document.getElementById('studentFormModal')).show();
}

function editStudent(id, type, classId) {
    document.getElementById('modalTitle').innerText = "Cập nhật thông tin";
    document.getElementById('editMode').value = "true";
    document.getElementById('inputID').value = id;
    document.getElementById('inputID').disabled = true;

    let student = null;
    if (type === 'UNASSIGNED') student = db.unassignedStudents.find(s => s.id === id);
    else {
        const cls = db.classes.find(c => c.id === classId);
        if(cls) student = cls.students.find(s => s.id === id);
    }

    if(student) {
        document.getElementById('inputName').value = student.name || "";
        document.getElementById('inputDob').value = student.dob || ""; 
        document.getElementById('inputGender').value = student.gender || "Nam";
        document.getElementById('inputPhone').value = student.phone || "";
        document.getElementById('inputEmail').value = student.email || "";
        document.getElementById('inputAddress').value = student.address || "";
        document.getElementById('inputDateAdded').value = student.dateAdded || "";
        document.getElementById('inputFileAvatar').value = ""; 
        if (student.avatar) {
            document.getElementById('previewAvatar').src = student.avatar;
            document.getElementById('hiddenAvatarBase64').value = student.avatar;
        } else {
            document.getElementById('previewAvatar').src = "https://via.placeholder.com/60?text=HV";
            document.getElementById('hiddenAvatarBase64').value = "";
        }
    }
    document.getElementById('originClass').value = JSON.stringify({type, classId});
    new bootstrap.Modal(document.getElementById('studentFormModal')).show();
}

function saveStudent() {
    const isEdit = document.getElementById('editMode').value === "true";
    const id = document.getElementById('inputID').value.trim();
    const name = document.getElementById('inputName').value.trim();
    
    const newData = {
        name: name,
        dob: document.getElementById('inputDob').value,
        gender: document.getElementById('inputGender').value,
        phone: document.getElementById('inputPhone').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        address: document.getElementById('inputAddress').value.trim(),
        dateAdded: document.getElementById('inputDateAdded').value,
        avatar: document.getElementById('hiddenAvatarBase64').value
    };

    if (!id || !name) { showToast("Lỗi", "Vui lòng nhập Mã và Tên học viên.", "error"); return; }

    if (isEdit) {
        const origin = JSON.parse(document.getElementById('originClass').value);
        let studentRef = null;
        if (origin.type === 'UNASSIGNED') studentRef = db.unassignedStudents.find(s => s.id === id);
        else {
            const cls = db.classes.find(c => c.id === origin.classId);
            if(cls) studentRef = cls.students.find(s => s.id === id);
        }
        if(studentRef) {
            Object.assign(studentRef, newData);
            saveDB();
            showToast("Thành công", "Đã cập nhật thông tin chi tiết.");
        }
    } else {
        const all = getAllStudents();
        if (all.some(s => s.id === id)) { showToast("Lỗi", "Mã học viên đã tồn tại!", "error"); return; }
        db.unassignedStudents.push({ id, ...newData });
        saveDB();
        showToast("Thành công", "Đã thêm học viên vào danh sách chờ.");
    }
    bootstrap.Modal.getInstance(document.getElementById('studentFormModal')).hide();
    updateTable();
}

function requestDelete(id, type, classId) {
    deleteTarget = { id, type, classId };
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

function confirmDelete() {
    if (!deleteTarget) return;
    const { id, type, classId } = deleteTarget;
    if (type === 'UNASSIGNED') {
        const idx = db.unassignedStudents.findIndex(s => s.id === id);
        if (idx > -1) db.unassignedStudents.splice(idx, 1);
    } else {
        const cls = db.classes.find(c => c.id === classId);
        if (cls) {
            const idx = cls.students.findIndex(s => s.id === id);
            if (idx > -1) cls.students.splice(idx, 1);
        }
    }
    saveDB();
    showToast("Đã xóa", `Đã xóa hồ sơ học viên ${id}.`);
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    updateTable();
}

function showToast(title, message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    const icon = document.getElementById('toastIcon');
    icon.className = type === 'error' ? 'bi bi-exclamation-triangle-fill text-danger me-3 fs-4' : 'bi bi-check-circle-fill text-success me-3 fs-4';
    new bootstrap.Toast(toastEl).show();
}