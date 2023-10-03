import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SharedGameSubmittedService } from '../shared/shared-game-submitted.service';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(
    private sharedGameSubmittedService: SharedGameSubmittedService,
    private dialog: MatDialog
  ) { }

  canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
    return this.sharedGameSubmittedService.gameStatus$.pipe(
      take(1),
      switchMap((submitted: string) => {
        if (submitted !== 'IN_PROGRESS') {
          return of(true);
        }

        return this.openDialog().pipe(
          map((result: boolean) => {
            if (result) {
              return true;
            } else {
              return false;
            }
          })
        );
      })
    );
  }

  openDialog(): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogComponent);

    return dialogRef.afterClosed().pipe(
      map((result) => {
        return result === true;
      })
    );
  }
}
