
const DB_KEY = 'LETSCODE_DB';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Hàm sinh tên tiếng Việt thật
function generateName(gender) {
    const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Huỳnh', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
    
    const lotNam = ['Văn', 'Hữu', 'Đức', 'Thanh', 'Minh', 'Gia', 'Quốc', 'Tuấn', 'Hoàng', 'Công', 'Đình', 'Xuân', 'Chí', 'Quang', 'Mạnh', 'Tiến'];
    const tenNam = ['Hùng', 'Dũng', 'Cường', 'Vinh', 'Huy', 'Khang', 'Bảo', 'Minh', 'Tùng', 'Phúc', 'Lâm', 'Khoa', 'Kiên', 'Thành', 'Đạt', 'Nam', 'Trung', 'Hiếu', 'Nghĩa', 'Trí', 'Quân', 'Thắng'];
    
    const lotNu = ['Thị', 'Ngọc', 'Thanh', 'Thùy', 'Phương', 'Khánh', 'Minh', 'Mai', 'Hồng', 'Kim', 'Bảo', 'Anh', 'Mỹ', 'Tường', 'Diệu', 'Lan'];
    const tenNu = ['Lan', 'Huệ', 'Cúc', 'Mai', 'Hoa', 'Hương', 'Thảo', 'Trang', 'Huyền', 'Ly', 'Phương', 'Quỳnh', 'Anh', 'Diệp', 'Ngân', 'Nhi', 'Chi', 'Châu', 'Vy', 'Hân', 'Thư', 'Uyên'];

    const hoTen = getRandomItem(ho);
    let lot, ten;
    
    if (gender === 'Nam') {
        lot = getRandomItem(lotNam);
        ten = getRandomItem(tenNam);
    } else {
        lot = getRandomItem(lotNu);
        ten = getRandomItem(tenNu);
    }
    return `${hoTen} ${lot} ${ten}`;
}

// Hàm xóa dấu tiếng Việt để tạo email
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

// Hàm tạo giáo viên với tên thật ngẫu nhiên
function generateTeacher(index) {
    const id = `GV${String(index).padStart(3, '0')}`;
    const gender = Math.random() > 0.5 ? 'Nam' : 'Nữ';
    
    // Tự sinh tên thật thay vì dùng danh sách cố định
    const name = generateName(gender); 
    
    const majors = ["Scratch & STEM", "Robotics Lego", "Python & AI", "Web Frontend", "Web Backend", "Mobile App", "Graphic Design", "English for IT"];
    const provinces = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Nha Trang", "Cần Thơ", "Hải Phòng", "Vinh", "Huế", "Thanh Hóa", "Quảng Ninh", "Bình Dương"];

    // Tạo email từ tên thật: nguyenvana -> an.nguyen
    const cleanName = removeVietnameseTones(name).toLowerCase().split(' ');
    const emailPrefix = `${cleanName[cleanName.length-1]}.${cleanName[0]}`;

    return {
        id: id,
        name: name,
        major: getRandomItem(majors),
        dob: `${getRandomInt(1980, 1998)}-${String(getRandomInt(1, 12)).padStart(2,'0')}-${String(getRandomInt(1, 28)).padStart(2,'0')}`,
        phone: `0${getRandomItem(['3','5','7','8','9'])}${getRandomInt(10000000, 99999999)}`,
        email: `${emailPrefix}@letscode.edu.vn`,
        cccd: `0${getRandomInt(10, 99)}0${getRandomInt(80, 98)}${getRandomInt(100000, 999999)}`,
        hometown: getRandomItem(provinces),
        avatar: ""
    };
}

// Hàm tạo học viên
function generateStudent(id, status = "Đang học") {
    const gender = Math.random() > 0.55 ? 'Nam' : 'Nữ'; // Tỉ lệ nam nhiều hơn xíu
    const name = generateName(gender);
    const year = getRandomInt(2008, 2016);
    const wards = ["Vĩnh Hải", "Vĩnh Phước", "Lộc Thọ", "Phước Tân", "Phước Long", "Vĩnh Trường", "Diên Khánh", "Cam Lâm", "Ninh Hòa"];

    // Tạo email học viên
    const cleanName = removeVietnameseTones(name).toLowerCase().split(' ');
    const email = `${cleanName[cleanName.length-1]}.${cleanName[0]}${year}@gmail.com`;

    return {
        id: id,
        name: name,
        dob: `${year}-${String(getRandomInt(1, 12)).padStart(2,'0')}-${String(getRandomInt(1, 28)).padStart(2,'0')}`,
        gender: gender,
        phone: `0${getRandomItem(['3','9'])}${getRandomInt(10000000, 99999999)}`, // SĐT phụ huynh
        email: email,
        address: `${getRandomItem(wards)}, Khánh Hòa`,
        dateAdded: `2024-0${getRandomInt(1, 9)}-${getRandomInt(10, 28)}`,
        status: status,
        avatar: ""
    };
}

