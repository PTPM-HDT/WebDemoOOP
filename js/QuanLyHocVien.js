const DB_KEY = 'LETSCODE_DB';
let db = null;
let deleteTarget = null;
let tempStudentData = null;

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let currentFilteredData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadDB();
    performSearch();
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

// --- [LOGIC MỚI] GOM NHÓM HỌC VIÊN ---
function getAllStudents() {
    const studentMap = new Map();

    // 1. Helper để merge thông tin (ưu tiên thông tin mới nhất nếu có khác biệt)
    const upsertStudent = (s, classInfo = null) => {
        if (!studentMap.has(s.id)) {
            studentMap.set(s.id, {
                ...s,
                currentClasses: [],
                finishedClasses: [],
                isUnassigned: false
            });
        }
        
        // Cập nhật thông tin cá nhân mới nhất (nếu có thay đổi ở các lớp khác nhau)
        const existing = studentMap.get(s.id);
        // Ưu tiên giữ lại avatar nếu có
        if (s.avatar && !existing.avatar) existing.avatar = s.avatar;
        
        if (classInfo) {
            if (classInfo.status === 'finished') {
                existing.finishedClasses.push(classInfo);
            } else {
                existing.currentClasses.push(classInfo);
            }
        }
    };

    // 2. Duyệt qua các lớp học (Ưu tiên xử lý lớp trước để lấy trạng thái học)
    if (db.classes) {
        db.classes.forEach(cls => {
            cls.students.forEach(s => {
                upsertStudent(s, {
                    id: cls.id,
                    name: cls.name,
                    status: cls.status // 'active', 'recruiting', 'finished'
                });
            });
        });
    }

    // 3. Duyệt danh sách chờ (Unassigned)
    if (db.unassignedStudents) {
        db.unassignedStudents.forEach(s => {
            // Chỉ thêm nếu chưa tồn tại hoặc đánh dấu unassigned nếu chưa có lớp hiện tại
            if (!studentMap.has(s.id)) {
                studentMap.set(s.id, {
                    ...s,
                    currentClasses: [],
                    finishedClasses: [],
                    isUnassigned: true
                });
            } else {
                // Nếu đã có trong map (tức là đã học xong lớp nào đó), kiểm tra xem có đang học lớp nào không
                const existing = studentMap.get(s.id);
                if (existing.currentClasses.length === 0) {
                    existing.isUnassigned = true;
                }
            }
        });
    }

    return Array.from(studentMap.values());
}

function performSearch() {
    currentPage = 1;
    updateTable();
}

