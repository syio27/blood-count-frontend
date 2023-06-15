import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseDataService {
  private refreshTableSource = new Subject<void>();
  refreshTable$ = this.refreshTableSource.asObservable();

  refreshTable() {
    this.refreshTableSource.next();
  }
}
