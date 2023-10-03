import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedAppService {
  private inProgress = new BehaviorSubject<boolean>(false);
  data$ = this.inProgress.asObservable();

  setData(data: boolean) {
    this.inProgress.next(data);
  }
}