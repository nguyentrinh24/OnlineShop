import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CategoryMenuItem {
  name: string;
  icon: string;
  link?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() horizontal = false;
  categories: CategoryMenuItem[] = [
    { name: 'Điện thoại', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/mobile.png;w=30;h=30;mode=pad', link: '' },
    { name: 'Màn hình', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/man-hinh.png;w=30;h=30;mode=pad', link: '' },
    { name: 'Laptop', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/laptop.png;w=30;h=30;mode=pad', link: '' },
    { name: 'Đồng hồ', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/dong-ho.png;w=30;h=30;mode=pad', link: '' },
    { name: 'Âm thanh', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/am-thanh.png;w=30;h=30;mode=pad', link: '' },
    { name: 'Phụ kiện', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/phu-kien.png;w=30;h=30;mode=pad', link: '' }
  ];
} 