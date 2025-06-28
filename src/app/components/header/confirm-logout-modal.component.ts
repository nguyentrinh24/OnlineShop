import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-logout-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận đăng xuất</h5>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close()">Hủy</button>
            <button type="button" class="btn btn-danger" (click)="confirmLogout()">Đăng xuất</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmLogoutModalComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  confirmLogout() {
    this.confirm.emit();
  }
  close() {
    this.cancel.emit();
  }
} 