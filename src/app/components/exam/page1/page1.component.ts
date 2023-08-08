import { Component, Input } from '@angular/core';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.css']
})
export class Page1Component {
  @Input() displayedElements: any[];
  @Input() displayedElements2: any[];
  @Input() gender: string;
  @Input() age: number;
  @Input() answers: IAnswerRequest[] = []; 
  @Input() testData: any[]; 
  @Input() isTestValid: boolean; 


  onAnswer(answerId: number, questionId: number) {
    const existingAnswer = this.answers.find(a => a.questionId === questionId);
    if (existingAnswer) {
      existingAnswer.answerId = answerId;
    } else {
      this.answers.push({ questionId, answerId });
    }
    if(this.answers.length == this.testData.length){
      this.isTestValid = true
    }
    else{
      this.isTestValid = false

    }
  }
}
