import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedGameDataService {
  private gameid = new BehaviorSubject<number | null>(null);
  gameid$ = this.gameid.asObservable();

  setGameId(id: number) {
    this.gameid.next(id);
  }
}
