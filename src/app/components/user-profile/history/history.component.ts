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
  openedPopup = false
  currentPage = 1;
  gamesPerPage = 3;
  selectedGame: any
  caseInfo: ISimpleGameResponse

  constructor(
    private userService: UserProfileService,
    private sharedUserService: SharedUserDetailsService
  ) {}

  ngOnInit() {
    this.fetchHistory()
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

  get displayedGames(): ISimpleGameResponse[] {
    const startIndex = (this.currentPage - 1) * this.gamesPerPage;
    const endIndex = startIndex + this.gamesPerPage;
    return this.gameHistory.slice(startIndex, endIndex);
  }

  openPopup(item) {
    this.userService.getCompletedGameById(this.userID, item).subscribe(
      (data) => {
        this.caseInfo = data
        console.log(data)
      }
    )
    this.openedPopup = true
  }

  closePopup() {
    this.openedPopup = false
  }

  get totalPages(): number {
    return Math.ceil(this.gameHistory.length / this.gamesPerPage);
  }

  get displayedGroups(): ISimpleGameResponse[] {
    const startIndex = (this.currentPage - 1) * this.gamesPerPage;
    const endIndex = startIndex + this.gamesPerPage;
    return this.gameHistory.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
