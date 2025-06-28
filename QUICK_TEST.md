# Hướng dẫn Test Nhanh Lỗi 403

## Bước 1: Khởi động Backend
```bash
cd ../Online-shoppBE
./mvnw spring-boot:run
```

## Bước 2: Khởi động Frontend
```bash
npm start
```

## Bước 3: Đăng nhập
1. Mở http://localhost:4200
2. Đăng nhập với tài khoản có sẵn
3. Mở DevTools (F12) > Console
4. Xem log debug token

## Bước 4: Kiểm tra
- Console sẽ hiển thị thông tin token và kết quả test API
- Nếu vẫn lỗi 403, kiểm tra:
  - Token có tồn tại không
  - Backend có chạy không
  - Database có dữ liệu không

## Bước 5: Nếu vẫn lỗi
1. Đăng xuất và đăng nhập lại
2. Kiểm tra backend logs
3. Test API trực tiếp với Postman

## Thông tin Debug
- Token được lưu với key: `access-token`
- User được lưu với key: `user`
- Tất cả API calls giờ đều có Authorization header 