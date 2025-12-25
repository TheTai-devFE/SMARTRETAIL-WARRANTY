# Hệ Thống Tra Cứu Bảo Hành (Product Warranty Lookup System)

Ứng dụng quản lý và tra cứu bảo hành sản phẩm dành cho doanh nghiệp và khách hàng lẻ.

## 🛠 Công nghệ sử dụng
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React (Vite), TailwindCSS, Framer Motion
- **Icons:** Lucide React

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Chuẩn bị
- Đảm bảo đã cài đặt **Node.js** và **MongoDB** local.

### 2. Chạy Backend
```bash
cd backend
npm install
# Tạo dữ liệu mẫu (Chỉ cần chạy 1 lần)
npm run seed
# Chạy server ở chế độ phát triển
npm run dev
```
*Backend sẽ chạy tại: http://localhost:5001*

### 3. Chạy Frontend
Mở một cửa sổ Terminal mới:
```bash
cd frontend
npm install
npm run dev
```
*Frontend sẽ chạy tại: http://localhost:5173*

## 📖 Tính năng chính
1. **Tra cứu khách hàng (Trang chủ):**
   - Tra cứu nhanh bằng Số Serial + (SĐT hoặc MST).
   - Xem danh sách tất cả sản phẩm của một khách hàng/công ty.
   - Hiển thị trạng thái màu sắc: Xanh (Còn hạn), Đỏ (Hết hạn).
   - Hiển thị số ngày bảo hành còn lại.

2. **Quản trị hệ thống (/admin):**
   - Quản lý danh sách bảo hành (CRUD).
   - Tìm kiếm, lọc bản ghi theo nhiều tiêu chí.
   - Thêm mới/Chỉnh sửa thông tin bảo hành dễ dàng.

## 💾 Dữ liệu mẫu (Seed Data)
Sau khi chạy `npm run seed`, bạn có thể test trang chủ với:
- **Số Serial:** `SN-APPLE-2024-001` + **MST:** `0102030405`
- **Số Serial:** `SN-LOGI-888` + **SĐT:** `0912345678` (Bản ghi này đã hết hạn)
- Hoặc nhập **SĐT:** `0987654321` trong tab "Tất cả sản phẩm" để xem danh sách của SmartRetail.

## 📂 Cấu trúc thư mục
- `backend/`: Server Express, Models, Routes.
- `frontend/`: Ứng dụng React, TailwindCSS, Components.
