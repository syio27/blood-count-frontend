import { Component } from '@angular/core';
import { SharedUserDetailsService } from 'src/app/shared/shared-user-details.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  userDetails: UserDetails;

  constructor(
    private sharedUserService: SharedUserDetailsService,
  ) { }

  ngOnInit() {
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
  }
}
