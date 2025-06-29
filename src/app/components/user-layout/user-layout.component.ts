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
  showFooter = false; // Biến để kiểm soát hiển thị footer

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

  // Thêm listener cho sự kiện cuộn
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isBrowser && this.mainContent) {
      this.checkScrollPosition();
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

    // Kiểm tra vị trí cuộn ban đầu sau khi component đã render
    setTimeout(() => {
      this.checkScrollPosition();
    }, 100);
  }

  ngAfterViewInit() {
    // Kiểm tra vị trí cuộn sau khi view đã được khởi tạo
    if (this.isBrowser) {
      setTimeout(() => {
        this.checkScrollPosition();
      }, 200);
    }
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

  // Kiểm tra vị trí cuộn để ẩn/hiện footer
  checkScrollPosition() {
    if (!this.mainContent || !this.isBrowser) return;

    // Trên mobile, luôn hiển thị footer
    if (this.isMobile) {
      this.showFooter = true;
      return;
    }

    const element = this.mainContent.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Hiển thị footer khi cuộn gần đến cuối (còn 200px)
    const threshold = 200;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    
    // Chỉ thay đổi trạng thái nếu cần thiết để tránh re-render không cần thiết
    if (this.showFooter !== isNearBottom) {
      this.showFooter = isNearBottom;
    }
  }

  isOrdersPage(): boolean {
    const currentUrl = this.router.url;
    // Ẩn sidebar cho user-orders, user-profile và order (đặt hàng)
    return currentUrl.includes('/user-orders') || currentUrl.includes('/user-profile') || currentUrl.includes('/order');
  }
}