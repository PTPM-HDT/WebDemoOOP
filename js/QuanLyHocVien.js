const DB_KEY = 'LETSCODE_DB';
let db = null;
let deleteTarget = null;
let tempStudentData = null; // Biến tạm để lưu dữ liệu chờ xác nhận

// CẤU HÌNH PHÂN TRANG
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let currentFilteredData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadDB();
    performSearch(); // Load lần đầu
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
            all.push({ ...s, className: "Chưa phân lớp", classId: null, type: 'UNASSIGNED', courseName: "Chưa đăng ký" });
        });
    }
    if (db.classes) {
        db.classes.forEach(cls => {
            // Trích xuất tên khóa học từ tên lớp (Ví dụ: "Lập trình Python A1" -> "Lập trình Python")
            // Ở đây dùng logic đơn giản: Lấy phần text trước chữ số cuối cùng hoặc dùng tên lớp làm tên khóa
            let cName = cls.name.split(' K')[0]; // Giả sử tên lớp có format "Tên Khóa Kxx"
            if(cName.length === cls.name.length) cName = cls.name; // Fallback

            cls.students.forEach(s => {
                all.push({ ...s, className: cls.name, classId: cls.id, type: 'ASSIGNED', courseName: cName });
            });
        });
    }
    return all;
}

// --- TÌM KIẾM & PHÂN TRANG ---
function performSearch() {
    currentPage = 1; // Reset về trang 1 khi tìm kiếm
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
        const matchClass = !classIdKw || (s.classId || '').toLowerCase().includes(classIdKw);
        
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
            const classBadge = s.type === 'UNASSIGNED' 
                ? `<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Chưa phân lớp</span>`
                : `<span class="badge bg-primary-subtle text-primary border border-primary-subtle">${s.className}</span><div class="small text-white-50 mt-1">Mã: ${s.classId}</div>`;

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
                <td><span class="text-info fw-bold">${s.courseName}</span></td>
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
    updateTable(); // Dùng hàm updateTable mới thay vì gọi trực tiếp filter
}

function openStudentModal() {
    document.getElementById('modalTitle').innerText = "Thêm Học Viên Mới";
    document.getElementById('editMode').value = "false";
    
    // Reset form
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

// --- BƯỚC 1: CHUẨN BỊ LƯU (HIỆN MODAL XÁC NHẬN) ---
function preSaveStudent() {
    const id = document.getElementById('inputID').value.trim();
    const name = document.getElementById('inputName').value.trim();
    const isEdit = document.getElementById('editMode').value === "true";

    if (!id || !name) { showToast("Lỗi", "Vui lòng nhập Mã và Tên học viên.", "error"); return; }

    // Check trùng ID nếu là thêm mới
    if (!isEdit) {
        const all = getAllStudents();
        if (all.some(s => s.id === id)) { showToast("Lỗi", "Mã học viên đã tồn tại!", "error"); return; }
    }

    // Lưu tạm dữ liệu vào biến toàn cục
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

    // Điền thông tin vào bảng xác nhận
    const ul = document.getElementById('confirmList');
    ul.innerHTML = `
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Mã HV:</strong> ${tempStudentData.id}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Họ tên:</strong> ${tempStudentData.name}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Ngày sinh:</strong> ${tempStudentData.dob || 'Chưa nhập'}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>SĐT:</strong> ${tempStudentData.phone || 'Chưa nhập'}</li>
        <li class="list-group-item bg-transparent text-white border-secondary"><strong>Email:</strong> ${tempStudentData.email || 'Chưa nhập'}</li>
    `;

    // Ẩn modal nhập, hiện modal xác nhận
    bootstrap.Modal.getInstance(document.getElementById('studentFormModal')).hide();
    new bootstrap.Modal(document.getElementById('confirmSaveModal')).show();
}

// --- BƯỚC 2: THỰC THI LƯU (SAU KHI XÁC NHẬN) ---
function executeSaveStudent() {
    if (!tempStudentData) return;

    const isEdit = document.getElementById('editMode').value === "true";

    if (isEdit) {
        const originString = document.getElementById('originClass').value;
        const origin = originString ? JSON.parse(originString) : null;
        let studentRef = null;

        if (origin && origin.type === 'UNASSIGNED') studentRef = db.unassignedStudents.find(s => s.id === tempStudentData.id);
        else if (origin) {
            const cls = db.classes.find(c => c.id === origin.classId);
            if(cls) studentRef = cls.students.find(s => s.id === tempStudentData.id);
        }

        if(studentRef) {
            Object.assign(studentRef, tempStudentData); // Update data
            saveDB();
            showToast("Thành công", "Đã cập nhật thông tin chi tiết.");
        }
    } else {
        db.unassignedStudents.push(tempStudentData);
        saveDB();
        showToast("Thành công", "Đã thêm học viên vào danh sách chờ.");
    }

    // Reset và đóng modal
    tempStudentData = null;
    bootstrap.Modal.getInstance(document.getElementById('confirmSaveModal')).hide();
    updateTable();
}

// Khi bấm "Quay lại sửa" ở modal xác nhận
document.querySelector('#confirmSaveModal .btn-glass-secondary').addEventListener('click', () => {
    new bootstrap.Modal(document.getElementById('studentFormModal')).show();
});

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