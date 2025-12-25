const date = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long' };
const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const dayName = days[date.getDay()];
const day = date.getDate();
const month = date.getMonth() + 1;
document.getElementById('currentDate').innerText = `${dayName}, ${day} tháng ${month}`;

// --- TÍNH NĂNG RESET DỮ LIỆU ---
function resetData() {
    if (confirm("CẢNH BÁO: Hành động này sẽ xóa toàn bộ dữ liệu bạn đã nhập (Học viên, Giáo viên, Lớp học...) và khôi phục về dữ liệu mẫu ban đầu.\n\nBạn có chắc chắn không?")) {
        // Xóa key dữ liệu trong LocalStorage
        localStorage.removeItem('LETSCODE_DB'); 
        // Tải lại trang để xác nhận
        location.reload();
        alert("Đã khôi phục dữ liệu gốc thành công!");
    }
}