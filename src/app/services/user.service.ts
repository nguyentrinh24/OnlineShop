import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;
  private apiGetAllUsers = `${environment.apiBaseUrl}/users`;
  private apiDeleteUser = `${environment.apiBaseUrl}/users`;
  private apiUpdateUserRole = `${environment.apiBaseUrl}/users/role`;
  localStorage?: Storage;
  private userSubject = new BehaviorSubject<UserResponse | null>(null);
  public user$ = this.userSubject.asObservable();

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
    // Initialize with user from localStorage if exists
    const savedUser = this.getUserResponseFromLocalStorage();
    if (savedUser) {
      this.userSubject.next(savedUser);
    }
  }

  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }
  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO) {
    //debugger
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  // Admin methods
  getAllUsers(keyword: string, page: number, limit: number): Observable<any> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get(this.apiGetAllUsers, {
      params: params,
      headers: this.httpUtilService.createHeaders()
    });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiDeleteUser}/${userId}`, {
      headers: this.httpUtilService.createHeaders()
    });
  }

  updateUserRole(userId: number, newRole: string): Observable<any> {
    return this.http.put(`${this.apiUpdateUserRole}/${userId}`, newRole, {
      headers: this.httpUtilService.createHeaders()
    });
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      //debugger
      if (userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      this.localStorage?.setItem('user', userResponseJSON);
      // Update the BehaviorSubject to notify all subscribers
      this.userSubject.next(userResponse);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }
  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      // Retrieve the JSON string from local storage using the key
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null; // Return null or handle the error as needed
    }
  }
  removeUserFromLocalStorage(): void {
    try {
      // Remove the user data from local storage using the key
      this.localStorage?.removeItem('user');
      // Clear the BehaviorSubject to notify all subscribers
      this.userSubject.next(null);
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }

}
