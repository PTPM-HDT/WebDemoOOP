// --- QUẢN LÝ DỮ LIỆU CHUNG (SHARED DATA MANAGER) ---
const DB_KEY = 'LETSCODE_DB';

// --- DANH SÁCH DỮ LIỆU NGUỒN (TÊN TIẾNG VIỆT CHUẨN) ---
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Huỳnh', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const LOT_NAM = ['Văn', 'Hữu', 'Đức', 'Thanh', 'Minh', 'Gia', 'Quốc', 'Tuấn', 'Hoàng', 'Công', 'Đình', 'Xuân', 'Chí', 'Quang', 'Ngọc', 'Thế'];
const LOT_NU = ['Thị', 'Ngọc', 'Thanh', 'Thùy', 'Phương', 'Khánh', 'Minh', 'Mai', 'Hồng', 'Kim', 'Bảo', 'Anh', 'Mỹ', 'Tường', 'Nhật', 'Lan'];
const TEN_NAM = ['Hùng', 'Dũng', 'Cường', 'Vinh', 'Huy', 'Khang', 'Bảo', 'Minh', 'Tùng', 'Phúc', 'Lâm', 'Khoa', 'Kiên', 'Thành', 'Đạt', 'Nam', 'Trung', 'Hiếu', 'Nghĩa', 'Trí', 'Tín', 'Nhân'];
const TEN_NU = ['Lan', 'Huệ', 'Cúc', 'Mai', 'Hoa', 'Hương', 'Thảo', 'Trang', 'Huyền', 'Ly', 'Phương', 'Quỳnh', 'Anh', 'Diệp', 'Ngân', 'Nhi', 'Chi', 'Châu', 'Vy', 'Hân', 'Thư', 'Quyên'];
const TINH_THANH = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Khánh Hòa", "Nghệ An", "Thanh Hóa", "Lâm Đồng", "Đắk Lắk", "Bình Định", "Quảng Nam", "Huế", "Nam Định", "Thái Bình"];
const MAJORS = [
    "Scratch & STEM", "Robotics Lego", "Python & AI", "Web Frontend", "Web Backend", 
    "Mobile App (Flutter)", "Graphic Design", "UI/UX Design", "English for IT", "Kỹ năng mềm"
];

// --- HÀM HELPER SINH DỮ LIỆU ---
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 1. Hàm sinh Tên người (Giáo viên & Học viên dùng chung logic để đảm bảo tính thật)
function generateName(gender) {
    const ho = getRandomItem(HO);
    let lot, ten;
    if (gender === 'Nam') {
        lot = getRandomItem(LOT_NAM);
        ten = getRandomItem(TEN_NAM);
    } else {
        lot = getRandomItem(LOT_NU);
        ten = getRandomItem(TEN_NU);
    }
    return `${ho} ${lot} ${ten}`;
}

// 2. Hàm sinh Giáo viên (Tuổi từ 24 - 45)
function generateTeacher(index) {
    const id = `GV${String(index).padStart(3, '0')}`; // GV001, GV002...
    const gender = Math.random() > 0.5 ? 'Nam' : 'Nữ';
    const name = generateName(gender);
    
    // Sinh năm 1980 - 2000
    const year = getRandomInt(1980, 2000);
    const month = String(getRandomInt(1, 12)).padStart(2, '0');
    const day = String(getRandomInt(1, 28)).padStart(2, '0');
    
    const major = MAJORS[index % MAJORS.length]; // Chia đều chuyên môn
    const hometown = getRandomItem(TINH_THANH);
    
    return {
        id: id,
        name: name,
        major: major,
        dob: `${year}-${month}-${day}`,
        phone: `09${getRandomInt(0, 9)}${getRandomInt(1000000, 9999999)}`,
        email: `${removeVietnameseTones(name).toLowerCase().replace(/ /g, '.')}@letscode.edu.vn`,
        cccd: `0${getRandomInt(10, 99)}0${year}${getRandomInt(100000, 999999)}`, // Format CCCD gần đúng
        hometown: hometown,
        avatar: ""
    };
}

