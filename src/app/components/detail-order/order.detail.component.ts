import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dtos/order/order.dto';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { OrderResponse } from '../../responses/order/order.response';
import { environment } from '../../../environments/environment';
import { OrderDetail } from '../../models/order.detail';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order.detail.component.html',
  styleUrls: ['./order.detail.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    RouterModule
  ]
})
export class OrderDetailComponent implements OnInit {
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: []
  };

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        this.orderService.latestOrderId = response.id;

        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address;
        this.orderResponse.note = response.note;
        this.orderResponse.order_date = new Date(
          response.order_date[0],
          response.order_date[1] - 1,
          response.order_date[2]
        );

        this.orderResponse.order_details = response.order_details.map((order_detail: OrderDetail) => {
          order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
          return order_detail;
        });

        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.shipping_date = new Date(
          response.shipping_date[0],
          response.shipping_date[1] - 1,
          response.shipping_date[2]
        );

        this.orderResponse.shipping_method = response.shipping_method;
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
      },
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      }
    });
  }

  // Helper methods for display text
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

  getShippingMethodText(method: string): string {
    const methodMap: { [key: string]: string } = {
      'express': 'Giao hàng nhanh',
      'standard': 'Giao hàng tiêu chuẩn'
    };
    return methodMap[method] || method;
  }

  getPaymentMethodText(method: string): string {
    const methodMap: { [key: string]: string } = {
      'cod': 'Thanh toán khi nhận hàng',
      'banking': 'Chuyển khoản ngân hàng',
      'momo': 'Ví MoMo',
      'vnpay': 'VNPay'
    };
    return methodMap[method] || method;
  }

  // Navigation methods
  goBack(): void {
    this.router.navigate(['/user-orders']);
  }

  printOrder(): void {
    window.print();
  }
}

