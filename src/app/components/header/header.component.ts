import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NotificationService, Notification } from '../../services/notification.service';
import { ConfirmLogoutModalComponent } from './confirm-logout-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    SidebarComponent,
    ConfirmLogoutModalComponent
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  latestOrderId: number | null = null;
  keyword: string = '';
  private userSubscription?: Subscription;

  // Notification logic
  notifications: Notification[] = [];
  unreadCount = 0;
  notificationDropdownOpen = false;
  private notificationSubscription?: Subscription;

  showLogoutModal = false;
  showLoginDropdownForNotification = false;
  showLoginDropdownForCart = false;

  private documentClickListener?: () => void;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}
  
  ngOnInit() {
    // Subscribe to user state changes
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.userResponse = user;
      if (this.userResponse && this.tokenService.getToken()) {
        this.orderService.getLatestOrder().subscribe({
          next: order => this.latestOrderId = order.id,
          error: () => this.latestOrderId = null
        });
      } else {
        this.latestOrderId = null;
      }
    });
    // Subscribe to notifications
    this.notificationSubscription = this.notificationService.notifications$.subscribe(list => {
      this.notifications = list;
      this.unreadCount = list.filter(n => !n.read).length;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.documentClickListener) this.documentClickListener();
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  // Notification dropdown logic
  toggleNotificationDropdown(event: Event) {
    event.preventDefault();
    this.notificationDropdownOpen = !this.notificationDropdownOpen;
    if (this.notificationDropdownOpen) {
      this.notificationService.markAllAsRead();
      // Listen for outside click
      this.documentClickListener = this.renderer.listen('document', 'click', (e: Event) => {
        const dropdown = this.elRef.nativeElement.querySelector('.dropdown-menu.show');
        if (dropdown && !dropdown.contains(e.target) && !(event.target as HTMLElement).closest('.nav-link')) {
          this.notificationDropdownOpen = false;
          if (this.documentClickListener) this.documentClickListener();
        }
      });
    } else {
      if (this.documentClickListener) this.documentClickListener();
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  clearAllNotifications() {
    this.notificationService.clearAll();
  }

  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile']);
    } else if (index === 2) {
      this.showLogoutModal = true;
      this.isPopoverOpen = false;
      return;
    }
    this.isPopoverOpen = false;
  }

  onLogoutConfirm() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.showLogoutModal = false;
  }

  onLogoutCancel() {
    this.showLogoutModal = false;
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
  }

  onCartClick(event: Event) {
    if (!this.userResponse) {
      event.preventDefault();
      this.showLoginDropdownForCart = !this.showLoginDropdownForCart;
      this.showLoginDropdownForNotification = false;
      return;
    }
    this.setActiveNavItem(2);
    this.showLoginDropdownForCart = false;
    this.showLoginDropdownForNotification = false;
  }

  onNotificationClick(event: Event) {
    if (!this.userResponse) {
      event.preventDefault();
      this.showLoginDropdownForNotification = !this.showLoginDropdownForNotification;
      this.showLoginDropdownForCart = false;
      return;
    }
    this.toggleNotificationDropdown(event);
    this.setActiveNavItem(1);
    this.showLoginDropdownForNotification = false;
    this.showLoginDropdownForCart = false;
  }

  onLoginDropdownClick() {
    this.router.navigate(['/login']);
  }
}
