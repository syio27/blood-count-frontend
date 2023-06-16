import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGameResponse } from 'src/app/interfaces/IGameResponse';

@Injectable({
  providedIn: 'root'
})
export class SharedGameDataService {
  private startTestSubject = new BehaviorSubject<IGameResponse | null>(null);
  startTest$ = this.startTestSubject.asObservable();

  constructor() {
    const storedData = localStorage.getItem('gameData');
    if (storedData) {
      this.startTestSubject.next(JSON.parse(storedData));
    }
  }

  startTest(data: IGameResponse) {
    this.startTestSubject.next(data);
    localStorage.setItem('gameData', JSON.stringify(data));
  }
}
