/* BÀI B — VIẾT CODE: Giỏ hàng của xưởng in
   Hoàn thiện class GioHang và hàm napGioHang.
   Không đổi tên class, tên phương thức, tên hàm; không sửa phần "DỮ LIỆU ĐÃ CHO". */

// ---------- DỮ LIỆU ĐÃ CHO (không sửa) ----------
const DANH_MUC = [
	{ id: "TC01", ten: "Thiệp cưới cotton", loai: "thiep cuoi", gia: 1500 },
	{ id: "TC02", ten: "Thiệp cưới kraft", loai: "thiep cuoi", gia: 900 },
	{ id: "DT01", ten: "Danh thiếp ép kim", loai: "danh thiep", gia: 1200 },
	{ id: "PB01", ten: "Phong bì lót lụa", loai: "phu kien", gia: 500 }
];

// ---------- PHẦN BẠN VIẾT ----------
class GioHang {
	constructor() {
		// Mỗi dòng của giỏ là một object { id, ten, loai, gia, soLuong }.
		this.dsDong = [];
	}

	// 1. Thêm sản phẩm; trả về true nếu thêm được, false nếu soLuong không hợp lệ.
	them(sanPham, soLuong) {
		// Kiểm tra tính hợp lệ của soLuong:
		// Must be number, không được là NaN, phải là số nguyên dương (> 0).
		if (
			typeof soLuong !== "number" ||
			Number.isNaN(soLuong) ||
			!Number.isInteger(soLuong) ||
			soLuong <= 0
		) {
			return false;
		}

		// Tìm xem sản phẩm đã có trong giỏ chưa
		const dongHienTai = this.dsDong.find(dong => dong.id === sanPham.id);

		if (dongHienTai) {
			// Đã tồn tại -> cộng dồn số lượng
			dongHienTai.soLuong += soLuong;
		} else {
			// Chưa tồn tại -> TẠO BẢN SAO ĐỘC LẬP (Clone) từ object sanPham
			// Đảm bảo không lưu trực tiếp tham chiếu của sanPham bên ngoài/DANH_MUC
			// và không gắn thêm/thay đổi thuộc tính của object gốc.
			this.dsDong.push({
				id: sanPham.id,
				ten: sanPham.ten,
				loai: sanPham.loai,
				gia: sanPham.gia,
				soLuong: soLuong
			});
		}

		return true;
	}

	// 2. Xoá dòng có id tương ứng; trả về true nếu có xoá, false nếu không tìm thấy.
	xoa(id) {
		const viTri = this.dsDong.findIndex(dong => dong.id === id);
		if (viTri !== -1) {
			this.dsDong.splice(viTri, 1);
			return true;
		}
		return false;
	}

	// 3. Tổng tiền cả giỏ.
	tongTien() {
		return this.dsDong.reduce((sum, dong) => sum + dong.gia * dong.soLuong, 0);
	}

	// 4. Object thống kê: { "<loai>": tổng tiền của loại đó, ... }.
	thongKeTheoLoai() {
		const result = {};
		for (const dong of this.dsDong) {
			const thànhTien = dong.gia * dong.soLuong;
			result[dong.loai] = (result[dong.loai] || 0) + thànhTien;
		}
		return result;
	}

	// 5. Dòng có thành tiền lớn nhất (bản sao, có thêm thanhTien); null nếu giỏ rỗng.
	dongDatNhat() {
		if (this.dsDong.length === 0) {
			return null;
		}

		// Tìm dòng có thành tiền (gia * soLuong) lớn nhất.
		// Nếu bằng nhau, giữ lại dòng đứng trước (sử dụng so sánh >).
		let datNhat = this.dsDong[0];
		let maxThanhTien = datNhat.gia * datNhat.soLuong;

		for (let i = 1; i < this.dsDong.length; i++) {
			const tt = this.dsDong[i].gia * this.dsDong[i].soLuong;
			if (tt > maxThanhTien) {
				maxThanhTien = tt;
				datNhat = this.dsDong[i];
			}
		}

		// BẢO VỆ DỮ LIỆU (Cloning):
		// Trả về BẢN SAO của object dòng đắt nhất, bổ sung thuộc tính thanhTien.
		// Thao tác sửa thuộc tính trên kết quả trả về sẽ không làm biến đổi dữ liệu bên trong giỏ.
		return {
			id: datNhat.id,
			ten: datNhat.ten,
			loai: datNhat.loai,
			gia: datNhat.gia,
			soLuong: datNhat.soLuong,
			thanhTien: maxThanhTien
		};
	}

	// 6. Mảng BẢN SAO các dòng, mỗi dòng có thêm thuộc tính thanhTien.
	layDanhSach() {
		// BẢO VỆ DỮ LIỆU (Cloning):
		// Sử dụng map() để tạo MẢNG MỚI chứa các OBJECT MỚI.
		// Đảm bảo việc sửa/xóa phần tử trong mảng trả về không làm thay đổi this.dsDong.
		return this.dsDong.map(dong => ({
			id: dong.id,
			ten: dong.ten,
			loai: dong.loai,
			gia: dong.gia,
			soLuong: dong.soLuong,
			thanhTien: dong.gia * dong.soLuong
		}));
	}

	// 7. Chuỗi JSON của mảng các dòng.
	xuatJSON() {
		// Tạo mảng bản sao chỉ gồm ĐÚNG 5 thuộc tính: id, ten, loai, gia, soLuong
		// (không chứa thuộc tính bổ trợ thanhTien)
		const cleanDs = this.dsDong.map(dong => ({
			id: dong.id,
			ten: dong.ten,
			loai: dong.loai,
			gia: dong.gia,
			soLuong: dong.soLuong
		}));
		return JSON.stringify(cleanDs);
	}
}

// 8. Tạo lại một GioHang từ chuỗi JSON do xuatJSON() sinh ra.
function napGioHang(chuoiJSON) {
	const gioMoi = new GioHang();
	try {
		const mangDong = JSON.parse(chuoiJSON);
		if (Array.isArray(mangDong)) {
			for (const item of mangDong) {
				// Nạp từng sản phẩm vào giỏ mới qua phương thức them()
				gioMoi.them(
					{ id: item.id, ten: item.ten, loai: item.loai, gia: item.gia },
					item.soLuong
				);
			}
		}
	} catch (e) {
		console.error("Lỗi khi nạp chuỗi JSON giỏ hàng:", e);
	}
	return gioMoi;
}

// ---------- CHẠY THỬ (không sửa) ----------
const gio = new GioHang();
gio.them(DANH_MUC[0], 100);
gio.them(DANH_MUC[3], 200);
gio.them(DANH_MUC[0], 50);
veGioHang(gio.layDanhSach(), gio.tongTien());
console.table(gio.layDanhSach());
hienThi(`JSON gửi lên máy chủ: ${gio.xuatJSON()}`);