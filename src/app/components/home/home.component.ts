import { Component, OnInit, ViewChild } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { ICaseResponse } from 'src/app/interfaces/ICaseResponse';
import { TimerComponent } from '../exam/timer/timer.component';
import { Router, NavigationExtras } from "@angular/router";
import { GameService } from 'src/app/services/game.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { SharedGameDataService } from 'src/app/services/shared-game-data.service';
import { SharedAppService } from 'src/app/services/shared-app.service';
import { switchMap } from 'rxjs/operators';
import { response } from 'express';

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
  inProgress: boolean

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
    // this.sharedUserService.getUserDetails().pipe(
    //   switchMap(userDetails => {
    //     return this.gameService.checkIfAnyInProgress(userDetails.id);
    //   })
    // ).subscribe(data => {
    //   this.inProgress = data;
    //   console.log(" has game in progress - " + data)
    // });

    this.fetchCase();
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
    this.sharedGameDataService.startTest$.subscribe(() => {
      const storedSubmition = localStorage.getItem('submitted');
      if (storedSubmition) {
        this.isTestFinished = storedSubmition;
      }
    });
    if (this.isTestFinished == 'IN_PROGRESS') {
      this.sharedGameDataService.startTest$.subscribe(data => {
        if (data && data.status) {
          this.selectedOption = 'Your game is running, please press button';
        }
      });
    }

    this.gameService.checkIfAnyInProgress(this.userDetails.id).subscribe(response => {
      this.inProgress = response;
      console.log("has game in progress: " + this.inProgress);
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
      this.sharedGameDataService.startTest(data);
      localStorage.setItem('submitted', 'IN_PROGRESS')
      localStorage.setItem('page', 'page1')
      this.router.navigate(['/exam']);
    });
  }
  continueTest() {
    this.router.navigate(['/exam']);
  }
}
