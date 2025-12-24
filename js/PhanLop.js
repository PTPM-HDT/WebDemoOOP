// --- DỮ LIỆU MẪU (In-Memory Data) ---
// Dữ liệu sẽ quay về trạng thái này mỗi khi tải lại trang

let teachersData = [
    { id: "GV001", name: "Lê Minh Tâm", major: "Python" },
    { id: "GV002", name: "Phạm Thị Thanh Mai", major: "Web Frontend" },
    { id: "GV003", name: "Nguyễn Đức Thắng", major: "Data Science" },
    { id: "GV004", name: "Trần Thu Trang", major: "Algorithms" },
    { id: "GV005", name: "Hoàng Văn Nam", major: "C# / .NET" },
    { id: "GV006", name: "Đinh Ngọc Bích", major: "Software Testing" },
    { id: "GV007", name: "Vũ Quốc Hưng", major: "Network Security" },
    { id: "GV008", name: "Lương Thùy Linh", major: "English for IT" }
];

let classesData = [
    { 
        id: "PYA13", 
        name: "Lập trình Python Cơ bản A13", 
        teacherId: "GV001", 
        maxStudents: 10, 
        students: [
            { id: "HS1001", name: "Trần Minh Quang", dob: "15/01/2010", status: "Đang học" },
            { id: "HS1002", name: "Nguyễn Thu Hà", dob: "20/05/2010", status: "Đang học" },
            { id: "HS1003", name: "Phạm Quốc Bảo", dob: "12/03/2010", status: "Đang học" },
            { id: "HS1004", name: "Lê Văn Hùng", dob: "11/11/2010", status: "Đang học" },
            { id: "HS1005", name: "Đào Minh Tuấn", dob: "09/09/2010", status: "Cảnh báo" }
        ] 
    },
    { 
        id: "WEB01", 
        name: "Thiết kế Web Frontend K1", 
        teacherId: "GV002", 
        maxStudents: 5, 
        students: [
            { id: "HS2001", name: "Đặng Hoàng Nam", dob: "02/02/2009", status: "Đang học" },
            { id: "HS2002", name: "Bùi Thị Lan", dob: "03/03/2009", status: "Đang học" },
            { id: "HS2003", name: "Võ Tấn Phát", dob: "04/04/2009", status: "Đang học" },
            { id: "HS2004", name: "Lương Thế Bảo", dob: "05/05/2009", status: "Đang học" },
            { id: "HS2005", name: "Trương Ngọc Mai", dob: "06/06/2009", status: "Đang học" }
        ] 
    },
    { 
        id: "DATA20", 
        name: "Phân tích dữ liệu DA20", 
        teacherId: "GV003", 
        maxStudents: 25, 
        students: [
             { id: "HS3001", name: "Nguyễn Văn An", dob: "01/01/2008", status: "Đang học" }
        ] 
    },
    { 
        id: "NET05", 
        name: "Quản trị mạng CCNA", 
        teacherId: null, 
        maxStudents: 20, 
        students: [] 
    }
];

// Danh sách chờ (Pool)
let unassignedStudents = [
    { id: "NA001", name: "Huỳnh Gia Bảo", dob: "12/08/2010" },
    { id: "NA002", name: "Lê Ngọc Diệp", dob: "15/09/2010" },
    { id: "NA003", name: "Phan Thanh Tùng", dob: "01/12/2010" },
    { id: "NA004", name: "Nguyễn Phương Vy", dob: "22/07/2010" },
    { id: "NA005", name: "Hoàng Đức Mạnh", dob: "10/03/2010" },
    { id: "NA006", name: "Đỗ Thùy Chi", dob: "14/06/2010" },
    { id: "NA007", name: "Vũ Tuấn Kiệt", dob: "09/11/2010" },
    { id: "NA008", name: "Lý Văn Hải", dob: "22/01/2010" },
    { id: "NA009", name: "Cao Mỹ Duyên", dob: "18/04/2010" },
    { id: "NA010", name: "Dương Quang Huy", dob: "30/08/2010" },
    { id: "NA011", name: "Hồ Quang Khải", dob: "14/02/2010" },
    { id: "NA012", name: "Trịnh Văn Bình", dob: "11/11/2010" },
    { id: "NA013", name: "Nguyễn Thanh Sơn", dob: "05/07/2010" },
    { id: "NA014", name: "Trần Văn Tuấn", dob: "12/04/2010" },
    { id: "NA015", name: "Phạm Đức Hùng", dob: "13/05/2010" }
];

// --- BIẾN TOÀN CỤC ---
let currentClassId = null; 
let studentToDelete = null;

