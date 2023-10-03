import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { SharedUserDetailsService } from '../../shared/shared-user-details.service'
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  onClick = false;
  userDetails: UserDetails;
  private resizeSubject = new Subject<Event>();
  showPcLogo = window.innerWidth > 450;

  constructor(
    private router: Router,
    private sharedUserService: SharedUserDetailsService,
  ) {
    this.resizeSubject.pipe(
      debounceTime(200)
    ).subscribe(event => {
      this.showPcLogo = window.innerWidth > 450;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeSubject.next(event);
  }

  ngOnInit() {
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
  }

  toggleClick() {
    this.onClick = !this.onClick;
  }

  onLogo() {
    this.router.navigate(['/'])
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = document.querySelector('#tapper');
    if (this.onClick && event.target !== targetElement) {
      this.onClick = false;
    }
  }
}
