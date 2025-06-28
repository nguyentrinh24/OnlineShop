import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { TokenService } from '../../services/token.service';
import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    //FormsModule
  ],


})
export class AdminComponent implements OnInit {
  //adminComponent: string = 'orders';
  userResponse?: UserResponse | null;
  
  // Dashboard stats
  totalOrders: number = 0;
  totalProducts: number = 0;
  totalUsers: number = 0;
  totalCategories: number = 0;
  
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {

  }
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.loadDashboardStats();
  }
  
  loadDashboardStats() {
    // Load actual stats from services
    this.orderService.getAllOrders('', 0, 1).subscribe({
      next: (response: any) => {
        this.totalOrders = response.totalElements || 0;
      },
      error: (error: any) => {
        console.error('Error loading orders stats:', error);
      }
    });

    this.productService.getProducts('', 0, 0, 1).subscribe({
      next: (response: any) => {
        this.totalProducts = response.totalElements || 0;
      },
      error: (error: any) => {
        console.error('Error loading products stats:', error);
      }
    });

    this.userService.getAllUsers('', 0, 1).subscribe({
      next: (response: any) => {
        this.totalUsers = response.totalElements || 0;
      },
      error: (error: any) => {
        console.error('Error loading users stats:', error);
      }
    });

    this.categoryService.getCategories(0, 100).subscribe({
      next: (categories: any) => {
        this.totalCategories = categories.length || 0;
      },
      error: (error: any) => {
        console.error('Error loading categories stats:', error);
      }
    });
  }

  confirmLogout() {
    const confirmed = confirm('Bạn có chắc chắn muốn đăng xuất không?');
    if (confirmed) {
      this.logout();
    }
  }

  logout() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = null;
    this.router.navigate(['/']);
  }

  showAdminComponent(componentName: string): void {
    if (componentName === 'dashboard') {
      this.router.navigate(['/admin']);
    } else if (componentName === 'orders') {
      this.router.navigate(['/admin/orders']);
    } else if (componentName === 'categories') {
      this.router.navigate(['/admin/categories']);
    } else if (componentName === 'products') {
      this.router.navigate(['/admin/products']);
    } else if (componentName === 'users') {
      this.router.navigate(['/admin/users']);
    }
  }
}


