import { Component, OnInit, HostListener } from '@angular/core';
import { UserProfileService } from 'src/app/services/user.service';
import { ISimpleGameResponse } from 'src/app/interfaces/ISimpleGameResponse';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


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
  changeGamesPerPage = window.innerHeight > 750;
  gamesPerPage = this.gamesPerPageBasedOnView;
  private resizeSubject = new Subject<Event>();
  selectedGame: any
  caseInfo: ISimpleGameResponse

  constructor(
    private userService: UserProfileService,
    private sharedUserService: SharedUserDetailsService
  ) {
    this.resizeSubject.pipe(
      debounceTime(200)  // Adjust debounce time as needed
    ).subscribe(() => {
      this.gamesPerPage = this.gamesPerPageBasedOnView; // Update games per page
    });
  }

  get gamesPerPageBasedOnView(): number {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Desktop viewport
    if (w > 768 && h > 450) {
      return 3;
    }

    // Mobile in portrait orientation
    if (h > w) {
      return 3;
    }

    // Mobile in landscape orientation
    return 1;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeSubject.next(event);
  }

  ngOnInit() {
    this.fetchHistory()
  }

  fetchHistory() {
    this.sharedUserService.getUserDetails().subscribe(
      (data) => {
        this.userID = data.id
      }
    )
    this.userService.getHistory(this.userID).subscribe(
      (data) => {
        this.gameHistory = this.sortByDateField(data, 'endTime').reverse()
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

  get visiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 3) {
      return this.pages;
    }

    const visiblePageCount = 1; // Number of visible pages around the current page
    let startPage = Math.max(currentPage - visiblePageCount, 1);
    let endPage = Math.min(currentPage + visiblePageCount, totalPages);

    if (startPage === 1) {
      endPage = startPage + visiblePageCount * 2;
    } else if (endPage === totalPages) {
      startPage = endPage - visiblePageCount * 2;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }

  sortByDateField<T>(array: T[], fieldName: string): T[] {
    return array.sort((a: any, b: any) => {
      return new Date(a[fieldName]).getTime() - new Date(b[fieldName]).getTime();
    });
  }
}
