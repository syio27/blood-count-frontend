import { Component, OnInit, NgModule } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'blood-count-ui';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/login' || event.url === '/register') {
          this.authService.removeAccess();
        }
        window.scrollTo(0, 0);
      });
  }
}
