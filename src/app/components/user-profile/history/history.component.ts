import { Component,OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/services/user.service';
import { ISimpleGameResponse } from 'src/app/interfaces/ISimpleGameResponse';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  gameHistory: ISimpleGameResponse[] = []
  userID: string
  constructor(
    private userService: UserProfileService,
    private sharedUserService: SharedUserDetailsService
  ) {}

  ngOnInit() {
  }
  fetchHistory(){
    this.sharedUserService.getUserDetails().subscribe(
      (data) =>{
        this.userID = data.id
      }
    )    
    this.userService.getHistory(this.userID).subscribe(
        (data) => {
          this.gameHistory = data
        }
    )
  }
}
