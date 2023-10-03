import { Component, Input } from '@angular/core';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';
import { SavedUserAnswerResponse } from 'src/app/interfaces/SavedUserAnswerResponse';
import { GameService } from 'src/app/services/game.service';
import { IGameCaseDetailsResponse } from 'src/app/interfaces/IGameCaseResponse';

@Component({
  selector: 'submission-page',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent {
  @Input() userDetails: UserDetails
  @Input() gender: string
  @Input() age: number
  @Input() tableData: any[]
  @Input() submitGame!: (callback?: () => void) => void
  @Input() savedAnswers: SavedUserAnswerResponse[]
  @Input() answers: IAnswerRequest[] = [];
  @Input() gameCaseDetails: IGameCaseDetailsResponse

  isButtonClicked: boolean = false;

  constructor(
    private gameService: GameService
  ) { }

  handleSubmitGame() {
    if (!this.isButtonClicked) {
      this.submitGame(() => {
        this.isButtonClicked = true;
        console.log(this.isButtonClicked)
      });
    }
  }
}