// --- SINH DỮ LIỆU MẪU ---
const teachers = [];
// Tạo 30 giáo viên với tên thật
for(let i=1; i<=30; i++) teachers.push(generateTeacher(i));

const classes = [];
const classTypes = [
    { code: "SCR", name: "Lập trình Scratch", max: 15 },
    { code: "ROBO", name: "Lắp ráp Robotics", max: 10 },
    { code: "PY", name: "Python Cơ bản", max: 20 },
    { code: "WEB", name: "Thiết kế Web", max: 20 },
    { code: "APP", name: "Lập trình App", max: 15 },
    { code: "DES", name: "Đồ họa Digital", max: 15 },
    { code: "ENG", name: "Tiếng Anh CN", max: 25 }
];

let studentIdCounter = 1000;

for(let i=0; i<30; i++) {
    const type = classTypes[i % classTypes.length];
    const classId = `${type.code}_${String(Math.floor(i/classTypes.length)+1).padStart(2,'0')}`;
    let status = 'recruiting';
    let isLocked = false;
    let studentCount = getRandomInt(0, 5);

    if (i < 10) { 
        status = 'finished'; isLocked = false; studentCount = type.max; // Lớp cũ đã xong thì đầy
    } else if (i < 22) { 
        status = 'active'; isLocked = true; studentCount = getRandomInt(type.max - 5, type.max); // Lớp đang học
    }

    const clsStudents = [];
    for(let k=0; k<studentCount; k++) {
        studentIdCounter++;
        clsStudents.push(generateStudent(`HS${studentIdCounter}`, "Đang học"));
    }

    classes.push({
        id: classId,
        name: `${type.name} - Khóa ${Math.floor(i/classTypes.length)+1}`,
        teacherId: teachers[i % teachers.length].id,
        maxStudents: type.max,
        status: status,
        isLocked: isLocked,
        students: clsStudents
    });
}

const unassignedStudents = [];
for(let i=0; i<50; i++) {
    studentIdCounter++;
    unassignedStudents.push(generateStudent(`HS${studentIdCounter}`, undefined)); // Mã HS tiếp tục tăng
}

// Thêm một học viên cụ thể để test (Tên thật)
if (classes.length > 0 && classes[0].status === 'finished') {
    classes[0].students[0].id = "HS1001";
    classes[0].students[0].name = "Nguyễn Minh Đức"; // Đã sửa tên test
}

const initialData = { teachers, classes, unassignedStudents, scores: {} };

// --- LOGIC APP ---
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

function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

document.addEventListener('DOMContentLoaded', () => {
    loadDB();
    if(document.getElementById('classList')) renderClassList();
});

function getTeacherName(id) {
    if(!id) return "Chưa phân công";
    const t = db.teachers.find(t => t.id === id);
    return t ? t.name : "Không xác định";
}

// --- LOGIC MỚI: LẤY DANH SÁCH HỌC VIÊN CÓ THỂ THÊM VÀO LỚP ---
function getAvailableStudents() {
    let available = [...db.unassignedStudents];
    const busyIds = new Set();

    db.classes.forEach(c => {
        if (c.status !== 'finished') {
            c.students.forEach(s => busyIds.add(s.id));
        }
    });

    db.classes.forEach(c => {
        if (c.status === 'finished') {
            c.students.forEach(s => {
                if (!busyIds.has(s.id) && !available.some(a => a.id === s.id)) {
                    available.push({...s}); 
                }
            });
        }
    });
    
    return available;
}

