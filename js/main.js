// JS lấy ngày hiện tại định dạng đẹp
const date = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long' };
// Giả lập tiếng Việt cho đẹp vì toLocaleString đôi khi hiển thị khác nhau tùy trình duyệt
const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const dayName = days[date.getDay()];
const day = date.getDate();
const month = date.getMonth() + 1;
document.getElementById('currentDate').innerText = `${dayName}, ${day} tháng ${month}`;
