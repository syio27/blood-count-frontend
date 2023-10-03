import { Component, Input } from '@angular/core';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';
import { SavedUserAnswerResponse } from 'src/app/interfaces/SavedUserAnswerResponse';
import { GameService } from 'src/app/services/game.service';
import { Pages } from 'src/app/enums/pages';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { IGameCaseDetailsResponse } from 'src/app/interfaces/IGameCaseResponse';

@Component({
  selector: 'bc-assessment-page',
  templateUrl: './bc-assessment.component.html',
  styleUrls: ['./bc-assessment.component.css']
})
export class BCAssessmentComponent {
  @Input() displayedElements: any[];
  @Input() displayedElements2: any[];
  @Input() gender: string;
  @Input() age: number;
  @Input() answers: IAnswerRequest[] = [];
  @Input() testData: any[];
  @Input() isTestValid: boolean;
  @Input() savedAnswers: SavedUserAnswerResponse[]
  @Input() gameId: number
  @Input() userDetails: UserDetails;
  @Input() currentPage: Pages
  @Input() gameCaseDetails: IGameCaseDetailsResponse
  @Input() nextPage!: (callback?: () => void) => void

  isButtonClicked = false;

  constructor(
    private gameService: GameService
  ) {

  }

  isAnswerSelected(questionId: number, answerId: number): boolean {
    return this.savedAnswers.some(answer => answer.questionId === questionId && answer.answerId === answerId);
  }

  get sortedDisplayedElements() {
    this.displayedElements.forEach(item => {
      item.answers.sort((a, b) => a.id - b.id);
      item.answers.reverse();
    });
    return this.displayedElements;
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