// --- RENDER CLASS LIST ---
function renderClassList() {
    const container = document.getElementById('classList');
    if(!container) return;
    container.innerHTML = '';

    db.classes.forEach(cls => {
        const isFull = cls.students.length >= cls.maxStudents;
        let statusBadge = '', statusText = '', badgeColor = '';

        if (cls.status === 'finished') {
            statusText = 'Đã hoàn thành'; badgeColor = 'text-secondary';
            statusBadge = '<i class="bi bi-check-circle-fill text-secondary me-2"></i>';
        } else if (cls.status === 'active') {
            statusText = 'Đang học'; badgeColor = 'text-warning';
            statusBadge = '<i class="bi bi-lock-fill text-warning me-2"></i>';
        } else {
            statusText = isFull ? 'Đã đủ' : 'Đang tuyển'; badgeColor = isFull ? 'text-info' : 'text-success';
            statusBadge = '<i class="bi bi-unlock-fill text-success me-2"></i>';
        }

        const div = document.createElement('div');
        div.className = `class-item ${currentClassId === cls.id ? 'active' : ''}`;
        div.onclick = () => handleSelectClass(cls.id);
        div.innerHTML = `
            <div><span class="class-code">${statusBadge}${cls.id}</span><span class="class-info">${cls.name}</span></div>
            <div class="text-end"><div class="fw-bold text-white small">${cls.students.length}/${cls.maxStudents}</div><small class="${badgeColor}" style="font-size: 0.75rem;">${statusText}</small></div>
        `;
        container.appendChild(div);
    });
}

function handleSelectClass(classId) {
    currentClassId = classId;
    renderClassList(); 
    const cls = db.classes.find(c => c.id === classId);
    if (!cls) return;

    const empty = document.getElementById('emptyState');
    if(empty) { empty.classList.remove('d-flex'); empty.classList.add('d-none'); empty.style.display = 'none'; }
    
    const detail = document.getElementById('classDetailSection');
    if(detail) { detail.classList.remove('d-none'); detail.style.display = 'block'; }

    document.getElementById('detailClassCode').innerText = cls.id;
    document.getElementById('detailClassName').innerText = cls.name;
    document.getElementById('detailTeacher').innerText = getTeacherName(cls.teacherId);
    
    updateClassStatusControls(cls);
    document.getElementById('detailCapacity').innerText = `${cls.students.length}/${cls.maxStudents}`;
    renderStudentTable(cls);
}

function renderStudentTable(cls) {
    const tbody = document.getElementById('detailStudentList');
    tbody.innerHTML = '';
    if(cls.students.length === 0) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Lớp trống.</td></tr>';
    else {
        cls.students.forEach(s => {
            const dob = s.dob && s.dob.includes('-') ? s.dob.split('-').reverse().join('/') : s.dob;
            const delBtn = cls.status === 'finished' ? '' : `<button class="btn btn-icon btn-outline-danger btn-sm" onclick="handleRemoveStudent('${s.id}', '${s.name}')"><i class="bi bi-trash"></i></button>`;
            tbody.innerHTML += `<tr><td><span class="font-monospace text-white-50">${s.id}</span></td><td class="fw-bold text-white">${s.name}</td><td>${dob}</td><td><span class="badge bg-success-subtle text-success border border-success-subtle">${s.status}</span></td><td class="text-end">${delBtn}</td></tr>`;
        });
    }
}

function updateClassStatusControls(cls) {
    const btnLock = document.getElementById('btnLockClass');
    if (!btnLock) return;
    const newBtn = btnLock.cloneNode(true);
    btnLock.parentNode.replaceChild(newBtn, btnLock);

    if (cls.status === 'finished') {
        newBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i>'; newBtn.className = 'btn btn-sm btn-icon btn-secondary';
        newBtn.title = "Mở lại lớp học"; newBtn.onclick = () => handleChangeStatus('recruiting');
    } else if (cls.status === 'active') {
        newBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i>'; newBtn.className = 'btn btn-sm btn-icon btn-success';
        newBtn.title = "Hoàn thành khóa học"; newBtn.onclick = () => handleChangeStatus('finished');
    } else {
        newBtn.innerHTML = '<i class="bi bi-lock-fill"></i>'; newBtn.className = 'btn btn-sm btn-icon btn-warning';
        newBtn.title = "Khóa lớp & Bắt đầu học"; newBtn.onclick = () => handleChangeStatus('active');
    }
}

