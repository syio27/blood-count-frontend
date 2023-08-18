import { Component, OnInit, ViewChild } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { ICaseResponse } from 'src/app/interfaces/ICaseResponse';
import { TimerComponent } from '../exam/timer/timer.component';
import { Router } from "@angular/router";
import { GameService } from 'src/app/services/game.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { SharedGameDataService } from 'src/app/services/shared-game-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(TimerComponent) timerComponent: TimerComponent;
  userDetails: UserDetails;
  onClick = false;
  dropdownOptions: ICaseResponse[] = [];
  selectedOption = null;
  selectedOptionId = null;
  isTestFinished: string;
  inProgress: boolean;
  gameId: number

  constructor(
    private caseService: CaseService,
    private router: Router,
    private gameService: GameService,
    private sharedUserService: SharedUserDetailsService,
    private sharedGameDataService: SharedGameDataService
  ) { }

  toggleClick() {
    this.onClick = !this.onClick;
  }

  ngOnInit() {
    this.fetchCase();
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
    this.gameService.checkIfAnyInProgress(this.userDetails.id).subscribe(response => {
      this.inProgress = response.inProgress;
      this.gameId = response.gameId;
      if (this.inProgress == true) {
        this.selectedOption = 'Your game is running, please press continue button';
      }
    })
  }

  fetchCase() {
    this.caseService.getAllCasesWithAbnormalities().subscribe(cases => {
      this.dropdownOptions = [cases].flatMap((subArray) => subArray).sort();
    });
  }

  selectOption(option: string, id: number) {
    this.selectedOption = 'Case ' + id;
    this.selectedOptionId = id;
    this.onClick = false;
  }

  startTest() {
    this.gameService.start(this.selectedOptionId, this.userDetails.id).subscribe(data => {
      this.router.navigate(['/exam']);
    });
  }

  continueTest() {
    this.sharedGameDataService.setGameId(this.gameId);
    this.router.navigate(['/exam']);
  }
}
