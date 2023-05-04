import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


interface AppState {
  message: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'blood-count-ui';

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/login') {
          this.removeAccess();
          this.removeUserDetails();
        }
      });
  }

  private removeAccess() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("expirationDate");
  }

  private removeUserDetails() {
    localStorage.removeItem("userDetails");
  }
}
