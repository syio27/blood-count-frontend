import { Component,Input } from '@angular/core';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';
import { SavedUserAnswerResponse } from 'src/app/interfaces/SavedUserAnswerResponse';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css']
})
export class Page2Component {
   
  @Input() msAssesmentTest: any[]
  @Input() answers: IAnswerRequest[] = []; 
  @Input() isTestValid: boolean; 
  @Input() savedAnswers: SavedUserAnswerResponse[]


  isAnswerSelected(questionId: number, answerId: number): boolean {
    return this.savedAnswers.some(answer => answer.questionId === questionId && answer.answerId === answerId);
  }

  onAnswer(answerId: number, questionId: number) {
    const existingAnswer = this.answers.find(a => a.questionId === questionId);
    if (existingAnswer) {
      existingAnswer.answerId = answerId;
    } else {
      this.answers.push({ questionId, answerId });
    }
    if(this.answers.length == this.msAssesmentTest.length){
      this.isTestValid = true
    }
    else{
      this.isTestValid = false

    }
  }

}
