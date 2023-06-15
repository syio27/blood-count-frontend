import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { NgToastService } from 'ng-angular-popup';


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

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: NgToastService
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
      });
  }
  showSuccess() {
    this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration: 5000});
  }
  showError() {
    this.toast.error({detail:"ERROR",summary:'Your Error Message',sticky:true});
  }

  showInfo() {
    this.toast.info({detail:"INFO",summary:'Your Info Message',sticky:true});
  }

}