function handleChangeStatus(newStatus) {
    if (!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    if (newStatus === 'finished' && !confirm("Xác nhận HOÀN THÀNH khóa học?")) return;
    cls.status = newStatus;
    cls.isLocked = (newStatus === 'active');
    saveDB(); handleSelectClass(currentClassId); renderClassList();
    showToast("Trạng thái", newStatus === 'active' ? "Đã KHÓA lớp." : newStatus === 'finished' ? "Đã HOÀN THÀNH." : "Đã MỞ LẠI lớp.");
}

// --- CRUD & ADD STUDENT ---
function handleOpenAddClass() {
    document.getElementById('classFormTitle').innerText = "Tạo Lớp Học Mới";
    document.getElementById('isEditMode').value = "false";
    document.getElementById('inputClassId').value = ""; document.getElementById('inputClassId').disabled = false;
    document.getElementById('inputClassName').value = ""; document.getElementById('inputClassMax').value = "20";
    new bootstrap.Modal(document.getElementById('classFormModal')).show();
}
function handleOpenEditClass() {
    if (!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    document.getElementById('classFormTitle').innerText = "Chỉnh Sửa Thông Tin Lớp";
    document.getElementById('isEditMode').value = "true";
    document.getElementById('inputClassId').value = cls.id; document.getElementById('inputClassId').disabled = true;
    document.getElementById('inputClassName').value = cls.name; document.getElementById('inputClassMax').value = cls.maxStudents;
    new bootstrap.Modal(document.getElementById('classFormModal')).show();
}
function saveClass() {
    const isEdit = document.getElementById('isEditMode').value === "true";
    const id = document.getElementById('inputClassId').value.trim();
    const name = document.getElementById('inputClassName').value.trim();
    const max = parseInt(document.getElementById('inputClassMax').value);
    if (!id || !name || !max) { showToast("Lỗi", "Vui lòng nhập đủ thông tin.", "error"); return; }
    if (isEdit) {
        const cls = db.classes.find(c => c.id === currentClassId);
        cls.name = name; cls.maxStudents = max;
        saveDB(); handleSelectClass(currentClassId); showToast("Thành công", "Đã cập nhật.");
    } else {
        if (db.classes.some(c => c.id === id)) { showToast("Lỗi", "Mã lớp tồn tại!", "error"); return; }
        db.classes.push({ id, name, teacherId: null, maxStudents: max, status: 'recruiting', isLocked: false, students: [] });
        saveDB(); handleSelectClass(id); showToast("Thành công", `Đã tạo lớp ${id}.`);
    }
    renderClassList(); bootstrap.Modal.getInstance(document.getElementById('classFormModal')).hide();
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
        if (cls.students.length > 0) cls.students.forEach(s => db.unassignedStudents.push({ ...s }));
        db.classes.splice(clsIndex, 1);
        saveDB(); currentClassId = null;
        document.getElementById('classDetailSection').style.display = 'none';
        const empty = document.getElementById('emptyState');
        if(empty) { empty.classList.remove('d-none'); empty.style.display = 'flex'; }
        renderClassList(); showToast("Đã xóa", "Lớp học đã bị xóa.");
    }
    bootstrap.Modal.getInstance(document.getElementById('deleteClassModal')).hide();
}

function handleOpenAddStudent() {
    if (!currentClassId) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    if (cls.status === 'finished') { showToast("Lỗi", "Lớp đã hoàn thành.", "error"); return; }
    if (cls.students.length >= cls.maxStudents) { showToast('Lỗi', 'Lớp đã đủ sĩ số.', 'error'); return; }
    document.getElementById('modalTargetClass').innerText = cls.name;
    
    document.getElementById('modalSearchName').value = "";
    document.getElementById('modalSearchID').value = "";
    document.getElementById('modalSearchPhone').value = "";
    
    renderUnassignedStudentList();
    new bootstrap.Modal(document.getElementById('addStudentModal')).show();
}

function renderUnassignedStudentList() {
    const listContainer = document.getElementById('unassignedList');
    listContainer.innerHTML = '';
    document.getElementById('selectedCount').innerText = '0';

    const nameKw = document.getElementById('modalSearchName').value.trim().toLowerCase();
    const idKw = document.getElementById('modalSearchID').value.trim().toLowerCase();
    const phoneKw = document.getElementById('modalSearchPhone').value.trim().toLowerCase();

    const availableStudents = getAvailableStudents();

    const filteredList = availableStudents.filter(s => {
        const matchName = !nameKw || (s.name || '').toLowerCase().includes(nameKw);
        const matchID = !idKw || (s.id || '').toLowerCase().includes(idKw);
        const matchPhone = !phoneKw || (s.phone || '').includes(phoneKw);
        return matchName && matchID && matchPhone;
    });

    if (filteredList.length === 0) { listContainer.innerHTML = '<div class="text-center text-muted py-4">Không tìm thấy kết quả.</div>'; return; }

    filteredList.forEach(s => {
        const item = document.createElement('div');
        item.className = 'student-select-item';
        item.innerHTML = `
            <div class="form-check w-100 m-0">
                <input class="form-check-input me-3 student-checkbox" type="checkbox" value="${s.id}" id="chk_${s.id}">
                <label class="form-check-label w-100 cursor-pointer" for="chk_${s.id}">
                    <div class="fw-bold text-white">${s.name}</div>
                    <div class="d-flex justify-content-between small text-white-50">
                        <span>Mã: ${s.id} | ${s.gender}</span>
                        <span><i class="bi bi-telephone me-1"></i>${s.phone || '--'}</span>
                    </div>
                </label>
            </div>`;
        listContainer.appendChild(item);
    });
    document.querySelectorAll('.student-checkbox').forEach(chk => { chk.addEventListener('change', () => { document.getElementById('selectedCount').innerText = document.querySelectorAll('.student-checkbox:checked').length; }); });
}

function confirmAddStudents() {
    const checkboxes = document.querySelectorAll('.student-checkbox:checked');
    if (checkboxes.length === 0) return;
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const cls = db.classes.find(c => c.id === currentClassId);
    if (cls.students.length + selectedIds.length > cls.maxStudents) { showToast('Lỗi', 'Lớp không đủ chỗ.', 'error'); return; }

    let conflictStudents = [];
    selectedIds.forEach(sid => {
        const isBusy = db.classes.some(otherCls => otherCls.id !== cls.id && otherCls.status !== 'finished' && otherCls.students.some(s => s.id === sid));
        if (isBusy) conflictStudents.push(sid);
    });
    if (conflictStudents.length > 0) { showToast('Lỗi', `Học viên ${conflictStudents.join(', ')} đang học lớp khác chưa kết thúc.`, 'error'); return; }

    selectedIds.forEach(id => {
        const sIndex = db.unassignedStudents.findIndex(s => s.id === id);
        if (sIndex > -1) {
            const student = db.unassignedStudents[sIndex];
            cls.students.push({ ...student, status: 'Mới thêm' });
            db.unassignedStudents.splice(sIndex, 1);
        } else {
            const available = getAvailableStudents();
            const student = available.find(s => s.id === id);
            if(student) {
                cls.students.push({ ...student, status: 'Mới thêm' });
            }
        }
    });
    saveDB(); handleSelectClass(currentClassId); renderClassList();
    bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
    showToast('Thành công', `Đã thêm ${selectedIds.length} học viên.`);
}

function handleRemoveStudent(sid, sname) {
    studentToDelete = sid;
    document.getElementById('delStudentName').innerText = sname;
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
        saveDB(); showToast('Đã xóa', `Đã xóa học viên khỏi lớp.`);
    }
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
    handleSelectClass(currentClassId); renderClassList();
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
        item.innerHTML = `<input class="form-check-input teacher-radio me-3" type="radio" name="teacherRadio" value="${t.id}" id="radio_${t.id}" ${isSelected}><label class="cursor-pointer flex-grow-1" for="radio_${t.id}"><div class="fw-bold text-white">${t.name}</div><div class="small text-white-50">${t.major}</div></label>`;
        container.appendChild(item);
    });
    new bootstrap.Modal(document.getElementById('changeTeacherModal')).show();
}
function confirmChangeTeacher() {
    const selectedRadio = document.querySelector('input[name="teacherRadio"]:checked');
    if(!selectedRadio) return;
    const cls = db.classes.find(c => c.id === currentClassId);
    cls.teacherId = selectedRadio.value;
    saveDB(); document.getElementById('detailTeacher').innerText = getTeacherName(cls.teacherId);
    bootstrap.Modal.getInstance(document.getElementById('changeTeacherModal')).hide();
    showToast('Thành công', "Đã đổi giáo viên.");
}
function removeTeacherFromClass() {
    const cls = db.classes.find(c => c.id === currentClassId);
    cls.teacherId = null;
    saveDB(); document.getElementById('detailTeacher').innerText = "Chưa phân công";
    bootstrap.Modal.getInstance(document.getElementById('changeTeacherModal')).hide();
    showToast('Cảnh báo', "Đã gỡ giáo viên.", 'error');
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