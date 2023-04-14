import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  onClick = false
  constructor(private authService: AuthService) { }
  
  toggleClick(){
    this.onClick = !this.onClick
  }

  onLogout() {
    this.authService.logout();
  }
}
