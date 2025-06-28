# Hướng dẫn Debug Lỗi 403 Forbidden

## Vấn đề
Các API như `/categories`, `/products/featured`, `/orders/latest` trả về lỗi 403 Forbidden.

## Nguyên nhân có thể
1. **Thiếu Authorization header**: Token không được gửi trong request
2. **Token hết hạn hoặc không hợp lệ**
3. **Cấu hình security backend chưa đúng**
4. **User chưa đăng nhập**

## Cách Debug

### 1. Kiểm tra Token trong Browser
1. Mở DevTools (F12)
2. Vào tab Application > Local Storage
3. Kiểm tra có key `access-token` không
4. Copy token và decode tại https://jwt.io để xem có hợp lệ không

### 2. Kiểm tra Request Headers
1. Mở DevTools > Network tab
2. Refresh trang
3. Tìm request tới `/categories` hoặc `/products/featured`
4. Kiểm tra Request Headers có `Authorization: Bearer <token>` không

### 3. Test Backend
1. Đảm bảo backend đang chạy trên port 8088
2. Test API bằng Postman hoặc curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8088/api/v1/categories
```

### 4. Đăng nhập lại
1. Đăng xuất khỏi ứng dụng
2. Đăng nhập lại để lấy token mới
3. Kiểm tra lại

## Các thay đổi đã thực hiện

### Frontend
- ✅ Cập nhật `HttpUtilService` để tự động thêm Authorization header
- ✅ Cập nhật `ProductService` để sử dụng HttpUtilService
- ✅ Cập nhật `CategoryService` để sử dụng HttpUtilService
- ✅ Cập nhật `CouponService` để sử dụng HttpUtilService
- ✅ Thêm debug log trong HomeComponent

### Backend
- ✅ Sửa cấu hình security để tránh xung đột
- ✅ Thêm cấu hình cho banners endpoint
- ✅ Đảm bảo products và categories yêu cầu USER/ADMIN role

## Bước tiếp theo
1. Khởi động lại backend
2. Đăng nhập lại vào frontend
3. Kiểm tra console log để xem token
4. Kiểm tra Network tab để xem headers

## Nếu vẫn lỗi
1. Kiểm tra backend logs
2. Đảm bảo database có dữ liệu user
3. Test API trực tiếp với Postman
4. Kiểm tra JWT secret key trong backend 