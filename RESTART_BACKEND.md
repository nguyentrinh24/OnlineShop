# Hướng dẫn Restart Backend

## Vấn đề
Sau khi thay đổi cấu hình security, backend cần được restart để áp dụng thay đổi.

## Bước 1: Dừng Backend
Nếu backend đang chạy, nhấn `Ctrl + C` để dừng.

## Bước 2: Restart Backend
```bash
cd ../Online-shoppBE
./mvnw spring-boot:run
```

## Bước 3: Kiểm tra
1. Đợi backend khởi động hoàn tất (thường mất 30-60 giây)
2. Mở browser và truy cập: http://localhost:8088/api/v1/healthcheck
3. Nếu trả về response, backend đã sẵn sàng

## Bước 4: Test Frontend
1. Refresh trang frontend
2. Kiểm tra console không còn lỗi 403
3. Các API categories và products sẽ hoạt động bình thường

## Lưu ý
- Cấu hình security đã được sửa để cho phép public access cho:
  - `/categories` (GET)
  - `/products` (GET) 
  - `/products/featured` (GET)
  - `/products/images/*` (GET)
  - `/banners/**` (GET)

## Nếu vẫn lỗi
1. Kiểm tra backend logs có lỗi gì không
2. Đảm bảo database đang chạy
3. Kiểm tra port 8088 không bị chiếm bởi process khác 