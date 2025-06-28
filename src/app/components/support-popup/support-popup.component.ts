import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-popup.component.html',
  styleUrls: ['./support-popup.component.scss']
})
export class SupportPopupComponent {
  isOpen = false;

  openPopup() {
    this.isOpen = true;
  }
  closePopup() {
    this.isOpen = false;
  }

  openMessenger() {
    window.open('https://www.facebook.com/messages/e2ee/t/9789374917761747', '_blank');
    this.closePopup();
  }
  openZalo() {
    window.open('https://zalo.me/0342424988', '_blank');
    this.closePopup();
  }
  callPhone() {
    window.open('tel:0342424988');
    this.closePopup();
  }
} 