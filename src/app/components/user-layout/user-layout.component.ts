import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FilterService } from '../../services/filter.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent, RouterModule, CommonModule],
  animations: [
    trigger('footerAnimation', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition('hide => show', [
        animate('0.3s ease-out')
      ]),
      transition('show => hide', [
        animate('0.2s ease-in')
      ])
    ])
  ]
})
export class UserLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private filterSubscription?: Subscription;
  isMobile = false;
  isBrowser: boolean = false;
  showFooter = true; // Luôn hiển thị footer để tránh vấn đề cuộn

  @ViewChild('mainContent', { static: false }) mainContent!: ElementRef;

  constructor(
    private router: Router,
    private filterService: FilterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  ngOnInit() {
    // Reset filter when navigating to home page
    this.filterSubscription = this.router.events.subscribe(() => {
      if (this.router.url === '/') {
        // Don't reset filter on home page, let it maintain state
      } else if (this.isOrdersPage()) {
        // Reset filter when going to orders page
        this.filterService.resetFilter();
      }
    });
  }

  ngAfterViewInit() {
    // Không cần kiểm tra scroll position nữa
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  checkScreenSize() {
    if (this.isBrowser && typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 900;
    }
  }

  // Đơn giản hóa checkScrollPosition - luôn hiển thị footer
  checkScrollPosition() {
    // Luôn hiển thị footer để tránh vấn đề cuộn
    this.showFooter = true;
  }

  isOrdersPage(): boolean {
    const currentUrl = this.router.url;
    // Ẩn sidebar cho user-orders, user-profile và order (đặt hàng)
    return currentUrl.includes('/user-orders') || currentUrl.includes('/user-profile') || currentUrl.includes('/order');
  }
}