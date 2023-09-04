import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SharedGameSubmittedService } from './shared-game-submitted.service';
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
  ) {}

  canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
    // Use an observable to get the submitted value
    return this.sharedGameSubmittedService.gameStatus$.pipe(
      take(1), // Ensure we only take one value and unsubscribe
      switchMap((submitted: string) => {
        if (submitted !== 'IN_PROGRESS') {
          return of(true); // Game is not in progress, allow deactivation
        }

        // Game is in progress, open the dialog
        return this.openDialog().pipe(
          map((result: boolean) => {
            if (result) {
              return true; // User confirmed, allow deactivation
            } else {
              return false; // User canceled, prevent deactivation
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
        return result === true; // Assuming 'true' means confirmation, 'false' means cancelation
      })
    );
  }
}
