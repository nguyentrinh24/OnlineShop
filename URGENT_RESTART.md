# 🔥 KHẨN CẤP: Restart Backend

## Vấn đề hiện tại
- Tất cả API đều trả về 403 Forbidden
- Cấu hình security đã được sửa nhưng chưa được áp dụng
- Backend cần được restart hoàn toàn

## Giải pháp ngay lập tức

### Bước 1: Dừng Backend hiện tại
```bash
# Tìm process đang chạy trên port 8088
netstat -ano | findstr :8088

# Kill tất cả process trên port 8088
taskkill /F /PID <PID>
```

### Bước 2: Clean và Rebuild
```bash
cd ../Online-shoppBE
./mvnw clean
./mvnw compile
```

### Bước 3: Start Backend mới
```bash
./mvnw spring-boot:run
```

### Bước 4: Đợi và Test
1. Đợi backend khởi động hoàn tất (30-60 giây)
2. Chạy test: `node test-apis.js`
3. Tất cả API phải trả về 200 OK

## Nếu vẫn lỗi

### Kiểm tra logs
```bash
# Xem logs backend
tail -f logs/application.log
```

### Kiểm tra database
```bash
# Đảm bảo MySQL đang chạy
mysql -u root -p
```

### Restart IDE
- Đóng và mở lại IDE
- Clean project
- Rebuild

## Cấu hình đã sửa
- ✅ `/healthcheck` - permitAll()
- ✅ `/categories` - permitAll()
- ✅ `/products` - permitAll()
- ✅ `/products/featured` - permitAll()
- ✅ `/products/images/*` - permitAll()

## Kết quả mong đợi
- Frontend load được categories và products
- Không còn lỗi 403
- User có thể browse mà không cần đăng nhập 