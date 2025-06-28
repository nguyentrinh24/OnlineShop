# Tính năng Tự động Phân quyền khi Đăng nhập

## Mô tả
Đã refactor hệ thống để tự động xác định và phân quyền cho người dùng dựa trên thông tin đăng nhập, loại bỏ việc yêu cầu user chọn role trong form đăng nhập.

## Lợi ích của việc refactor

### 🔒 **Bảo mật tốt hơn:**
- User không thể giả mạo role khác
- Backend tự động xác định role từ database
- Giảm thiểu rủi ro bảo mật

### 🎯 **UX tốt hơn:**
- Form đăng nhập đơn giản hơn
- Ít bước thao tác cho user
- Giảm confusion về role selection

### 🛠️ **Maintenance dễ dàng:**
- Logic phân quyền tập trung ở backend
- Frontend không cần quản lý role logic
- Dễ dàng thêm/sửa role trong tương lai

## Các thay đổi đã thực hiện

### 1. Backend (Spring Boot)

#### UserService (`UserService.java`)
```java
// Trước
public String login(String phoneNumber, String password, Long roleId) throws Exception {
    // Kiểm tra roleId có khớp với user không
    Optional<Role> optionalRole = roleRepository.findById(roleId);
    if(optionalRole.isEmpty() || !roleId.equals(existingUser.getRole().getId())) {
        throw new DataNotFoundException("Role không tồn tại");
    }
    // ...
}

// Sau
public String login(String phoneNumber, String password) throws Exception {
    // Tự động lấy role từ user trong database
    // Không cần kiểm tra roleId từ frontend
    // ...
}
```

#### IUserService Interface
```java
// Trước
String login(String phoneNumber, String password, Long roleId) throws Exception;

// Sau
String login(String phoneNumber, String password) throws Exception;
```

#### UserController
```java
// Trước
String token = userService.login(
    userLoginDTO.getPhoneNumber(),
    userLoginDTO.getPassword(),
    userLoginDTO.getRoleId() == null ? 1 : userLoginDTO.getRoleId()
);

// Sau
String token = userService.login(
    userLoginDTO.getPhoneNumber(),
    userLoginDTO.getPassword()
);
```

#### UserLoginDTO
```java
// Trước
public class UserLoginDTO {
    private String phoneNumber;
    private String password;
    private Long roleId; // Đã loại bỏ
}

// Sau
public class UserLoginDTO {
    private String phoneNumber;
    private String password;
}
```

### 2. Frontend (Angular)

#### Login Component (`login.component.ts`)
```typescript
// Trước
export class LoginComponent {
  selectedRoleId: number = 2;
  roles: Role[] = [];
  
  ngOnInit() {
    this.loadRoles(); // Load roles từ backend
  }
  
  loadRoles() {
    this.roleService.getRoles().subscribe(...);
  }
  
  login() {
    const loginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRoleId // Gửi roleId lên backend
    };
  }
}

// Sau
export class LoginComponent {
  ngOnInit() {
    // Không cần load roles
  }
  
  login() {
    const loginDTO = {
      phone_number: this.phoneNumber,
      password: this.password
      // Không cần role_id
    };
  }
}
```

#### Login Template (`login.component.html`)
```html
<!-- Trước -->
<div class="form-group">
  <label for="roleSelect">Vai trò</label>
  <select [(ngModel)]="selectedRoleId" (change)="onRoleChange($event)">
    <option *ngFor="let role of roles" [value]="role.id">
      {{ role.name === 'ADMIN' ? 'Quản trị viên' : 'Người dùng' }}
    </option>
  </select>
</div>

<!-- Sau -->
<!-- Loại bỏ hoàn toàn dropdown chọn role -->
```

#### LoginDTO
```typescript
// Trước
export class LoginDTO {
  phone_number: string;
  password: string;
  role_id: number; // Đã loại bỏ
}

// Sau
export class LoginDTO {
  phone_number: string;
  password: string;
}
```

## Luồng hoạt động mới

### 1. User đăng nhập
```
User nhập phone + password → Frontend gửi request
```

### 2. Backend xử lý
```
Backend nhận request → Tìm user theo phone number → 
Kiểm tra password → Lấy role từ database → 
Tạo JWT token với role info → Trả về response
```

### 3. Frontend routing
```
Frontend nhận response → Lưu user info → 
Kiểm tra role từ response → Routing dựa trên role:
- ADMIN → /admin
- USER → /
```

## API Changes

### Login Endpoint
```
POST /api/v1/users/login
```

**Request Body (Trước):**
```json
{
  "phone_number": "0123456789",
  "password": "password123",
  "role_id": 2
}
```

**Request Body (Sau):**
```json
{
  "phone_number": "0123456789",
  "password": "password123"
}
```

**Response (Không thay đổi):**
```json
{
  "message": "Login successfully",
  "token": "jwt_token_here",
  "token_type": "Bearer",
  "username": "0123456789",
  "roles": ["ROLE_USER"],
  "id": 1
}
```

## Testing

### 1. Test với User thường
1. Đăng nhập với tài khoản user
2. Kiểm tra routing đến trang chủ `/`
3. Kiểm tra không thể truy cập `/admin`

### 2. Test với Admin
1. Đăng nhập với tài khoản admin
2. Kiểm tra routing đến `/admin`
3. Kiểm tra có thể truy cập admin features

### 3. Test bảo mật
1. Thử đăng nhập với sai password
2. Thử đăng nhập với phone number không tồn tại
3. Kiểm tra user bị lock có thể đăng nhập không

## Migration Notes

### Database
- Không cần thay đổi database schema
- Role vẫn được lưu trong bảng `users` với foreign key đến `roles`

### Existing Users
- Tất cả user hiện tại vẫn hoạt động bình thường
- Role được tự động xác định từ database

### Security
- JWT token vẫn chứa role information
- Authorization guards vẫn hoạt động như cũ
- Không có thay đổi về security model

## Future Enhancements

### 1. Multi-role Support
- Có thể mở rộng để support user có nhiều role
- Backend sẽ trả về array of roles

### 2. Role-based Features
- Thêm features dựa trên role
- Dynamic UI based on user role

### 3. Role Management
- Admin có thể thay đổi role của user
- Role hierarchy system 