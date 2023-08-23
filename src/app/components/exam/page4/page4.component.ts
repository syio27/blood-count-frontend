import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IGameCaseDetailsResponse } from 'src/app/interfaces/IGameCaseResponse';

@Component({
  selector: 'app-page4',
  templateUrl: './page4.component.html',
  styleUrls: ['./page4.component.css']
})
export class Page4Component {

  @Input() score: number
  @Input() gameCaseDetails: IGameCaseDetailsResponse
  @Input() age: number
  @Input() gender: string
  @Input() testData: any[];
  @Input() msAssesmentTest: any[]
  @Input() percentScore: number


  constructor(
    private router: Router,
  ) 
  {
    
  }

  onFinish() {
    this.router.navigate(['/'])
  }
}
