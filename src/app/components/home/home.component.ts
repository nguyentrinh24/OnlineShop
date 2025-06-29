import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { TokenService } from '../../services/token.service';
import { FilterService } from '../../services/filter.service';
import { isPlatformBrowser } from '@angular/common';
import { BannerComponent } from '../banner/banner.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    BannerComponent
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  localStorage?: Storage;
  isLoading: boolean = true;
  isBrowser: boolean = false;
  private filterSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private tokenService: TokenService,
    private filterService: FilterService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.localStorage = document.defaultView?.localStorage;
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.currentPage = Number(this.localStorage?.getItem('currentProductPage')) || 0;
    }
    this.subscribeToFilterChanges();
    this.loadData();
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  subscribeToFilterChanges() {
    this.filterSubscription = this.filterService.filterState$.subscribe(filterState => {
      this.selectedCategoryId = filterState.selectedCategoryId;
      this.keyword = filterState.keyword;
      this.currentPage = filterState.currentPage;
      
      if (this.isBrowser && this.localStorage) {
        this.localStorage.setItem('currentProductPage', String(this.currentPage));
      }
      
      this.loadProducts();
    });
  }

  loadData() {
    this.isLoading = true;
    this.loadProducts();
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  loadCategories() {
    this.categoryService.getCategories(0, 100).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  searchProducts() {
    this.filterService.setKeywordFilter(this.keyword);
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        if (response && response.products) {
          response.products.forEach((product: Product) => {
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          });
          this.products = response.products;
          this.totalPages = response.totalPages || 1;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.filterService.setPage(page < 0 ? 0 : page);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    if (totalPages <= 0) return [1];
    
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

  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  onCategoryClick(categoryId: number) {
    this.filterService.setCategoryFilter(categoryId);
  }

  onImageError(event: any) {
    event.target.src = 'https://www.geeksforgeeks.org/blogs/error-404-not-found/';
  }

  onImageLoad(event: any) {
    // Handle image load success
  }

  getHoverImage(product: Product): string {
    if (product.product_images && product.product_images.length > 1) {
      return `${environment.apiBaseUrl}/products/images/${product.product_images[1].image_url}`;
    }
    return product.url;
  }
  
  trackByProductId(index: number, product: any): number {
    return product.id;
  }
  
  trackByCategoryId(index: number, category: any): number {
    return category.id;
  }
  
  loadFeaturedProducts() {
    this.productService.getFeaturedProducts(8).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          response.forEach((product: Product) => {
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          });
          this.featuredProducts = response;
        }
      },
      error: (error: any) => {
        console.error('Error fetching featured products:', error);
      }
    });
  }
}