// 3. Hàm sinh Học viên (Tuổi từ 8 - 18)
function generateStudent(id, status = "Đang học") {
    const gender = Math.random() > 0.45 ? 'Nam' : 'Nữ';
    const name = generateName(gender);
    
    const year = getRandomInt(2006, 2016);
    const month = String(getRandomInt(1, 12)).padStart(2, '0');
    const day = String(getRandomInt(1, 28)).padStart(2, '0');
    
    const wards = ["Vĩnh Hải", "Vĩnh Phước", "Lộc Thọ", "Phước Tân", "Phước Long", "Vĩnh Trường", "Diên Khánh", "Cam Lâm"];
    
    return {
        id: id,
        name: name,
        dob: `${year}-${month}-${day}`,
        gender: gender,
        phone: `0${getRandomInt(3, 9)}${getRandomInt(10000000, 99999999)}`,
        email: `${removeVietnameseTones(name).toLowerCase().split(' ').pop()}${year}@gmail.com`,
        address: `${getRandomItem(wards)}, Khánh Hòa`,
        dateAdded: `2024-0${getRandomInt(1, 9)}-${getRandomInt(10, 28)}`,
        status: status,
        avatar: ""
    };
}

// Hàm bỏ dấu tiếng Việt để tạo email (Ví dụ: Nguyễn Văn Ân -> nguyenvanan)
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

// --- SINH DỮ LIỆU TỰ ĐỘNG ---

// 1. Tạo 30 Giáo viên
const generatedTeachers = [];
for (let i = 1; i <= 30; i++) {
    generatedTeachers.push(generateTeacher(i));
}

// 2. Tạo 30 Lớp học & Phân công giáo viên
const classTemplates = [
    { code: "SCR_B", name: "Scratch Cơ Bản", max: 15 },
    { code: "SCR_A", name: "Scratch Nâng Cao", max: 12 },
    { code: "ROBO_E", name: "Robotics Essential", max: 10 },
    { code: "ROBO_P", name: "Robotics Prime", max: 10 },
    { code: "PY_BAS", name: "Python Cơ bản", max: 20 },
    { code: "WEB_FE", name: "Web Frontend", max: 20 },
    { code: "DES_GR", name: "Graphic Design", max: 15 },
    { code: "ENG_IT", name: "English for IT", max: 25 },
    { code: "MOB_FL", name: "Mobile Flutter", max: 15 },
    { code: "DATA_S", name: "Data Science", max: 20 }
];

const generatedClasses = [];
let studentIdCounter = 1000;

for (let i = 0; i < 30; i++) {
    const template = classTemplates[i % classTemplates.length];
    const classId = `${template.code}_${String(Math.floor(i / classTemplates.length) + 1).padStart(2, '0')}`; // VD: SCR_B_01
    
    // Gán giáo viên: Lấy theo index hoặc random nhưng đảm bảo logic chuyên môn
    // Để đơn giản cho demo: Gán xoay vòng giáo viên
    const teacherId = generatedTeachers[i % generatedTeachers.length].id;
    
    // Trạng thái lớp: 20 lớp đầu Đã khóa (Hoạt động), 10 lớp sau Mở (Tuyển sinh)
    const isLocked = i < 20; 
    
    // Sinh học viên cho lớp (Nếu lớp đã khóa thì có 5-10 học viên, lớp mở thì 0-3)
    const studentCount = isLocked ? getRandomInt(5, 10) : getRandomInt(0, 3);
    const students = [];
    
    for(let k=0; k<studentCount; k++) {
        studentIdCounter++;
        students.push(generateStudent(`HV${studentIdCounter}`, "Đang học"));
    }

    generatedClasses.push({
        id: classId,
        name: `${template.name} - Lớp ${Math.floor(i / classTemplates.length) + 1}`,
        teacherId: teacherId,
        maxStudents: template.max,
        isLocked: isLocked,
        students: students
    });
}

// 3. Tạo 50 Học viên chờ
const generatedUnassigned = [];
for (let i = 0; i < 50; i++) {
    studentIdCounter++;
    generatedUnassigned.push(generateStudent(`HV${studentIdCounter}`, undefined));
}

