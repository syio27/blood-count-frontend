import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onMyProfile() {
    this.router.navigate(['/profile']);
  }
  onCBC(){
    this.router.navigate(['/table']);
  }
  onLogout() {
    this.authService.logout();
  }
}