function updateTable() {
    const nameKw = document.getElementById('searchName').value.toLowerCase();
    const idKw = document.getElementById('searchID').value.toLowerCase();
    const classIdKw = document.getElementById('searchClassID').value.toLowerCase();
    
    let students = getAllStudents();

    currentFilteredData = students.filter(s => {
        const matchName = !nameKw || (s.name || '').toLowerCase().includes(nameKw);
        const matchID = !idKw || (s.id || '').toLowerCase().includes(idKw);
        
        // Tìm trong cả lớp hiện tại và lớp đã xong
        const allClassIds = [...s.currentClasses, ...s.finishedClasses].map(c => c.id.toLowerCase());
        const matchClass = !classIdKw || allClassIds.some(cid => cid.includes(classIdKw));
        
        return matchName && matchID && matchClass;
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
            let contactHTML = `<div class="small"><i class="bi bi-telephone text-success me-1"></i>${s.phone}</div>`;
            // Render cột Lớp hiện tại
            let currentClassHTML = '';
            if (s.currentClasses.length > 0) {
                currentClassHTML = s.currentClasses.map(c => 
                    `<div class="mb-1"><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${c.name}</span></div>`
                ).join('');
            } else if (s.isUnassigned) {
                currentClassHTML = `<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Chưa phân lớp</span>`;
            } else {
                currentClassHTML = `<span class="text-muted small">Không có lớp</span>`;
            }

            // Render cột Lịch sử (Đã hoàn thành)
            let historyHTML = '';
            if (s.finishedClasses.length > 0) {
                historyHTML = s.finishedClasses.map(c => 
                    `<div class="small text-success"><i class="bi bi-check-circle-fill me-1"></i>${c.name}</div>`
                ).join('');
            } else {
                historyHTML = '<span class="text-white-50 small">--</span>';
            }

            const avatarImg = s.avatar 
                ? `<img src="${s.avatar}" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;">`
                : `<div class="d-inline-block rounded-circle bg-secondary text-center text-white me-2" style="width: 40px; height: 40px; line-height: 40px;"><i class="bi bi-person"></i></div>`;

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
                <td>${contactHTML}</td>
                <td>${currentClassHTML}</td>
                <td>${historyHTML}</td>
                <td>
                    <button class="btn btn-sm btn-icon btn-outline-info" onclick="editStudent('${s.id}')" title="Sửa">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-icon btn-outline-danger" onclick="requestDelete('${s.id}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// ... (Giữ nguyên các hàm Pagination, Modal, Save, Delete như cũ) ...
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
    document.getElementById('inputID').value = ""; document.getElementById('inputID').disabled = false;
    document.getElementById('inputName').value = ""; document.getElementById('inputDob').value = "";
    document.getElementById('inputGender').value = "Nam"; document.getElementById('inputPhone').value = "";
    document.getElementById('inputEmail').value = ""; document.getElementById('inputAddress').value = "";
    document.getElementById('inputFileAvatar').value = ""; document.getElementById('hiddenAvatarBase64').value = "";
    document.getElementById('previewAvatar').src = "https://via.placeholder.com/60?text=HV";
    document.getElementById('inputDateAdded').value = new Date().toISOString().split('T')[0];
    new bootstrap.Modal(document.getElementById('studentFormModal')).show();
}

// Chỉnh sửa editStudent để lấy dữ liệu đúng từ Map (hoặc tìm trong DB gốc)
function editStudent(id) {
    document.getElementById('modalTitle').innerText = "Cập nhật thông tin";
    document.getElementById('editMode').value = "true";
    document.getElementById('inputID').value = id;
    document.getElementById('inputID').disabled = true;

    // Tìm dữ liệu học viên (ưu tiên tìm trong unassigned hoặc lớp đầu tiên tìm thấy)
    let student = db.unassignedStudents.find(s => s.id === id);
    if (!student && db.classes) {
        for (const cls of db.classes) {
            const found = cls.students.find(s => s.id === id);
            if (found) {
                student = found;
                break;
            }
        }
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
    // Không cần originClass nữa vì ta update toàn bộ nơi có ID này
    new bootstrap.Modal(document.getElementById('studentFormModal')).show();
}

function preSaveStudent() {
    const id = document.getElementById('inputID').value.trim();
    const name = document.getElementById('inputName').value.trim();
    const isEdit = document.getElementById('editMode').value === "true";

    if (!id || !name) { showToast("Lỗi", "Vui lòng nhập Mã và Tên học viên.", "error"); return; }

    if (!isEdit) {
        // Check trùng ID
        let exists = db.unassignedStudents.some(s => s.id === id);
        if (!exists && db.classes) {
            exists = db.classes.some(c => c.students.some(s => s.id === id));
        }
        if (exists) { showToast("Lỗi", "Mã học viên đã tồn tại!", "error"); return; }
    }

    tempStudentData = {
        id: id,
        name: name,
        dob: document.getElementById('inputDob').value,
        gender: document.getElementById('inputGender').value,
        phone: document.getElementById('inputPhone').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        address: document.getElementById('inputAddress').value.trim(),
        dateAdded: document.getElementById('inputDateAdded').value,
        avatar: document.getElementById('hiddenAvatarBase64').value
    };

    const ul = document.getElementById('confirmList');
    ul.innerHTML = `
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Mã HV:</strong> ${tempStudentData.id}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Họ tên:</strong> ${tempStudentData.name}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Ngày sinh:</strong> ${tempStudentData.dob || 'Chưa nhập'}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>SĐT:</strong> ${tempStudentData.phone || 'Chưa nhập'}</li>
    `;

    bootstrap.Modal.getInstance(document.getElementById('studentFormModal')).hide();
    new bootstrap.Modal(document.getElementById('confirmSaveModal')).show();
}

// Hàm lưu (Cập nhật đồng bộ mọi nơi có ID này)
function executeSaveStudent() {
    if (!tempStudentData) return;
    const isEdit = document.getElementById('editMode').value === "true";

    if (isEdit) {
        // 1. Cập nhật trong ds chờ
        let sWait = db.unassignedStudents.find(s => s.id === tempStudentData.id);
        if(sWait) Object.assign(sWait, tempStudentData);

        // 2. Cập nhật trong TẤT CẢ các lớp (active, recruiting, finished)
        if(db.classes) {
            db.classes.forEach(cls => {
                let sClass = cls.students.find(s => s.id === tempStudentData.id);
                if(sClass) Object.assign(sClass, tempStudentData);
            });
        }
        showToast("Thành công", "Đã cập nhật thông tin đồng bộ.");
    } else {
        db.unassignedStudents.push(tempStudentData);
        showToast("Thành công", "Đã thêm học viên mới.");
    }
    
    saveDB();
    tempStudentData = null;
    bootstrap.Modal.getInstance(document.getElementById('confirmSaveModal')).hide();
    updateTable();
}

document.querySelector('#confirmSaveModal .btn-glass-secondary').addEventListener('click', () => {
    new bootstrap.Modal(document.getElementById('studentFormModal')).show();
});

function requestDelete(id) {
    deleteTarget = id; // Chỉ cần ID
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

// Xóa triệt để học viên khỏi hệ thống (cả ds chờ và các lớp)
function confirmDelete() {
    if (!deleteTarget) return;
    
    // 1. Xóa khỏi ds chờ
    const waitIdx = db.unassignedStudents.findIndex(s => s.id === deleteTarget);
    if (waitIdx > -1) db.unassignedStudents.splice(waitIdx, 1);

    // 2. Xóa khỏi tất cả các lớp
    if(db.classes) {
        db.classes.forEach(cls => {
            const sIdx = cls.students.findIndex(s => s.id === deleteTarget);
            if(sIdx > -1) cls.students.splice(sIdx, 1);
        });
    }

    saveDB();
    showToast("Đã xóa", `Đã xóa toàn bộ dữ liệu của học viên ${deleteTarget}.`);
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