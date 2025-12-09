const mockData = {
      "10A1": [{ id: "HS101", name: "Nguyễn Thế Anh", oldScore: 9.0, newScore: 9.5 }, { id: "HS102", name: "Trần Minh Quang", oldScore: 8.8, newScore: 9.0 }, { id: "HS103", name: "Lê Thu Thảo", oldScore: 9.2, newScore: 9.2 }, { id: "HS104", name: "Phạm Hồng Ngọc", oldScore: 9.5, newScore: 9.8 }, { id: "HS105", name: "Đinh Văn Lâm", oldScore: 8.5, newScore: 8.0 }, { id: "HS106", name: "Vũ Mai Phương", oldScore: 8.0, newScore: 8.5 }],
      "10A2": [{ id: "HS201", name: "Vũ Tuấn Kiệt", oldScore: 6.5, newScore: 7.5 }, { id: "HS202", name: "Hoàng Văn Thái", oldScore: 7.0, newScore: 6.5 }, { id: "HS203", name: "Ngô Lan Anh", oldScore: 5.5, newScore: 5.5 }, { id: "HS204", name: "Bùi Thị Mai", oldScore: 6.0, newScore: 8.0 }, { id: "HS205", name: "Đặng Hùng Dũng", oldScore: 4.0, newScore: 3.5 }],
      "11B1": [{ id: "HS301", name: "Nguyễn Thị Mơ", oldScore: 8.0, newScore: 8.5 }, { id: "HS302", name: "Trần Bảo Ngọc", oldScore: 7.5, newScore: 7.2 }, { id: "HS303", name: "Lý Văn Sâm", oldScore: 6.0, newScore: 6.8 }],
      "12C1": [{ id: "HS401", name: "Phan Văn Đức", oldScore: 8.0, newScore: 7.0 }, { id: "HS402", name: "Trương Thị Hằng", oldScore: 7.5, newScore: 6.5 }],
      "JAVA_BASIC": [{ id: "JV001", name: "Trần Văn Code", oldScore: 5.0, newScore: 8.0 }, { id: "JV002", name: "Nguyễn Thị Bug", oldScore: 7.0, newScore: 6.5 }]
    };

    let currentHonoredList = [];
    let currentContactList = [];

    function showToast(title, message, type = 'success') {
      const toastEl = document.getElementById('liveToast');
      document.getElementById('toastTitle').innerText = title;
      document.getElementById('toastMessage').innerText = message;

      toastEl.className = 'toast toast-glass align-items-center hide'; // Reset class
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
      new bootstrap.Toast(toastEl, { delay: 3000 }).show();
    }

    // --- NEW: Helper function tạo HTML cho chỉ số tăng/giảm ---
    function getTrendHTML(diff) {
      if (diff > 0) return `<span class="fw-bold text-success"><i class="fas fa-arrow-up me-1"></i>+${diff}</span>`;
      if (diff < 0) return `<span class="fw-bold text-danger"><i class="fas fa-arrow-down me-1"></i>${diff}</span>`;
      return `<span class="fw-bold text-muted"><i class="fas fa-minus me-1"></i>0.0</span>`;
    }

    function generateReport() {
      const classId = document.getElementById('classSelect').value;
      const monthId = document.getElementById('monthSelect').value;
      const reportArea = document.getElementById('reportArea');
      reportArea.style.display = 'none';

      if (!classId) { showToast("Lỗi", "Vui lòng chọn lớp học!", "error"); return; }
      if (monthId === 'NODATA') { showToast("Lỗi", "Không tìm thấy dữ liệu.", "error"); return; }

      const students = mockData[classId] || [];

      // Tính toán diff và sort
      const computedStudents = students.map(s => {
        const diff = (s.newScore - s.oldScore).toFixed(1);
        return { ...s, diff: diff, className: classId };
      });

      // Tách danh sách
      const progressList = computedStudents.filter(s => s.diff > 0).sort((a, b) => b.diff - a.diff);
      const warningList = computedStudents.filter(s => s.diff <= 0).sort((a, b) => a.diff - b.diff); // Sắp xếp giảm nhiều nhất lên đầu

      // --- TÌM ỨNG CỬ VIÊN (Người có diff cao nhất) ---
      if (progressList.length > 0) {
        const topStudent = progressList[0];
        document.getElementById('topCandidateSection').style.display = 'block';
        document.getElementById('candidateClass').innerText = classId;
        document.getElementById('candidateName').innerText = topStudent.name;
        document.getElementById('candidateDiff').innerHTML = `+${topStudent.diff}`;
      } else {
        document.getElementById('topCandidateSection').style.display = 'none';
      }

      // Render UI
      document.getElementById('totalCount').innerText = students.length;
      updateHonoredCountUI();
      updateContactCountUI();
      renderProgressTable(progressList);
      renderWarningTable(warningList);

      reportArea.style.display = 'block';
      reportArea.scrollIntoView({ behavior: 'smooth' });
      showToast("Hoàn tất", `Đã tải báo cáo lớp ${classId}`);
    }

    function renderProgressTable(list) {
      const tbody = document.getElementById('progressTable');
      tbody.innerHTML = '';
      list.forEach(s => {
        const isHonored = currentHonoredList.some(h => h.id === s.id);
        const btnHtml = isHonored
          ? `<button class="btn btn-sm btn-secondary" disabled><i class="fas fa-check me-1"></i>Đã thêm</button>`
          : `<button class="btn btn-sm btn-outline-success" onclick="addToBestOfMonth('${s.id}', '${s.name}', '${s.className}', '${s.newScore}')"><i class="fas fa-star me-1"></i>Vinh danh</button>`;

        // Sử dụng hàm getTrendHTML để hiển thị màu
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

        // Sử dụng hàm getTrendHTML để hiển thị màu (Sẽ tự động đỏ nếu âm)
        tbody.innerHTML += `<tr><td><div class="student-name">${s.name}</div><small class="text-secondary">Điểm: ${s.newScore}</small></td><td>${getTrendHTML(s.diff)}</td><td>${btnHtml}</td></tr>`;
      });
      if (list.length === 0) tbody.innerHTML = '<tr><td colspan="3" class="text-center text-success">Không có cảnh báo!</td></tr>';
    }

    // Logic cũ (Add/Update/Show Modal) giữ nguyên
    function addToBestOfMonth(id, name, className, score) {
      currentHonoredList.push({ id, name, className, score });
      generateReport(); // Re-render để cập nhật nút
      showToast("Đã thêm", `Vinh danh học viên ${name}`);
    }
    function addToContactList(id, name, className, diff) {
      currentContactList.push({ id, name, className, diff });
      generateReport(); // Re-render để cập nhật nút
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