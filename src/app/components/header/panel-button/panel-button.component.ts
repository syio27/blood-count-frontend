import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';

@Component({
  selector: 'app-panel-button',
  templateUrl: './panel-button.component.html',
  styleUrls: ['./panel-button.component.css']
})
export class PanelButtonComponent {
  userDetails: UserDetails;

  constructor(
    private router: Router,
    private sharedUserService: SharedUserDetailsService,

  ) { }
  ngOnInit() {
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
      console.log(this.userDetails)
    });
    
  }
  onRoot() {
    this.router.navigate(['/root'])
  }
}
