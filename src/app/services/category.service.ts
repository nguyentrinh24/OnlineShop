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
export class CategoryService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  
  getCategories(page: number, limit: number): Observable<Category[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/categories`, { params });
  }
  
  getDetailCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiBaseUrl}/categories/${id}`);
  }
  
  deleteCategory(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}/categories/${id}`, {
      headers: this.httpUtilService.createHeaders()
    });
  }
  
  updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<UpdateCategoryDTO> {
    return this.http.put<Category>(`${this.apiBaseUrl}/categories/${id}`, updatedCategory, {
      headers: this.httpUtilService.createHeaders()
    });
  }
  
  insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/categories`, insertCategoryDTO, {
      headers: this.httpUtilService.createHeaders()
    });
  }
}
