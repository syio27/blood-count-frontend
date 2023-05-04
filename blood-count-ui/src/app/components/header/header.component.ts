import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/interfaces/userDetails';
import { SharedUserDetailsService } from '../../services/shared-user-details.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  onClick = false;
  userDetails: UserDetails;

  constructor(
    private router: Router,
    private sharedUserService: SharedUserDetailsService,
    private elementRef: ElementRef
  ) { }

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