// --- APP INIT (KHỞI TẠO) ---
document.addEventListener('DOMContentLoaded', () => {
    renderClassList();
    const searchInput = document.getElementById('searchStudentInput');
    if (searchInput) {
        searchInput.addEventListener('input', renderUnassignedStudentList); 
    }
});

// --- HELPER FUNCTIONS ---
function getTeacherName(id) {
    if(!id) return "Chưa phân công";
    const t = teachersData.find(t => t.id === id);
    return t ? t.name : "Không xác định";
}

function showToast(title, message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastTitle.innerText = title;
    toastMsg.innerText = message;
    
    toastIcon.className = 'me-3 fs-4 ';
    if (type === 'error') {
        toastIcon.classList.add('bi', 'bi-exclamation-triangle-fill', 'text-danger');
    } else {
        toastIcon.classList.add('bi', 'bi-check-circle-fill', 'text-success');
    }

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// --- CLASS LIST & VIEW ---
function renderClassList() {
    const container = document.getElementById('classList');
    container.innerHTML = '';

    classesData.forEach(cls => {
        const isFull = cls.students.length >= cls.maxStudents;
        const badgeColor = isFull ? 'text-danger' : 'text-success';
        const statusText = isFull ? 'Đã đủ' : 'Đang tuyển';

        const div = document.createElement('div');
        div.className = `class-item ${currentClassId === cls.id ? 'active' : ''}`;
        div.onclick = () => handleSelectClass(cls.id);
        div.innerHTML = `
            <div>
                <span class="class-code">${cls.id}</span>
                <span class="class-info">${cls.name}</span>
            </div>
            <div class="text-end">
                <div class="fw-bold text-white small">${cls.students.length}/${cls.maxStudents}</div>
                <small class="${badgeColor}" style="font-size: 0.75rem;">${statusText}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

function handleSelectClass(classId) {
    currentClassId = classId;
    renderClassList(); 

    const cls = classesData.find(c => c.id === classId);
    if (!cls) return;

    // Ẩn màn hình chờ
    const emptyState = document.getElementById('emptyState');
    emptyState.classList.remove('d-flex'); 
    emptyState.style.display = 'none';

    document.getElementById('classDetailSection').style.display = 'block';

    // Điền thông tin chi tiết
    document.getElementById('detailClassCode').innerText = cls.id;
    document.getElementById('detailClassName').innerText = cls.name;
    document.getElementById('detailTeacher').innerText = getTeacherName(cls.teacherId);
    
    const capEl = document.getElementById('detailCapacity');
    capEl.innerText = `${cls.students.length}/${cls.maxStudents}`;
    capEl.className = cls.students.length >= cls.maxStudents ? 'fs-2 fw-bold text-danger' : 'fs-2 fw-bold text-success';

    // Render bảng học viên
    const tbody = document.getElementById('detailStudentList');
    tbody.innerHTML = '';
    if(cls.students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Lớp trống.</td></tr>';
    } else {
        cls.students.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td><span class="font-monospace text-white-50">${s.id}</span></td>
                    <td class="fw-bold text-white">${s.name}</td>
                    <td>${s.dob}</td>
                    <td><span class="badge bg-success-subtle text-success border border-success-subtle">${s.status}</span></td>
                    <td class="text-end">
                        <button class="btn btn-icon btn-outline-danger btn-sm" onclick="handleRemoveStudent('${s.id}', '${s.name}')" title="Xóa khỏi lớp">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }
}

// --- [MỚI] QUẢN LÝ LỚP HỌC (THÊM, SỬA, XÓA) ---

// 1. Mở Form Thêm Lớp
function handleOpenAddClass() {
    document.getElementById('classFormTitle').innerText = "Tạo Lớp Học Mới";
    document.getElementById('isEditMode').value = "false";
    
    document.getElementById('inputClassId').value = "";
    document.getElementById('inputClassId').disabled = false; // Cho phép nhập ID khi tạo mới
    document.getElementById('inputClassName').value = "";
    document.getElementById('inputClassMax').value = "20";

    new bootstrap.Modal(document.getElementById('classFormModal')).show();
}

// 2. Mở Form Sửa Lớp
function handleOpenEditClass() {
    if (!currentClassId) return;
    const cls = classesData.find(c => c.id === currentClassId);

    document.getElementById('classFormTitle').innerText = "Chỉnh Sửa Thông Tin Lớp";
    document.getElementById('isEditMode').value = "true";
    
    document.getElementById('inputClassId').value = cls.id;
    document.getElementById('inputClassId').disabled = true; // Không cho sửa ID
    document.getElementById('inputClassName').value = cls.name;
    document.getElementById('inputClassMax').value = cls.maxStudents;

    new bootstrap.Modal(document.getElementById('classFormModal')).show();
}

// 3. Lưu Lớp (Xử lý cả Thêm mới và Sửa)
function saveClass() {
    const isEdit = document.getElementById('isEditMode').value === "true";
    const id = document.getElementById('inputClassId').value.trim();
    const name = document.getElementById('inputClassName').value.trim();
    const max = parseInt(document.getElementById('inputClassMax').value);

    if (!id || !name || !max) {
        showToast("Lỗi", "Vui lòng nhập đầy đủ thông tin.", "error");
        return;
    }

    if (isEdit) {
        // Cập nhật lớp hiện tại
        const cls = classesData.find(c => c.id === currentClassId);
        cls.name = name;
        cls.maxStudents = max;
        
        handleSelectClass(currentClassId); // Reload UI chi tiết
        showToast("Thành công", "Đã cập nhật thông tin lớp.");
    } else {
        // Tạo lớp mới
        // Kiểm tra trùng ID
        if (classesData.some(c => c.id === id)) {
            showToast("Lỗi", "Mã lớp này đã tồn tại!", "error");
            return;
        }

        const newClass = {
            id: id,
            name: name,
            teacherId: null, // Chưa có GV
            maxStudents: max,
            students: []
        };
        classesData.push(newClass);
        handleSelectClass(id); // Chuyển ngay tới lớp mới tạo
        showToast("Thành công", `Đã tạo lớp ${id}.`);
    }

    renderClassList();
    bootstrap.Modal.getInstance(document.getElementById('classFormModal')).hide();
}

// 4. Mở Modal Xác nhận Xóa Lớp
function handleDeleteClass() {
    if (!currentClassId) return;
    const cls = classesData.find(c => c.id === currentClassId);
    document.getElementById('delClassName').innerText = `${cls.id} - ${cls.name}`;
    new bootstrap.Modal(document.getElementById('deleteClassModal')).show();
}

// 5. Thực thi Xóa Lớp
function executeDeleteClass() {
    if (!currentClassId) return;

    const clsIndex = classesData.findIndex(c => c.id === currentClassId);
    if (clsIndex > -1) {
        const cls = classesData[clsIndex];

        // Quan trọng: Trả học viên về danh sách chờ
        if (cls.students.length > 0) {
            cls.students.forEach(s => {
                unassignedStudents.push({
                    id: s.id,
                    name: s.name,
                    dob: s.dob
                });
            });
            showToast("Thông báo", `${cls.students.length} học viên đã được chuyển về DS chờ.`);
        }

        // Xóa lớp khỏi mảng
        classesData.splice(clsIndex, 1);
        
        // Reset giao diện
        currentClassId = null;
        document.getElementById('classDetailSection').style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
        document.getElementById('emptyState').classList.add('d-flex'); // Thêm lại class d-flex để căn giữa
        
        renderClassList();
        showToast("Đã xóa", "Lớp học đã bị xóa vĩnh viễn.");
    }

    bootstrap.Modal.getInstance(document.getElementById('deleteClassModal')).hide();
}


// --- QUẢN LÝ HỌC VIÊN & GIÁO VIÊN (Giữ nguyên logic cũ) ---

function handleOpenAddStudent() {
    if (!currentClassId) return;
    const cls = classesData.find(c => c.id === currentClassId);

    if (cls.students.length >= cls.maxStudents) {
        showToast('Không thể thêm', 'Lớp học này đã đủ sĩ số.', 'error');
        return; 
    }

    document.getElementById('modalTargetClass').innerText = cls.name;
    renderUnassignedStudentList();
    new bootstrap.Modal(document.getElementById('addStudentModal')).show();
}

function renderUnassignedStudentList() {
    const listContainer = document.getElementById('unassignedList');
    listContainer.innerHTML = '';
    document.getElementById('selectedCount').innerText = '0';
    
    const searchInput = document.getElementById('searchStudentInput');
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

    if (unassignedStudents.length === 0) {
        listContainer.innerHTML = '<div class="text-center text-muted py-4">Hết học viên trong danh sách chờ.</div>';
        return;
    }

    const filteredList = unassignedStudents.filter(s => {
        const nameMatch = s.name.toLowerCase().includes(keyword);
        const idMatch = s.id.toLowerCase().includes(keyword);
        return nameMatch || idMatch; 
    });

    if (filteredList.length === 0) {
         listContainer.innerHTML = '<div class="text-center text-muted py-4">Không tìm thấy kết quả.</div>';
         return;
    }

    filteredList.forEach(s => {
        const item = document.createElement('div');
        item.className = 'student-select-item';
        item.innerHTML = `
            <div class="form-check w-100 m-0">
                <input class="form-check-input me-3 student-checkbox" type="checkbox" value="${s.id}" id="chk_${s.id}">
                <label class="form-check-label w-100 cursor-pointer" for="chk_${s.id}">
                    <div class="fw-bold text-white">${s.name}</div>
                    <div class="small text-white-50">Mã: ${s.id} | NS: ${s.dob}</div>
                </label>
            </div>
        `;
        listContainer.appendChild(item);
    });

    document.querySelectorAll('.student-checkbox').forEach(chk => {
        chk.addEventListener('change', () => {
            document.getElementById('selectedCount').innerText = document.querySelectorAll('.student-checkbox:checked').length;
        });
    });
}

function confirmAddStudents() {
    const checkboxes = document.querySelectorAll('.student-checkbox:checked');
    if (checkboxes.length === 0) {
        showToast('Chưa chọn', 'Vui lòng chọn ít nhất 1 học viên', 'error');
        return;
    }

    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const cls = classesData.find(c => c.id === currentClassId);

    if (cls.students.length + selectedIds.length > cls.maxStudents) {
        showToast('Quá tải', `Chỉ còn trống ${cls.maxStudents - cls.students.length} chỗ.`, 'error');
        return;
    }

    selectedIds.forEach(id => {
        const sIndex = unassignedStudents.findIndex(s => s.id === id);
        if (sIndex > -1) {
            const student = unassignedStudents[sIndex];
            cls.students.push({ ...student, status: 'Mới thêm' });
            unassignedStudents.splice(sIndex, 1);
        }
    });

    handleSelectClass(currentClassId);
    renderClassList();
    bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
    showToast('Thành công', `Đã thêm ${selectedIds.length} học viên.`);
}

function handleRemoveStudent(studentId, studentName) {
    studentToDelete = studentId;
    document.getElementById('delStudentName').innerText = studentName;
    new bootstrap.Modal(document.getElementById('deleteConfirmModal')).show();
}

function executeRemoveStudent() {
    if(!studentToDelete || !currentClassId) return;

    const cls = classesData.find(c => c.id === currentClassId);
    const sIndex = cls.students.findIndex(s => s.id === studentToDelete);

    if(sIndex > -1) {
        const student = cls.students[sIndex];
        cls.students.splice(sIndex, 1);
        unassignedStudents.push({
            id: student.id,
            name: student.name,
            dob: student.dob
        });
        
        showToast('Đã xóa', `Đã xóa ${student.name} khỏi lớp.`);
    }

    studentToDelete = null;
    handleSelectClass(currentClassId);
    renderClassList();
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
}

function handleOpenChangeTeacher() {
    if(!currentClassId) return;
    const cls = classesData.find(c => c.id === currentClassId);
    
    const container = document.getElementById('teacherListContainer');
    container.innerHTML = '';

    teachersData.forEach(t => {
        const isSelected = t.id === cls.teacherId ? 'checked' : '';
        const item = document.createElement('div');
        item.className = 'teacher-select-item';
        item.onclick = () => { document.getElementById(`radio_${t.id}`).checked = true; };
        item.innerHTML = `
            <input class="form-check-input teacher-radio me-3" type="radio" name="teacherRadio" value="${t.id}" id="radio_${t.id}" ${isSelected}>
            <label class="cursor-pointer flex-grow-1" for="radio_${t.id}">
                <div class="fw-bold text-white">${t.name}</div>
                <div class="small text-white-50">Chuyên môn: ${t.major}</div>
            </label>
        `;
        container.appendChild(item);
    });

    new bootstrap.Modal(document.getElementById('changeTeacherModal')).show();
}

function confirmChangeTeacher() {
    const selectedRadio = document.querySelector('input[name="teacherRadio"]:checked');
    if(!selectedRadio) {
        showToast('Chưa chọn', 'Vui lòng chọn một giáo viên.', 'error');
        return;
    }

    const cls = classesData.find(c => c.id === currentClassId);
    cls.teacherId = selectedRadio.value;
    
    const tName = getTeacherName(cls.teacherId);
    document.getElementById('detailTeacher').innerText = tName;
    
    showToast('Cập nhật', `Giáo viên phụ trách mới: ${tName}`);
    bootstrap.Modal.getInstance(document.getElementById('changeTeacherModal')).hide();
}

function removeTeacherFromClass() {
    const cls = classesData.find(c => c.id === currentClassId);
    cls.teacherId = null;
    
    document.getElementById('detailTeacher').innerText = "Chưa phân công";
    showToast('Cảnh báo', `Lớp học hiện chưa có giáo viên phụ trách.`, 'error');
    bootstrap.Modal.getInstance(document.getElementById('changeTeacherModal')).hide();
}