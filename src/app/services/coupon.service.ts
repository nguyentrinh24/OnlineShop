import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { UpdateCategoryDTO } from '../dtos/category/update.category.dto';
import { InsertCategoryDTO } from '../dtos/category/insert.category.dto';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  
  calculateCouponValue(couponCode: string, totalAmount: number): Observable<number> {
    const url = `${this.apiBaseUrl}/coupons/calculate`;
    const params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount.toString());

    return this.http.get<number>(url, { 
      params,
      headers: this.httpUtilService.createHeaders()
    });
  }
}