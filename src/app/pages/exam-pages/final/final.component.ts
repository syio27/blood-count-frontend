import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IGameCaseDetailsResponse } from 'src/app/interfaces/IGameCaseResponse';

@Component({
  selector: 'final-page',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css']
})
export class FinalComponent {

  @Input() score: number
  @Input() gameCaseDetails: IGameCaseDetailsResponse
  @Input() age: number
  @Input() gender: string
  @Input() testData: any[];
  @Input() msAssesmentTest: any[]
  @Input() percentScore: number


  constructor(
    private router: Router,
  ) {

  }

  onFinish() {
    this.router.navigate(['/'])
  }
}
