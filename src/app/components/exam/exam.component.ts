import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { SharedGameDataService } from 'src/app/services/shared-game-data.service';
import { IGameResponse } from 'src/app/interfaces/IGameResponse';
import { CanDeactivateGuard } from 'src/app/services/can-deactivate.guard';
import { GameService } from 'src/app/services/game.service';
import { SharedUserDetailsService } from '../../services/shared-user-details.service'
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';
import { Router, NavigationStart } from '@angular/router';
import { SavedUserAnswerResponse } from 'src/app/interfaces/SavedUserAnswerResponse';
import { Pages } from 'src/app/enums/pages';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, CanDeactivateGuard {
  
  tabelData = [];
  testData = [];
  age: number
  gender: string
  answers: IAnswerRequest[] = [];
  gameId: number
  userDetails: UserDetails;
  submitted = 'IN_PROGRESS';
  score: number
  isTestValid: boolean
  page: string
  savedAnswers: SavedUserAnswerResponse[]=[]
  msAssesmentTest = []
  currentPage: Pages

  constructor(
    private sharedGameDataService: SharedGameDataService,
    private gameService: GameService,
    private sharedUserService: SharedUserDetailsService,
    private router: Router
  ) {
    this.nextPage = this.nextPage.bind(this)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.url !== '/exam' && localStorage.getItem('submitted') === 'COMPLETED') {
        localStorage.removeItem('submitted');
        localStorage.removeItem('score');
        localStorage.removeItem('gameData');
        localStorage.removeItem('page')

      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.gameService.autoSave(this.gameId, this.userDetails.id, this.answers).subscribe()    
  }

  ngOnInit() {
    this.fetchData();
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
    const storedScore = localStorage.getItem('score');
    if (storedScore) {
      this.score = JSON.parse(storedScore);
    }
    this.gameService.getInProgressGame(this.gameId, this.userDetails.id).subscribe(
      (data)=>{
        this.savedAnswers = data.savedUserAnswers
        this.currentPage = data.currentPage
      }
    )
    
    const storedSubmition = localStorage.getItem('submitted');
    if (storedSubmition) {
      this.submitted = storedSubmition;
    }
    this.page = localStorage.getItem('page')
  }

  canDeactivate() {
    return window.confirm('You are currently on the exam page. Are you sure you want to leave?');
  }

  fetchData() {
    this.sharedGameDataService.startTest$.subscribe((gameData: IGameResponse) => {
      if (gameData) {
        const { patient, bcAssessmentQuestions, msQuestions } = gameData;
        const bloodCount = patient.bloodCounts;
        this.gender = patient.gender
        this.age = patient.age
        this.tabelData = bloodCount;
        this.testData = bcAssessmentQuestions;
        this.gameId = gameData.id
        this.msAssesmentTest = msQuestions
      }
    });
  }

  get displayedElements() {
    return this.testData.slice(0, 8);
  }

  get displayedElements2() {
    return this.tabelData.slice(8, 20);
  }

  nextPage(){
    this.gameService.next(this.gameId, this.userDetails.id, this.answers).subscribe(
      data => 
      this.currentPage = data.currentPage
    )
  }


  submitTest() {
    console.log(this.answers)
    this.gameService.complete(this.gameId, this.answers, this.userDetails.id).subscribe(
      (data) => {
        this.submitted = data.status
        localStorage.setItem('page', 'finish')
        this.page = localStorage.getItem('page')
        localStorage.setItem('submitted', this.submitted)
        this.score = data.score
        localStorage.setItem('score', this.score.toString())
      }
    )
  }
  onFinish() {
    this.router.navigate(['/'])
  }
  
}
