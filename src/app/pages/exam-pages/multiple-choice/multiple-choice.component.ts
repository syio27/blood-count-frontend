import { Component, Input } from '@angular/core';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';
import { SavedUserAnswerResponse } from 'src/app/interfaces/SavedUserAnswerResponse';
import { Pages } from 'src/app/enums/pages';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { GameService } from 'src/app/services/game.service';
import { IMSQuestionResponse } from 'src/app/interfaces/IMSQuestionResponse';


@Component({
  selector: 'multiple-choice-page',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.css']
})
export class MultipleChoiceComponent {

  @Input() msAssesmentTest: IMSQuestionResponse[]
  @Input() answers: IAnswerRequest[] = [];
  @Input() isTestValid: boolean;
  @Input() savedAnswers: SavedUserAnswerResponse[]
  @Input() gameId: number
  @Input() userDetails: UserDetails;
  @Input() currentPage: Pages
  @Input() testData: any[];
  @Input() nextPage!: (callback?: () => void) => void

  isButtonClicked = false;

  constructor(
    private gameService: GameService
  ) { }

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
  }

  handleNextPage() {
    if (!this.isButtonClicked) {
      this.nextPage(() => {
        this.isButtonClicked = true;
      });
    }
  }
}
