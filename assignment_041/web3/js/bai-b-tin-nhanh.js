/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

// Truy vấn các phần tử DOM cần thiết
const listTin = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const oTimKiem = document.getElementById("o-tim-kiem");
const khongThay = document.getElementById("khong-thay");
const nutDang = document.getElementById("nut-dang");
const tinTieuDe = document.getElementById("tin-tieu-de");
const tinNoiDung = document.getElementById("tin-noi-dung");
const baoLoi = document.getElementById("bao-loi");

/**
 * F1. Bộ đếm: Cập nhật nội dung thẻ #bo-dem "Đang hiển thị x/y tin"
 * - y: Tổng số tin (số thẻ <li> con trực tiếp của #list).
 * - x: Số tin đang hiển thị (các thẻ <li> không có lớp 'an').
 */
function capNhatBoDem() {
	if (!listTin || !boDem) return;
	const tatCaTin = listTin.querySelectorAll("li");
	const tongSo = tatCaTin.length;
	let soHienThi = 0;

	tatCaTin.forEach((tin) => {
		if (!tin.classList.contains("an")) {
			soHienThi++;
		}
	});

	boDem.textContent = `Đang hiển thị ${soHienThi}/${tongSo} tin`;
}

/**
 * F2 + F3. Lọc tin thời gian thực khi gõ vào #o-tim-kiem và hiển thị thông báo #khong-thay
 */
function locTin() {
	if (!oTimKiem || !listTin) return;

	const tuKhoa = oTimKiem.value.trim().toLowerCase();
	const dsTin = listTin.querySelectorAll("li");
	let soTinKhop = 0;

	dsTin.forEach((tin) => {
		const h3Text = (tin.querySelector("h3")?.textContent || "").toLowerCase();
		const pText = (tin.querySelector("p")?.textContent || "").toLowerCase();

		// So khớp từ khóa không phân biệt hoa/thường trong tiêu đề (h3) hoặc nội dung (p)
		if (tuKhoa === "" || h3Text.includes(tuKhoa) || pText.includes(tuKhoa)) {
			tin.classList.remove("an");
			soTinKhop++;
		} else {
			tin.classList.add("an");
		}
	});

	// F3. Xử lý thông báo không tìm thấy
	if (khongThay) {
		if (soTinKhop === 0 && dsTin.length > 0) {
			khongThay.classList.remove("an");
			// Sử dụng textContent để chống lỗ hổng XSS khi hiển thị từ khóa người dùng nhập
			khongThay.textContent = `Không tìm thấy tin nào cho "${oTimKiem.value}"`;
		} else {
			khongThay.classList.add("an");
		}
	}

	// Cập nhật lại bộ đếm sau mỗi lần lọc
	capNhatBoDem();
}

// Bắt sự kiện keyup trên ô tìm kiếm
if (oTimKiem) {
	oTimKiem.addEventListener("keyup", locTin);
}

/**
 * F4. Event Delegation cho nút "Read more >>" / "Thu gọn <<"
 * Chỉ đăng ký 1 sự kiện click duy nhất trên danh sách cha #list
 */
if (listTin) {
	listTin.addEventListener("click", (e) => {
		// Kiểm tra nếu phần tử được bấm chứa lớp "more"
		if (e.target && e.target.classList.contains("more")) {
			const nutMore = e.target;
			// Tìm thẻ <p> nằm cùng trong thẻ <li> tương ứng
			const liToChua = nutMore.closest("li");
			if (!liToChua) return;

			const theP = liToChua.querySelector("p");
			if (theP) {
				// Bật/tắt lớp "day-du" trên thẻ <p>
				const isFull = theP.classList.toggle("day-du");
				// Đổi chữ nút tương ứng
				nutMore.textContent = isFull ? "Thu gọn <<" : "Read more >>";
			}
		}
	});
}

/**
 * F5. Đăng tin nhanh khi click nút #nut-dang
 */
if (nutDang) {
	nutDang.addEventListener("click", () => {
		const tieuDeText = tinTieuDe ? tinTieuDe.value.trim() : "";
		const noiDungText = tinNoiDung ? tinNoiDung.value.trim() : "";

		// Kiểm tra nhập liệu
		if (tieuDeText === "" || noiDungText === "") {
			if (baoLoi) {
				baoLoi.classList.remove("an");
				baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
			}
			return;
		}

		// Nhập hợp lệ: Ẩn thông báo lỗi
		if (baoLoi) {
			baoLoi.classList.add("an");
			baoLoi.textContent = "";
		}

		// Tạo cấu trúc thẻ <li> mới
		const liMoi = document.createElement("li");

		// Thẻ thời gian <span class="time">
		const spanTime = document.createElement("span");
		spanTime.className = "time";
		// Hàm homNay() đã được cung cấp sẵn từ hệ thống
		spanTime.textContent = typeof homNay === "function" ? homNay() : "";

		// Thẻ tiêu đề <h3> (Dùng textContent chống XSS)
		const h3Moi = document.createElement("h3");
		h3Moi.textContent = tieuDeText;

		// Thẻ nội dung <p> (Dùng textContent chống XSS)
		const pMoi = document.createElement("p");
		pMoi.textContent = noiDungText;

		// Thẻ nút đọc thêm <button type="button" class="more">
		const btnMore = document.createElement("button");
		btnMore.type = "button";
		btnMore.className = "more";
		btnMore.textContent = "Read more >>";

		// Ghép các thẻ con vào <li>
		liMoi.append(spanTime, h3Moi, pMoi, btnMore);

		// Chèn vào ĐẦU danh sách #list
		listTin.prepend(liMoi);

		// Xóa trắng 2 ô nhập dữ liệu
		if (tinTieuDe) tinTieuDe.value = "";
		if (tinNoiDung) tinNoiDung.value = "";

		// Áp dụng ngay bộ lọc tìm kiếm hiện tại cho tin mới đăng
		locTin();
	});
}

// Chạy khởi tạo bộ đếm F1 lần đầu tiên ngay khi tải xong file script
capNhatBoDem();