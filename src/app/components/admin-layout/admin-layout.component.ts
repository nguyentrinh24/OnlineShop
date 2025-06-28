import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmLogoutModalComponent } from '../header/confirm-logout-modal.component';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, ConfirmLogoutModalComponent]
})
export class AdminLayoutComponent {
  showLogoutModal = false;
  constructor(private router: Router) {}

  logout() {
    this.showLogoutModal = true;
  }
  onLogoutConfirm() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }
  onLogoutCancel() {
    this.showLogoutModal = false;
  }
}