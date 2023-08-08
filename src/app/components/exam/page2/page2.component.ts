import { Component,Input } from '@angular/core';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';


@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css']
})
export class Page2Component {
   
  @Input() msAssesmentTest: any[]
  @Input() answers: IAnswerRequest[] = []; 
  @Input() isTestValid: boolean; 

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
