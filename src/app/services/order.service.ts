import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDTO } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;
  public latestOrderId: number | null = null;
  constructor(private http: HttpClient) {
    // Khôi phục từ localStorage nếu có (chỉ trên browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('latestOrderId');
      this.latestOrderId = saved ? +saved : null;
    }
  }

  placeOrder(orderData: OrderDTO): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData).pipe(
      tap(res => {
        this.latestOrderId = res.id;
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('latestOrderId', res.id.toString());
        }
      })
    );
  }
  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }
  getAllOrders(keyword: string,
    page: number, limit: number
  ): Observable<OrderResponse[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any>(this.apiGetAllOrders, { params });
  }
  updateOrder(orderId: number, orderData: OrderDTO): Observable<Object> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put(url, orderData);
  }
  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
  getLatestOrder(): Observable<Order> {
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('access-token') || '';
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Order>(`${this.apiUrl}/latest`, { headers })
      .pipe(
        tap(res => {
          // Lưu lại token mới nếu server trả về
          if (typeof window !== 'undefined' && window.localStorage && (res as any).token) {
            localStorage.setItem('access-token', (res as any).token);
          }
        })
      );
  }
}
