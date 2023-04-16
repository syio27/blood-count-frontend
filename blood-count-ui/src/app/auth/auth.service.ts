import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router
  ) {}

  login(user: User) {
    if (user.userName !== '' && user.password !== '') {
      this.loggedIn.next(true);
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  register(user: User) {
    // Here you would send a request to your backend API to create a new user
    // Once the request is successful, you can log the user in and navigate to the home page
    if (user.userName !== '' && user.password !== '' && user.email !== '') {
      this.loggedIn.next(true);
      this.router.navigate(['/']);
    }
  }
}
