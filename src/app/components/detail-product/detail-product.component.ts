import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { ProductImage } from '../../models/product.image';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule
  ]
})

export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {

  }
  ngOnInit() {
    // Lấy productId từ URL      
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL

          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }

          this.product = response
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          ;
        },
        error: (error: any) => {
          ;
          console.error('Error fetching detail:', error);
        }
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }
  showImage(index: number): void {

    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {

    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {

    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {

    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    this.isPressedAddToCart = true;

    // Kiểm tra đã đăng nhập chưa
    const token = this.tokenService.getToken();

    if (!token || this.tokenService.isTokenExpired()) {
      const confirmLogin = confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Chuyển đến trang đăng nhập?');
      if (confirmLogin) {
        this.router.navigate(['/login']);
      }
      return; // Dừng lại nếu chưa đăng nhập
    }

    // Kiểm tra số lượng tồn kho
    if (this.product && this.product.stock_quantity && this.product.stock_quantity <= 0) {
      alert('Sản phẩm đã hết hàng!');
      return;
    }

    // Kiểm tra số lượng nhập vào
    if (this.quantity <= 0) {
      alert('Số lượng phải lớn hơn 0!');
      return;
    }

    if (this.product && this.product.stock_quantity && this.quantity > this.product.stock_quantity) {
      alert(`Chỉ còn ${this.product.stock_quantity} sản phẩm trong kho!`);
      this.quantity = this.product.stock_quantity;
      return;
    }

    // Nếu đã đăng nhập và product hợp lệ thì thêm vào giỏ
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {

    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }
  buyNow(): void {
    // Kiểm tra đã đăng nhập chưa
    const token = this.tokenService.getToken();

    if (!token || this.tokenService.isTokenExpired()) {
      const confirmLogin = confirm('Bạn cần đăng nhập để mua hàng. Chuyển đến trang đăng nhập?');
      if (confirmLogin) {
        this.router.navigate(['/login']);
      }
      return; // Dừng lại nếu chưa đăng nhập
    }

    // Kiểm tra số lượng tồn kho
    if (this.product && this.product.stock_quantity && this.product.stock_quantity <= 0) {
      alert('Sản phẩm đã hết hàng!');
      return;
    }

    // Thêm vào giỏ hàng trước khi checkout
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    
    // Chuyển đến trang checkout
    this.router.navigate(['/orders']);
  }

  // Hàm lấy ảnh hiện tại
  getCurrentImage(): string {
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      return this.product.product_images[this.currentImageIndex].image_url;
    }
    return '';
  }

  // Hàm tính phần trăm giảm giá
  getDiscountPercentage(): number {
    if (this.product && this.product.price_old && this.product.price_old > this.product.price) {
      return Math.round(((this.product.price_old - this.product.price) / this.product.price_old) * 100);
    }
    return 0;
  }
}
