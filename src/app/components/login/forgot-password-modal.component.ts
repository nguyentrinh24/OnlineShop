import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Quên mật khẩu</h5>
          </div>
          <div class="modal-body">
            <p>Nhập email hoặc số điện thoại để lấy lại mật khẩu:</p>
            <input type="text" class="form-control" [(ngModel)]="inputValue" placeholder="Email hoặc số điện thoại">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close()">Hủy</button>
            <button type="button" class="btn btn-primary" (click)="submitForgot()">Gửi yêu cầu</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordModalComponent {
  inputValue: string = '';
  @Output() submit = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  submitForgot() {
    if (this.inputValue.trim()) {
      this.submit.emit(this.inputValue.trim());
    }
  }
  close() {
    this.cancel.emit();
  }
} 