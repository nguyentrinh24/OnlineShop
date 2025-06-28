import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserResponse } from '../../../responses/user/user.response';

@Component({
  selector: 'app-user.admin',    
  templateUrl: './user.admin.component.html',
  styleUrl: './user.admin.component.scss',
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class UserAdminComponent implements OnInit{
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  location = inject(Location);
  
  users: UserResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];
  localStorage?: Storage;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentUserAdminPage')) || 0;
    this.getAllUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchUsers() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getAllUsers(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }

  getAllUsers(keyword: string, page: number, limit: number) {
    this.userService.getAllUsers(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        //debugger;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentUserAdminPage', String(this.currentPage));
    this.getAllUsers(this.keyword, this.currentPage, this.itemsPerPage);
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

  deleteUser(userId: number) {
    const confirmation = window.confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      this.userService.deleteUser(userId).subscribe({
        next: (response: any) => {
          alert('User deleted successfully');
          location.reload();
        },
        complete: () => {
          //debugger;          
        },
        error: (error: any) => {
          alert(error.error);
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  updateUserRole(userId: number, newRole: string) {
    const confirmation = window.confirm(`Are you sure you want to change this user's role to ${newRole}?`);
    if (confirmation) {
      this.userService.updateUserRole(userId, newRole).subscribe({
        next: (response: any) => {
          alert('User role updated successfully');
          location.reload();
        },
        complete: () => {
          //debugger;          
        },
        error: (error: any) => {
          alert(error.error);
          console.error('Error updating user role:', error);
        }
      });
    }
  }
}
