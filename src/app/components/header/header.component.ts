import { Component, OnInit, OnDestroy, ElementRef, Renderer2, HostListener, ViewChild } from '@angular/core';
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
import { FilterService } from '../../services/filter.service';

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

  // Template references for better click outside detection
  @ViewChild('notificationButton', { static: false }) notificationButton!: ElementRef;
  @ViewChild('notificationDropdown', { static: false }) notificationDropdown!: ElementRef;
  @ViewChild('loginDropdownNotification', { static: false }) loginDropdownNotification!: ElementRef;
  @ViewChild('cartButton', { static: false }) cartButton!: ElementRef;
  @ViewChild('loginDropdownCart', { static: false }) loginDropdownCart!: ElementRef;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private filterService: FilterService,
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
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  // Notification dropdown logic
  toggleNotificationDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.notificationDropdownOpen = !this.notificationDropdownOpen;
    if (this.notificationDropdownOpen) {
      this.notificationService.markAllAsRead();
      // Close other dropdowns
      this.showLoginDropdownForNotification = false;
      this.showLoginDropdownForCart = false;
    }
  }

  // Click outside handler for all dropdowns
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Check if click is outside notification dropdown
    if (this.notificationDropdownOpen && this.notificationDropdown) {
      const dropdownElement = this.notificationDropdown.nativeElement;
      const buttonElement = this.notificationButton?.nativeElement;
      
      if (!dropdownElement.contains(target) && 
          (!buttonElement || !buttonElement.contains(target))) {
        this.notificationDropdownOpen = false;
      }
    }
    
    // Check if click is outside login dropdown for notification
    if (this.showLoginDropdownForNotification && this.loginDropdownNotification) {
      const dropdownElement = this.loginDropdownNotification.nativeElement;
      const buttonElement = this.notificationButton?.nativeElement;
      
      if (!dropdownElement.contains(target) && 
          (!buttonElement || !buttonElement.contains(target))) {
        this.showLoginDropdownForNotification = false;
      }
    }
    
    // Check if click is outside login dropdown for cart
    if (this.showLoginDropdownForCart && this.cartButton) {
      const buttonElement = this.cartButton.nativeElement;
      const dropdownElement = this.loginDropdownCart?.nativeElement;
      
      if (!buttonElement.contains(target) && 
          (!dropdownElement || !dropdownElement.contains(target))) {
        this.showLoginDropdownForCart = false;
      }
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
      this.notificationDropdownOpen = false;
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
      this.notificationDropdownOpen = false;
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

  // Search functionality
  onSearch() {
    this.filterService.setKeywordFilter(this.keyword);
    // Navigate to home page if not already there
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
