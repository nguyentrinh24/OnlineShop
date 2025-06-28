import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../../responses/user/login.response';
import { UserResponse } from '../../responses/user/user.response';
import { CartService } from '../../services/cart.service';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  phoneNumber: string = '';
  password: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = true;
  userResponse?: UserResponse;
  isLoading: boolean = false;

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    // Không cần load roles nữa vì backend sẽ tự động xác định
  }
  
  createAccount() {
    //debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']);
  }
  
  login() {
    if (this.isLoading) return; // Prevent multiple submissions
    
    this.isLoading = true;
    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}`;
    //alert(message);
    //debugger

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password
    };
    
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        //debugger;
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          //debugger;
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              //debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              // Backend sẽ tự động xác định role, frontend chỉ cần routing dựa trên role
              if (this.userResponse?.role.id === 1) {
                this.router.navigate(['/admin']); // role_id 1 = admin
              } else if (this.userResponse?.role.id === 2) {
                this.router.navigate(['']); // role_id 2 = user
              }
              // Force a small delay to ensure state is updated before navigation
              setTimeout(() => {
                this.cartService.refreshCart();
                this.isLoading = false;
              }, 100);
            },
            complete: () => {
              this.cartService.refreshCart();
              this.isLoading = false;
              //debugger;
            },
            error: (error: any) => {
              //debugger;
              this.isLoading = false;
              alert(error.error.message);
            }
          })
        }
      },
      complete: () => {
        //debugger;
      },
      error: (error: any) => {
        //debugger;
        this.isLoading = false;
        alert(error.error.message);
      }
    });
  }
  
  loginWithGoogle() {
    // TODO: Implement Google login functionality
    console.log('Google login clicked');
    alert('Tính năng đăng nhập bằng Google đang được phát triển!');
  }
  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  
  closeLoginPopup() {
    // Nếu dùng biến hiển thị popup, set biến đó về false. Nếu không, tạm thời điều hướng về trang chủ.
    this.router.navigate(['/']);
  }
}
