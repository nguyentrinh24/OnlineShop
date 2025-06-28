import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear any stored tokens/user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}