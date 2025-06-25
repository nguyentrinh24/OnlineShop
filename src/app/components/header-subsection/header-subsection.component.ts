import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-subsection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header-subsection">
      <div class="policies">
        <span><i class="fas fa-undo"></i> Đổi trả 30 ngày</span>
        <span><i class="fas fa-shipping-fast"></i> Giao hàng toàn quốc</span>
        <span><i class="fas fa-certificate"></i> Hàng chính hãng</span>
      </div>
      
    </div>
  `,
  styleUrls: ['./header-subsection.component.scss']
})
export class HeaderSubsectionComponent {} 