// --- GÁN VÀO DỮ LIỆU BAN ĐẦU ---
const initialData = {
    teachers: generatedTeachers,
    classes: generatedClasses,
    unassignedStudents: generatedUnassigned,
    scores: {}
};

// --- BIẾN TOÀN CỤC & LOGIC XỬ LÝ (GIỮ NGUYÊN) ---
let db = null;
let currentClassId = null; 
let studentToDelete = null;

function loadDB() {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
        db = JSON.parse(data);
        if (!db.scores) db.scores = {};
    } else {
        db = JSON.parse(JSON.stringify(initialData));
        saveDB();
    }
}

function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// --- APP INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadDB();
    if(document.getElementById('classList')) { 
        renderClassList();
    }
    
    const searchInput = document.getElementById('searchStudentInput');
    if (searchInput) {
        searchInput.addEventListener('input', renderUnassignedStudentList); 
    }
});

// --- HELPER FUNCTIONS ---
function getTeacherName(id) {
    if(!id) return "Chưa phân công";
    const t = db.teachers.find(t => t.id === id);
    return t ? t.name : "Không xác định";
}

function showToast(title, message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    if(!toastEl) return;
    
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

// --- LOGIC GIAO DIỆN PHÂN LỚP ---
function renderClassList() {
    const container = document.getElementById('classList');
    if(!container) return;
    container.innerHTML = '';

    db.classes.forEach(cls => {
        const isFull = cls.students.length >= cls.maxStudents;
        const badgeColor = isFull ? 'text-danger' : 'text-success';
        let statusText = isFull ? 'Đã đủ' : 'Đang tuyển';
        
        let lockIcon = '';
        if (cls.isLocked) {
            statusText = 'Đã chốt';
            lockIcon = '<i class="bi bi-lock-fill text-warning me-2"></i>';
        }

        const div = document.createElement('div');
        div.className = `class-item ${currentClassId === cls.id ? 'active' : ''}`;
        div.onclick = () => handleSelectClass(cls.id);
        div.innerHTML = `
            <div>
                <span class="class-code">${lockIcon}${cls.id}</span>
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

    const cls = db.classes.find(c => c.id === classId);
    if (!cls) return;

    const emptyState = document.getElementById('emptyState');
    if(emptyState) {
        emptyState.classList.remove('d-flex'); 
        emptyState.style.display = 'none';
    }

    const detailSection = document.getElementById('classDetailSection');
    if(detailSection) detailSection.style.display = 'block';

    document.getElementById('detailClassCode').innerText = cls.id;
    document.getElementById('detailClassName').innerText = cls.name;
    document.getElementById('detailTeacher').innerText = getTeacherName(cls.teacherId);
    
    updateLockButtonState(cls.isLocked);

    const capEl = document.getElementById('detailCapacity');
    capEl.innerText = `${cls.students.length}/${cls.maxStudents}`;
    capEl.className = cls.students.length >= cls.maxStudents ? 'fs-2 fw-bold text-danger' : 'fs-2 fw-bold text-success';

    renderStudentTable(cls);
}

function renderStudentTable(cls) {
    const tbody = document.getElementById('detailStudentList');
    tbody.innerHTML = '';
    if(cls.students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Lớp trống.</td></tr>';
    } else {
        cls.students.forEach(s => {
            // Convert YYYY-MM-DD sang DD/MM/YYYY
            let displayDob = s.dob;
            if(s.dob && s.dob.includes('-')){
                displayDob = s.dob.split('-').reverse().join('/');
            }

            tbody.innerHTML += `
                <tr>
                    <td><span class="font-monospace text-white-50">${s.id}</span></td>
                    <td class="fw-bold text-white">${s.name}</td>
                    <td>${displayDob}</td>
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

function updateLockButtonState(isLocked) {
    const btn = document.getElementById('btnLockClass');
    if(!btn) return;
    if (isLocked) {
        btn.innerHTML = '<i class="bi bi-lock-fill"></i>';
        btn.className = 'btn btn-sm btn-icon btn-warning';
        btn.title = "Mở khóa lớp (Đang khóa)";
    } else {
        btn.innerHTML = '<i class="bi bi-unlock-fill"></i>';
        btn.className = 'btn btn-sm btn-icon btn-outline-warning';
        btn.title = "Khóa lớp (Chốt danh sách)";
    }
}

function handleToggleLockClass() {
    if (!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    cls.isLocked = !cls.isLocked;
    saveDB();
    updateLockButtonState(cls.isLocked);
    renderClassList();
    const msg = cls.isLocked ? `Đã khóa lớp ${cls.id}.` : `Đã mở khóa lớp ${cls.id}.`;
    showToast("Thành công", msg);
}

// CÁC HÀM LOGIC ADD/EDIT/DELETE
function handleOpenAddClass() {
    document.getElementById('classFormTitle').innerText = "Tạo Lớp Học Mới";
    document.getElementById('isEditMode').value = "false";
    document.getElementById('inputClassId').value = "";
    document.getElementById('inputClassId').disabled = false;
    document.getElementById('inputClassName').value = "";
    document.getElementById('inputClassMax').value = "20";
    new bootstrap.Modal(document.getElementById('classFormModal')).show();
}

function handleOpenEditClass() {
    if (!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    document.getElementById('classFormTitle').innerText = "Chỉnh Sửa Thông Tin Lớp";
    document.getElementById('isEditMode').value = "true";
    document.getElementById('inputClassId').value = cls.id;
    document.getElementById('inputClassId').disabled = true;
    document.getElementById('inputClassName').value = cls.name;
    document.getElementById('inputClassMax').value = cls.maxStudents;
    new bootstrap.Modal(document.getElementById('classFormModal')).show();
}

function saveClass() {
    const isEdit = document.getElementById('isEditMode').value === "true";
    const id = document.getElementById('inputClassId').value.trim();
    const name = document.getElementById('inputClassName').value.trim();
    const max = parseInt(document.getElementById('inputClassMax').value);

    if (!id || !name || !max) { showToast("Lỗi", "Vui lòng nhập đầy đủ thông tin.", "error"); return; }

    if (isEdit) {
        const cls = db.classes.find(c => c.id === currentClassId);
        cls.name = name;
        cls.maxStudents = max;
        saveDB();
        handleSelectClass(currentClassId);
        showToast("Thành công", "Đã cập nhật thông tin lớp.");
    } else {
        if (db.classes.some(c => c.id === id)) { showToast("Lỗi", "Mã lớp này đã tồn tại!", "error"); return; }
        db.classes.push({ id, name, teacherId: null, maxStudents: max, isLocked: false, students: [] });
        saveDB();
        handleSelectClass(id);
        showToast("Thành công", `Đã tạo lớp ${id}.`);
    }
    renderClassList();
    bootstrap.Modal.getInstance(document.getElementById('classFormModal')).hide();
}

function handleDeleteClass() {
    if (!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    document.getElementById('delClassName').innerText = `${cls.id} - ${cls.name}`;
    new bootstrap.Modal(document.getElementById('deleteClassModal')).show();
}

function executeDeleteClass() {
    if (!currentClassId) return;
    const clsIndex = db.classes.findIndex(c => c.id === currentClassId);
    if (clsIndex > -1) {
        const cls = db.classes[clsIndex];
        if (cls.students.length > 0) {
            cls.students.forEach(s => { db.unassignedStudents.push({ ...s }); });
        }
        db.classes.splice(clsIndex, 1);
        saveDB();
        currentClassId = null;
        document.getElementById('classDetailSection').style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
        renderClassList();
        showToast("Đã xóa", "Lớp học đã bị xóa.");
    }
    bootstrap.Modal.getInstance(document.getElementById('deleteClassModal')).hide();
}

function handleOpenAddStudent() {
    if (!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    if (cls.students.length >= cls.maxStudents) { showToast('Không thể thêm', 'Lớp học đã đủ sĩ số.', 'error'); return; }
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

    const filteredList = db.unassignedStudents.filter(s => s.name.toLowerCase().includes(keyword) || s.id.toLowerCase().includes(keyword));

    if (filteredList.length === 0) { listContainer.innerHTML = '<div class="text-center text-muted py-4">Không tìm thấy kết quả.</div>'; return; }

    filteredList.forEach(s => {
        const item = document.createElement('div');
        item.className = 'student-select-item';
        item.innerHTML = `
            <div class="form-check w-100 m-0">
                <input class="form-check-input me-3 student-checkbox" type="checkbox" value="${s.id}" id="chk_${s.id}">
                <label class="form-check-label w-100 cursor-pointer" for="chk_${s.id}">
                    <div class="fw-bold text-white">${s.name}</div>
                    <div class="small text-white-50">Mã: ${s.id} | ${s.gender}</div>
                </label>
            </div>
        `;
        listContainer.appendChild(item);
    });
    document.querySelectorAll('.student-checkbox').forEach(chk => {
        chk.addEventListener('change', () => { document.getElementById('selectedCount').innerText = document.querySelectorAll('.student-checkbox:checked').length; });
    });
}

function confirmAddStudents() {
    const checkboxes = document.querySelectorAll('.student-checkbox:checked');
    if (checkboxes.length === 0) return;
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const cls = db.classes.find(c => c.id === currentClassId);

    if (cls.students.length + selectedIds.length > cls.maxStudents) { showToast('Quá tải', 'Lớp không đủ chỗ.', 'error'); return; }

    selectedIds.forEach(id => {
        const sIndex = db.unassignedStudents.findIndex(s => s.id === id);
        if (sIndex > -1) {
            const student = db.unassignedStudents[sIndex];
            cls.students.push({ ...student, status: 'Mới thêm' });
            db.unassignedStudents.splice(sIndex, 1);
        }
    });
    saveDB();
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
    const cls = db.classes.find(c => c.id === currentClassId);
    const sIndex = cls.students.findIndex(s => s.id === studentToDelete);
    if(sIndex > -1) {
        const student = cls.students[sIndex];
        cls.students.splice(sIndex, 1);
        db.unassignedStudents.push({ ...student, status: undefined });
        saveDB();
        showToast('Đã xóa', `Đã xóa ${student.name} khỏi lớp.`);
    }
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
    handleSelectClass(currentClassId);
    renderClassList();
}

function handleOpenChangeTeacher() {
    if(!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    const container = document.getElementById('teacherListContainer');
    container.innerHTML = '';
    db.teachers.forEach(t => {
        const isSelected = t.id === cls.teacherId ? 'checked' : '';
        const item = document.createElement('div');
        item.className = 'teacher-select-item';
        item.onclick = () => { document.getElementById(`radio_${t.id}`).checked = true; };
        item.innerHTML = `
            <input class="form-check-input teacher-radio me-3" type="radio" name="teacherRadio" value="${t.id}" id="radio_${t.id}" ${isSelected}>
            <label class="cursor-pointer flex-grow-1" for="radio_${t.id}">
                <div class="fw-bold text-white">${t.name}</div>
                <div class="small text-white-50">${t.major}</div>
            </label>
        `;
        container.appendChild(item);
    });
    new bootstrap.Modal(document.getElementById('changeTeacherModal')).show();
}

function confirmChangeTeacher() {
    const selectedRadio = document.querySelector('input[name="teacherRadio"]:checked');
    if(!selectedRadio) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    cls.teacherId = selectedRadio.value;
    saveDB();
    document.getElementById('detailTeacher').innerText = getTeacherName(cls.teacherId);
    bootstrap.Modal.getInstance(document.getElementById('changeTeacherModal')).hide();
    showToast('Thành công', "Đã đổi giáo viên.");
}

function removeTeacherFromClass() {
    const cls = db.classes.find(c => c.id === currentClassId);
    cls.teacherId = null;
    saveDB();
    document.getElementById('detailTeacher').innerText = "Chưa phân công";
    bootstrap.Modal.getInstance(document.getElementById('changeTeacherModal')).hide();
    showToast('Cảnh báo', "Đã gỡ giáo viên.", 'error');
}