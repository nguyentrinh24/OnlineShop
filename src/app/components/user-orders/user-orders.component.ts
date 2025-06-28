import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';

import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderService } from '../../services/order.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { Order } from '../../models/order';
import { UserResponse } from '../../responses/user/user.response';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  userResponse?: UserResponse;
  keyword: string = "";
  selectedStatus: string = 'all'; // all, pending, processing, shipped, delivered, cancelled
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  localStorage?: Storage;
  visiblePages: number[] = [];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentUserOrdersPage')) || 0;
    this.loadUserInfo();
    this.loadOrders();
  }

  loadUserInfo() {
    const user = this.userService.getUserResponseFromLocalStorage();
    this.userResponse = user || undefined;
  }

  loadOrders() {
    this.orderService.getUserOrders(this.keyword, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.orders = response.orders || [];
        this.totalPages = response.totalPages || 1;
        this.totalElements = response.totalElements || 0;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  searchOrders() {
    this.currentPage = 0;
    this.loadOrders();
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.localStorage?.setItem('currentUserOrdersPage', String(this.currentPage));
      this.loadOrders();
    }
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  viewOrderDetails(order: Order) {
    this.router.navigate(['/order-detail', order.id]);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'shipped':
        return 'badge-primary';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipped': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadOrders();
  }

  getFilteredOrders(): Order[] {
    if (this.selectedStatus === 'all') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.selectedStatus);
  }

  // Profile sidebar navigation methods
  handleItemClick(itemId: number) {
    switch (itemId) {
      case 1: // Đơn mua - đã ở trang này rồi
        break;
      case 2: // Thông tin cá nhân
        this.router.navigate(['/user-profile']);
        break;
      case 3: // Đăng xuất
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        break;
    }
  }
} 