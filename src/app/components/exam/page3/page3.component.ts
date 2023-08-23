import { Component,Input } from '@angular/core';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { IAnswerRequest } from 'src/app/interfaces/IAnswerRequest';
import { SavedUserAnswerResponse } from 'src/app/interfaces/SavedUserAnswerResponse';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-page3',
  templateUrl: './page3.component.html',
  styleUrls: ['./page3.component.css']
})
export class Page3Component {
  @Input() userDetails: UserDetails
  @Input() gender: string
  @Input() age: number
  @Input() tableData: any[]
  @Input() submitTest!: () => void
  @Input() savedAnswers: SavedUserAnswerResponse[]
  @Input() answers: IAnswerRequest[] = [];

  constructor(
    private gameService: GameService
  ) {

  }

}
