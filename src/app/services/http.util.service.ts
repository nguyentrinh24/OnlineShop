import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilService {
  createHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('access-token') || '';
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
      'Authorization': `Bearer ${token}`
    });
  }
}
