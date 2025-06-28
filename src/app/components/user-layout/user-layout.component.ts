import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent, RouterModule, CommonModule]
})
export class UserLayoutComponent {
  constructor(private router: Router) {}

  isOrdersPage(): boolean {
    const currentUrl = this.router.url;
    // Ẩn sidebar cho user-orders, user-profile và order (đặt hàng)
    return currentUrl.includes('/user-orders') || currentUrl.includes('/user-profile') || currentUrl.includes('/order');
  }
}