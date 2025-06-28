import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  createdAt: Date;
  read?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  addNotification(notification: Notification) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([{ ...notification, read: false }, ...current]);
  }

  markAllAsRead() {
    this.notificationsSubject.next(
      this.notificationsSubject.value.map(n => ({ ...n, read: true }))
    );
  }

  clearAll() {
    this.notificationsSubject.next([]);
  }
} 