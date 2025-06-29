import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { FilterService } from '../../services/filter.service';
import { Category } from '../../models/category';
import { Subscription } from 'rxjs';

interface CategoryMenuItem {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() horizontal = false;
  
  categories: CategoryMenuItem[] = [];
  private filterSubscription?: Subscription;
  private currentFilterState: any = { selectedCategoryId: 0 };

  constructor(
    private categoryService: CategoryService,
    private filterService: FilterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.subscribeToFilterChanges();
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  loadCategories() {
    this.categoryService.getCategories(0, 100).subscribe({
      next: (categories: Category[]) => {
        // Map categories to menu items with default icons
        this.categories = categories.map(category => ({
          id: category.id,
          name: category.name,
          icon: this.getCategoryIcon(category.name),
          isActive: false
        }));
        
        // Add "Tất cả" option at the beginning
        this.categories.unshift({
          id: 0,
          name: 'Tất cả',
          icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/all-categories.png;w=30;h=30;mode=pad',
          isActive: true
        });
        
        this.updateActiveCategory();
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        this.setDefaultCategories();
      }
    });
  }

  subscribeToFilterChanges() {
    this.filterSubscription = this.filterService.filterState$.subscribe(filterState => {
      this.currentFilterState = filterState;
      this.updateActiveCategory();
    });
  }

  updateActiveCategory() {
    this.categories.forEach(category => {
      category.isActive = category.id === this.currentFilterState.selectedCategoryId;
    });
  }

  onCategoryClick(categoryId: number) {
    this.filterService.setCategoryFilter(categoryId);
    
    // Navigate to home page if not already there
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Điện thoại': 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/mobile.png;w=30;h=30;mode=pad',
      'Màn hình': 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/man-hinh.png;w=30;h=30;mode=pad',
      'Laptop': 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/laptop.png;w=30;h=30;mode=pad',
      'Đồng hồ': 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/dong-ho.png;w=30;h=30;mode=pad',
      'Âm thanh': 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/am-thanh.png;w=30;h=30;mode=pad',
      'Phụ kiện': 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/phu-kien.png;w=30;h=30;mode=pad'
    };
    
    return iconMap[categoryName] || 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/default-category.png;w=30;h=30;mode=pad';
  }

  setDefaultCategories() {
    this.categories = [
      { id: 0, name: 'Tất cả', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/all-categories.png;w=30;h=30;mode=pad', isActive: true },
      { id: 1, name: 'Điện thoại', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/mobile.png;w=30;h=30;mode=pad', isActive: false },
      { id: 2, name: 'Màn hình', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/man-hinh.png;w=30;h=30;mode=pad', isActive: false },
      { id: 3, name: 'Laptop', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/laptop.png;w=30;h=30;mode=pad', isActive: false },
      { id: 4, name: 'Đồng hồ', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/dong-ho.png;w=30;h=30;mode=pad', isActive: false },
      { id: 5, name: 'Âm thanh', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/am-thanh.png;w=30;h=30;mode=pad', isActive: false },
      { id: 6, name: 'Phụ kiện', icon: 'https://cdn.hoanghamobile.com/Uploads/2025/02/05/phu-kien.png;w=30;h=30;mode=pad', isActive: false }
    ];
  }
} 