import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedGameSubmittedService {
  private gameStatus = new BehaviorSubject<string>("IN_PROGRESS");
  gameStatus$ = this.gameStatus.asObservable();

  setStatus(status: string) {
    this.gameStatus.next(status);
  }
}
