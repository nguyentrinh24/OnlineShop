import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderSubsectionComponent } from '../components/header-subsection/header-subsection.component';
import { SupportPopupComponent } from '../components/support-popup/support-popup.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterModule,    
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    HeaderSubsectionComponent,
    SupportPopupComponent
  ]
})
export class AppComponent {
  onChatClick() {
    alert('Tính năng chat sẽ sớm ra mắt!');
  }
}
