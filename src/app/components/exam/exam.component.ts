import { Component, OnInit, HostListener } from '@angular/core';
import { IGameResponse } from 'src/app/interfaces/IGameResponse';
import { CanDeactivateGuard } from 'src/app/services/can-deactivate.guard';
import { GameService } from 'src/app/services/game.service';
import { SharedUserDetailsService } from '../../services/shared-user-details.service'
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';
import { Router, NavigationStart } from '@angular/router';
import { SavedUserAnswerResponse } from 'src/app/interfaces/SavedUserAnswerResponse';
import { Pages } from 'src/app/enums/pages';
import { switchMap } from 'rxjs/operators';
import { SharedGameSubmittedService } from 'src/app/services/shared-game-submitted.service';
import { CanComponentDeactivate } from 'src/app/services/can-deactivate.guard';
import { filter } from 'rxjs/operators';
import { IGameCaseDetailsResponse } from 'src/app/interfaces/IGameCaseResponse';
import { NotifierService } from 'angular-notifier';
import { IBloodCountResponse } from 'src/app/interfaces/IBloodCountResponse';


@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, CanComponentDeactivate {

  tableData: IBloodCountResponse[] = [];
  testData = [];
  age: number
  gender: string
  answers: IAnswerRequest[] = [];
  gameId: number
  userDetails: UserDetails;
  submitted = 'IN_PROGRESS';
  score: number
  isTestValid: boolean
  savedAnswers: SavedUserAnswerResponse[] = []
  msAssesmentTest = []
  currentPage: Pages
  gameData: IGameResponse
  isNextClicked: boolean
  gameCaseDetails: IGameCaseDetailsResponse
  percentScore: number
  noTimer: boolean
  private readonly notifier: NotifierService;


  constructor(
    private gameService: GameService,
    private sharedUserService: SharedUserDetailsService,
    private router: Router,
    private sharedGameSubmittedService: SharedGameSubmittedService,
    notifierService: NotifierService
  ) {

    this.notifier = notifierService;
    this.nextPage = this.nextPage.bind(this)
    // auto save the selected answers when user normally navigates in the app within the router
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (this.gameId) {
        this.autoSave();
      }
    });
    this.submitTest = this.submitTest.bind(this)
  }

  // auto save the selected answers when user refreshes app/closes tab
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.autoSave();
  }

  private autoSave() {
    this.gameService.autoSave(this.gameId, this.userDetails.id, this.answers).subscribe()
  }

  ngOnInit() {
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
    this.gameService.checkIfAnyInProgress(this.userDetails.id)
      .pipe(
        switchMap(response => {
          this.gameId = response.gameId;
          return this.gameService.getInProgressGame(this.gameId, this.userDetails.id);
        })
      )
      .subscribe(
        (data) => {
          this.savedAnswers = data.savedUserAnswers;
          this.currentPage = data.currentPage;
          this.gameData = data;
          const { patient, bcAssessmentQuestions, msQuestions } = this.gameData;
          const bloodCount = patient.bloodCounts;
          this.gender = patient.gender;
          this.age = patient.age;
          this.tableData = bloodCount;
          this.testData = bcAssessmentQuestions;
          this.gameId = this.gameData.id;
          this.msAssesmentTest = msQuestions;
          this.gameCaseDetails = data.gameCaseDetails
          console.log(this.testData);
          console.log(this.msAssesmentTest)
          console.log(this.tableData)
        },
      );
  }

  canDeactivate() {
    return window.confirm('You are currently on the exam page. Are you sure you want to leave?');
  }

  // SORT BY ID BEFORE SLICE
  get displayedElements() {
    return this.testData.slice(0, 8);
  }

  // SORT BY ID BEFORE SLICE
  get displayedElements2() {
    let sortedTableDate = this.sortArrayById(this.tableData);
    return sortedTableDate.slice(8, 20);
  }

  sortArrayById(arr: IBloodCountResponse[]): IBloodCountResponse[] {
    const copy = [...arr];
    return copy.sort((a, b) => a.id - b.id);
  }

  private invokeNextApi(mergedAnswers: any[]) {
    this.gameService.next(this.gameId, this.userDetails.id, mergedAnswers).subscribe(
      data =>
        this.currentPage = data.currentPage
    )
  }

  private invokeCompleteApi(mergedAnswers: any[]) {
    this.gameService.complete(this.gameId, mergedAnswers, this.userDetails.id).subscribe(
      (data) => {
        this.submitted = data.status
        this.sharedGameSubmittedService.setStatus(data.status)
        this.score = data.score
        this.percentScore = this.score * 100 / (this.testData.length + this.msAssesmentTest.length)
      }
    )
  }

  nextPage() {
    const mergedAnswers: any[] = [...this.answers, ...this.savedAnswers].filter((value, index, self) => {
      return index === self.findIndex((v) => v.questionId === value.questionId);
    });
    if (this.currentPage == "ONE") {
      if (mergedAnswers.length == this.testData.length) {
        this.invokeNextApi(mergedAnswers);
      }
      else {
        this.notifier.notify('default', 'You need to fulfill all the questions');
      }
      return;
    }

    if (this.currentPage == "TWO") {
      if (mergedAnswers.length == this.msAssesmentTest.length + this.testData.length) {
        this.invokeNextApi(mergedAnswers);
      }
      else {
        this.notifier.notify('default', 'You need to fulfill all the questions');

      }
      return;
    }
  }


  submitTest() {
    const mergedAnswers: any[] = [...this.answers, ...this.savedAnswers].filter((value, index, self) => {
      return index === self.findIndex((v) => v.questionId === value.questionId);
    });
    this.invokeCompleteApi(mergedAnswers);
    this.noTimer = true
  }
}