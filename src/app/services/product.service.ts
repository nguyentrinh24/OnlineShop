import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number
  ): Observable<any> {
    const params = {
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };
    
    // Products endpoint is public, no need for Authorization header
    return this.http.get<any>(`${this.apiBaseUrl}/products`, { params })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error fetching products:', error);
          return throwError(() => error);
        })
      );
  }

  getDetailProduct(productId: number): Observable<Product> {
    // Product detail endpoint is public, no need for Authorization header
    return this.http.get<Product>(`${this.apiBaseUrl}/products/${productId}`)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error fetching product detail:', error);
          return throwError(() => error);
        })
      );
  }

  getProductsByIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    // Products by IDs endpoint is public, no need for Authorization header
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/by-ids`, { params })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error fetching products by IDs:', error);
          return throwError(() => error);
        })
      );
  }
  
  deleteProduct(productId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}/products/${productId}`, {
      headers: this.httpUtilService.createHeaders()
    })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error deleting product:', error);
          return throwError(() => error);
        })
      );
  }
  
  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
    return this.http.put<Product>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct, {
      headers: this.httpUtilService.createHeaders()
    })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error updating product:', error);
          return throwError(() => error);
        })
      );
  }
  
  insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/products`, insertProductDTO, {
      headers: this.httpUtilService.createHeaders()
    })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error inserting product:', error);
          return throwError(() => error);
        })
      );
  }
  
  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    // For file upload, we need different headers
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('access-token') || '';
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.apiBaseUrl}/products/uploads/${productId}`, formData, { headers })
      .pipe(
        timeout(15000),
        catchError(error => {
          console.error('Error uploading images:', error);
          return throwError(() => error);
        })
      );
  }
  
  deleteProductImage(id: number): Observable<any> {
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`, {
      headers: this.httpUtilService.createHeaders()
    })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error deleting product image:', error);
          return throwError(() => error);
        })
      );
  }

  getFeaturedProducts(limit: number): Observable<Product[]> {
    // Featured products endpoint is public, no need for Authorization header
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/featured?limit=${limit}`)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error fetching featured products:', error);
          return throwError(() => error);
        })
      );
  }

}
//update.category.admin.component.html